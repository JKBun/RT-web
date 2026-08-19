const User = require('../models/User');

exports.requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid token.' });
  }

  const token = authHeader.split(' ')[1];
  const parts = token.split('_');
  const userId = parts[2];

  if (!userId) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Malformed token.' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized: User not found.' });
  }

  req.user = user;
  next();
};

exports.requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden: Insufficient role permissions.' });
    }
    next();
  };
};
