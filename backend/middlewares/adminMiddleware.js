const { isAdmin } = require('../utils/auth');

const adminMiddleware = (req, res, next) => {
  if (!req.user || !isAdmin(req.user.role)) {
    return res.status(403).json({ message: 'Access forbidden: Admins only.' });
  }
  next();
};

module.exports = adminMiddleware;