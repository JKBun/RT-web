const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, nibmIndexNo, role, contactNo } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, error: 'Full name, email, and password are required.' });
    }

    const newUser = await User.create({ fullName, email, password, nibmIndexNo, role, contactNo });
    const { password_hash, ...safeUser } = newUser;
    return res.status(201).json({ success: true, message: 'User registered successfully!', user: safeUser });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const user = await User.findByEmail(email);
    if (!user || !User.verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ success: false, error: 'Invalid email or password credentials.' });
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

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.json({ success: true, count: users.length, users });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
