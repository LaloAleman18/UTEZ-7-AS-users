const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication and Authorization Middleware
 * 
 * Supports two authentication methods:
 * 1. API Gateway headers (X-User-Id, X-User-Roles)
 * 2. JWT Bearer tokens (Authorization: Bearer <token>)
 */
/**
 * Middleware to authenticate requests
 * Supports both API Gateway headers and JWT Bearer tokens
 */
const authenticate = async (req, res, next) => {
  try {
    // Try API Gateway headers first
    const userIdFromHeader = req.headers['x-user-id'];
    const userRolesHeader = req.headers['x-user-roles'];

    if (userIdFromHeader) {
      // API Gateway authentication
      const userRoles = userRolesHeader
        ? userRolesHeader.split(',').map(role => role.trim()).filter(role => role.length > 0)
        : [];

      req.user = {
        id: userIdFromHeader,
        roles: userRoles,
      };
      req.userId = userIdFromHeader;
      return next();
    }

    // Try JWT Bearer token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database (excluding password)
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Usuario no encontrado',
          });
        }

        if (!user.isActive) {
          return res.status(401).json({
            success: false,
            message: 'Usuario inactivo. Contacte al administrador',
          });
        }

        // Attach user to request object
        req.user = user;
        req.userId = decoded.id;

        return next();
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            message: 'Token expirado',
          });
        }

        if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({
            success: false,
            message: 'Token inválido',
          });
        }

        throw error;
      }
    }

    // No authentication method found
    return res.status(401).json({
      success: false,
      message: 'No autorizado: Se requiere autenticación (X-User-Id header o Bearer token)',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error de autenticación',
      error: error.message,
    });
  }
};

/**
 * Middleware to authorize requests based on user roles
 * @param {...string} allowedRoles - Roles that are allowed to access the route
 * @returns {Function} Express middleware function
 * 
 * Usage:
 * router.get('/admin-only', authenticate, authorize('ADMIN'), controller);
 * router.post('/admin-or-organizer', authenticate, authorize('ADMIN', 'ORGANIZER'), controller);
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Ensure user is authenticated first
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado: Usuario no autenticado',
      });
    }

    // Get user role from different sources
    let userRole = null;
    
    // If user is a full object (from JWT), get role from user.role
    if (req.user.role) {
      userRole = req.user.role;
    }
    // If user is from API Gateway headers, check roles array
    else if (req.user.roles && req.user.roles.length > 0) {
      // For API Gateway, roles might be lowercase, convert to uppercase
      userRole = req.user.roles[0].toUpperCase();
    }

    // Check if user has at least one of the required roles
    // Convert allowedRoles to uppercase for comparison
    const allowedRolesUpper = allowedRoles.map(role => role.toUpperCase());
    const hasRequiredRole = userRole && allowedRolesUpper.includes(userRole);

    if (!hasRequiredRole) {
      return res.status(403).json({
        success: false,
        message: `Prohibido: Se requiere uno de estos roles: ${allowedRoles.join(', ')}`,
        userRole: userRole,
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};

