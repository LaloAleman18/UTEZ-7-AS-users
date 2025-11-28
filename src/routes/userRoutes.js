const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  createUser,
  getUsers,
  getUserById,
  getProfile,
  updateProfile,
  updateMarketingConsent,
  deleteUser,
} = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users management endpoints
 *   note: Authentication (login/register) is handled by the Auth service
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - ApiGatewayAuth: []
 *     parameters:
 *       - in: header
 *         name: X-User-Id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID from API Gateway
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessUserResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/profile', authenticate, getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - ApiGatewayAuth: []
 *     parameters:
 *       - in: header
 *         name: X-User-Id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID from API Gateway
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserProfileUpdateInput'
 *           example:
 *             firstName: "Juan Carlos"
 *             lastName: "Pérez"
 *             profile:
 *               phone: "+52 1234567890"
 *               address: "Calle Principal 123"
 *               dateOfBirth: "1990-01-15"
 *             marketingConsent: true
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessUserResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('/profile', authenticate, updateProfile);

/**
 * @swagger
 * /api/users/marketing-consent:
 *   put:
 *     summary: Update marketing consent preference
 *     tags: [Users]
 *     security:
 *       - ApiGatewayAuth: []
 *     parameters:
 *       - in: header
 *         name: X-User-Id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID from API Gateway
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - marketingConsent
 *             properties:
 *               marketingConsent:
 *                 type: boolean
 *                 description: Whether user wants to receive marketing promotions
 *                 example: true
 *     responses:
 *       200:
 *         description: Marketing consent updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Preferencia de marketing actualizada correctamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     marketingConsent:
 *                       type: boolean
 *                     marketingConsentUpdatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('/marketing-consent', authenticate, updateMarketingConsent);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - ApiGatewayAuth: []
 *     parameters:
 *       - in: header
 *         name: X-User-Id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID from API Gateway
 *       - in: header
 *         name: X-User-Roles
 *         required: false
 *         schema:
 *           type: string
 *         description: Comma-separated list of user roles
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessUserListResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - ApiGatewayAuth: []
 *     parameters:
 *       - in: header
 *         name: X-User-Id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID from API Gateway
 *       - in: header
 *         name: X-User-Roles
 *         required: false
 *         schema:
 *           type: string
 *         description: Comma-separated list of user roles
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessUserListResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Server error
 */
router.get('/', authenticate, authorize('ADMIN'), getUsers);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [Users]
 *     security:
 *       - ApiGatewayAuth: []
 *     parameters:
 *       - in: header
 *         name: X-User-Id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID from API Gateway
 *       - in: header
 *         name: X-User-Roles
 *         required: false
 *         schema:
 *           type: string
 *         description: Comma-separated list of user roles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Server error
 */
router.post('/', authenticate, authorize('ADMIN'), createUser);

/**
 * @swagger
 * /api/users:
 *   delete:
 *     summary: Delete authenticated user's account
 *     tags: [Users]
 *     security:
 *       - ApiGatewayAuth: []
 *     parameters:
 *       - in: header
 *         name: X-User-Id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID from API Gateway
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete('/', authenticate, deleteUser);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - ApiGatewayAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "507f1f77bcf86cd799439011"
 *       - in: header
 *         name: X-User-Id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID from API Gateway
 *       - in: header
 *         name: X-User-Roles
 *         required: false
 *         schema:
 *           type: string
 *         description: Comma-separated list of user roles
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessUserResponse'
 *       400:
 *         description: Invalid user ID format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticate, authorize('ADMIN'), getUserById);

module.exports = router;

