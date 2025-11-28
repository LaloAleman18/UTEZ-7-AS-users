const User = require('../models/User');

/**
 * Create a new user
 * POST /api/users
 * Note: Registration/Login should be handled by the Auth service
 * This endpoint is for admin user creation or internal use
 */
const createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'Usuario creado correctamente',
      data: userResponse,
    });
  } catch (error) {
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'El correo ya existe',
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: messages,
      });
    }

    next(error);
  }
};

/**
 * Get current user profile
 * GET /api/users/profile
 * Uses X-User-Id header from API Gateway
 */
const getProfile = async (req, res, next) => {
  try {
    // Get user ID from API Gateway header or JWT token
    const userId = req.user?.id || req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
      });
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido',
      });
    }
    next(error);
  }
};

/**
 * Update authenticated user's profile
 * PUT /api/users/profile
 * Uses X-User-Id header from API Gateway or JWT token
 */
const updateProfile = async (req, res, next) => {
  try {
    // Get user ID from API Gateway header or JWT token
    const userId = req.user?.id || req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
      });
    }

    // Don't allow password updates through this endpoint
    const { password, ...updateData } = req.body;

    // Handle marketing consent separately if provided
    if (updateData.marketingConsent !== undefined) {
      updateData.marketingConsentUpdatedAt = new Date();
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Perfil actualizado correctamente',
      data: user,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido',
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'El correo ya existe',
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: messages,
      });
    }

    next(error);
  }
};

/**
 * Update marketing consent
 * PUT /api/users/marketing-consent
 * Uses X-User-Id header from API Gateway or JWT token
 */
const updateMarketingConsent = async (req, res, next) => {
  try {
    // Get user ID from API Gateway header or JWT token
    const userId = req.user?.id || req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
      });
    }

    const { marketingConsent } = req.body;

    if (marketingConsent === undefined) {
      return res.status(400).json({
        success: false,
        message: 'El campo marketingConsent es requerido',
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        marketingConsent,
        marketingConsentUpdatedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Preferencia de marketing actualizada correctamente',
      data: {
        marketingConsent: user.marketingConsent,
        marketingConsentUpdatedAt: user.marketingConsentUpdatedAt,
      },
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido',
      });
    }
    next(error);
  }
};

/**
 * Get user by ID (for internal use or admin)
 * GET /api/users/:id
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido',
      });
    }
    next(error);
  }
};

/**
 * Get all users (for admin)
 * GET /api/users
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete authenticated user's account
 * DELETE /api/users
 * Uses X-User-Id header from API Gateway or JWT token
 */
const deleteUser = async (req, res, next) => {
  try {
    // Get user ID from API Gateway header or JWT token
    const userId = req.user?.id || req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
      });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Usuario eliminado correctamente',
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido',
      });
    }
    next(error);
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getProfile,
  updateProfile,
  updateMarketingConsent,
  deleteUser,
};

