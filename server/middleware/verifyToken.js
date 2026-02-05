import jwt from 'jsonwebtoken';

/**
 * Middleware to verify JWT tokens on protected routes
 *
 * How it works:
 * 1. Extracts token from Authorization header (format: "Bearer <token>")
 * 2. Verifies token using JWT_SECRET
 * 3. If valid: attaches user info to req.user and continues
 * 4. If invalid: returns 401 Unauthorized
 */
const verifyToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Access denied. No token provided.'
    });
  }

  // Extract token (remove "Bearer " prefix)
  const token = authHeader.substring(7);

  try {
    // Verify token and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object for use in route handlers
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };

    // Continue to next middleware or route handler
    next();
  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({
      error: 'Invalid or expired token.'
    });
  }
};

export default verifyToken;
