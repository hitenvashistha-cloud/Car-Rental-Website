const jwt = require('jsonwebtoken');

// Middleware to protect routes
const auth = (req, res, next) => {
  // Get Authorization header
  const authHeader = req.header('Authorization');

  // Check if no header
  if (!authHeader) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    });
  }

  // Extract token (remove "Bearer ")
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token. Access denied.' 
    });
  }
};

module.exports = auth;