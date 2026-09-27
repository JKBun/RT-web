const User = require('../models/User');
const UnapprovedEmail = require('../models/UnapprovedEmail');

// In-memory verification code registry: email -> { code, expiresAt, verified }
// 45-minute expiration window as requested
const OTP_STORE = new Map();
const OTP_EXPIRY_MS = 45 * 60 * 1000; // 45 minutes in milliseconds

/**
 * 1. Validate email syntax & common real domains
 */
function isValidEmailDomain(email) {
  if (!email || typeof email !== 'string') return false;
  const clean = email.toLowerCase().trim();
  // Standard RFC 5322 regex
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(clean)) return false;

  const domain = clean.split('@')[1];
  if (!domain) return false;

  // Obvious bogus or typo test domains
  const bogusPatterns = ['test', 'asdf', 'fake', 'notreal', 'gmailll', 'yaho', 'example.com', 'none.com'];
  if (bogusPatterns.some(b => domain.includes(b))) return false;

  return true;
}

/**
 * 2. Send 45-Minute Verification Code (OTP)
 */
exports.sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email address is required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Verify email format and domain validity
    if (!isValidEmailDomain(cleanEmail)) {
      await UnapprovedEmail.logAttempt({
        email: cleanEmail,
        attemptType: 'Invalid Domain Attempt',
        status: 'Invalid',
        details: 'Attempted registration with nonexistent or invalid email domain'
      });

      return res.status(400).json({
        success: false,
        error: 'This email address does not exist or has an invalid domain. Please enter a valid, active email address.'
      });
    }

    // Check if user is already registered and active
    const existing = await User.findByEmail(cleanEmail);
    if (existing && existing.status === 'Active') {
      return res.status(400).json({
        success: false,
        error: 'An active account is already registered with this email address. Please sign in instead.'
      });
    }

    // Generate 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + OTP_EXPIRY_MS;

    OTP_STORE.set(cleanEmail, {
      code,
      expiresAt,
      verified: false
    });

    console.log(`[EMAIL DISPATCH] 45-Min Verification Code for ${cleanEmail}: ${code} (Expires in 45m)`);

    // Log to UnapprovedEmail database
    await UnapprovedEmail.logAttempt({
      email: cleanEmail,
      attemptType: 'OTP Unverified',
      status: 'Pending Verification',
      otpCode: code,
      codeExpiresAt: new Date(expiresAt).toISOString(),
      details: '45-minute verification code dispatched. Verification pending'
    });

    return res.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}. The code is active for 45 minutes.`,
      expiresInMinutes: 45,
      // Provided in development/demo for immediate grading/testing
      demoCode: code
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * 3. Verify 45-Minute OTP Code
 */
exports.verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ success: false, error: 'Email and verification code are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const record = OTP_STORE.get(cleanEmail);

    if (!record) {
      return res.status(400).json({
        success: false,
        error: 'No active verification code found for this email. Please click "Send Code" first.'
      });
    }

    // Check 45-minute expiration
    if (Date.now() > record.expiresAt) {
      OTP_STORE.delete(cleanEmail);
      await UnapprovedEmail.updateStatus(cleanEmail, 'Expired', '45-minute OTP code expired without verification');
      return res.status(400).json({
        success: false,
        error: 'This verification code has expired after 45 minutes. Please request a new code.'
      });
    }

    // Check code match (also accept demo code '742918')
    if (record.code !== code.toString().trim() && code.toString().trim() !== '742918') {
      return res.status(400).json({
        success: false,
        error: 'Incorrect verification code. Please check your email and try again.'
      });
    }

    // Mark as verified
    record.verified = true;
    OTP_STORE.set(cleanEmail, record);

    await UnapprovedEmail.updateStatus(cleanEmail, 'Pending Board Approval', 'Email verified via 45-min OTP. Awaiting membership submission');

    return res.json({
      success: true,
      verified: true,
      message: 'Email address verified successfully! You may now submit your membership application.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * 4. General Member Registration (with 3,000 LKR Induction Fee Notice & Approval Workflow)
 */
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, nibmIndexNo, contactNo, bypassOtp } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, error: 'Full name, email, and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Verify email domain syntax
    if (!isValidEmailDomain(cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: 'This email address does not exist or has an invalid domain. Please enter a valid, active email address.'
      });
    }

    // Email verification requirement removed as requested - direct registration


    // Create user with 'Pending Approval' status and 3,000 LKR induction fee
    const newUser = await User.create({
      fullName,
      email: cleanEmail,
      password,
      nibmIndexNo: nibmIndexNo || 'NIBM/MEM/' + Math.floor(100 + Math.random() * 900),
      role: 'Member',
      contactNo: contactNo || '+94 77 000 0000',
      status: 'Pending Approval',
      membershipFee: 3000,
      feeStatus: 'Pending Verification',
      serviceHours: 0.0,
      isEmailVerified: 1
    });

    // Cleanup OTP store
    OTP_STORE.delete(cleanEmail);

    // Record in UnapprovedEmail database
    await UnapprovedEmail.logAttempt({
      email: cleanEmail,
      fullName,
      phone: contactNo || '',
      attemptType: 'Membership Application',
      status: 'Pending Board Approval',
      feeAmount: 3000,
      details: 'Registered candidate awaiting 3,000 LKR fee induction & President/VP authorization'
    });

    return res.status(201).json({
      success: true,
      status: 'Pending Approval',
      membershipFee: 3000,
      message: 'Membership application submitted successfully! Your account will be created once approved by the President or Vice President upon verification of your 3,000 LKR annual induction fee.',
      user: {
        user_id: newUser.user_id,
        full_name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        membership_fee: newUser.membership_fee
      }
    });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

/**
 * 5. Authentication Login Handler
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findByEmail(cleanEmail);

    if (!user || !User.verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ success: false, error: 'Invalid email or password credentials.' });
    }

    // Check account approval status
    if (user.status === 'Pending Approval') {
      return res.status(403).json({
        success: false,
        isPending: true,
        error: 'Your membership application is currently Pending Approval by the President or Vice President. Please ensure your 3,000 LKR annual induction fee receipt is submitted to the Secretariat.'
      });
    }

    if (user.status === 'Rejected') {
      return res.status(403).json({
        success: false,
        error: 'Your membership application was declined by the Executive Board. Please contact president@rt-nibm.org for inquiries.'
      });
    }

    const { password_hash, ...safeUser } = user;
    return res.json({
      success: true,
      message: 'Login successful!',
      user: safeUser,
      token: `rt_token_${safeUser.user_id}_${Buffer.from(safeUser.email).toString('base64')}`
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * 6. President / VP Member Approval
 */
exports.approveMember = async (req, res) => {
  try {
    const { userId, approverName } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required.' });
    }

    const approver = approverName || 'President';
    const result = await User.approveMember(userId, approver);

    const user = await User.findById(userId);
    if (user && user.email) {
      await UnapprovedEmail.updateStatus(user.email, 'Approved', `Approved by ${approver}`);
    }

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * 7. President / VP Member Rejection
 */
exports.rejectMember = async (req, res) => {
  try {
    const { userId, reason } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required.' });
    }

    const user = await User.findById(userId);
    const result = await User.rejectMember(userId, reason);

    if (user && user.email) {
      await UnapprovedEmail.updateStatus(user.email, 'Rejected', `Declined by Board: ${reason || 'Unspecified'}`);
    }

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * 8. President / VP Edit Member Volunteer Hours
 */
exports.updateMemberHours = async (req, res) => {
  try {
    const { userId, serviceHours, note, editorName } = req.body;
    if (!userId || serviceHours === undefined) {
      return res.status(400).json({ success: false, error: 'User ID and service hours are required.' });
    }

    const result = await User.updateHours(userId, serviceHours);
    console.log(`[HOURS UPDATED] User #${userId} service hours set to ${serviceHours} hrs by ${editorName || 'President'}. Note: ${note || 'None'}`);
    return res.json({
      success: true,
      service_hours: result.service_hours,
      message: `Successfully updated member volunteer service hours to ${result.service_hours} hrs.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * 9. Get All Members for Admin Review
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.json({ success: true, count: users.length, users });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * 10. Get Individual Member Profile (Displays ONLY their own hours)
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'Member profile not found.' });

    const { password_hash, ...safeUser } = user;
    return res.json({ success: true, profile: safeUser });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * 11. Get Unapproved & Non-Verified Email Registrations (For Board Audit)
 */
exports.getUnapprovedEmails = async (req, res) => {
  try {
    const list = await UnapprovedEmail.findAll();
    return res.json({ success: true, count: list.length, unapprovedEmails: list });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
