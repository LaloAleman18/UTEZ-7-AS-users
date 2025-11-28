const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Swagger configuration
 * Defines the OpenAPI specification for the Users Management Microservice
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Users Management Microservice API',
      version: '1.0.0',
      description: 'RESTful API for managing users with Node.js, Express, and MongoDB. Perfil de usuario, preferencias, consentimiento para marketing y gestión de datos personales.',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}`,
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Users',
        description: 'Users management endpoints',
      },
      {
        name: 'General',
        description: 'General endpoints',
      },
    ],
    components: {
      securitySchemes: {
        ApiGatewayAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-User-Id',
          description: 'User ID provided by API Gateway after JWT validation',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier for the user',
              example: '507f1f77bcf86cd799439011',
            },
            firstName: {
              type: 'string',
              description: 'User first name',
              maxLength: 100,
              example: 'Juan',
            },
            lastName: {
              type: 'string',
              description: 'User last name',
              maxLength: 100,
              example: 'Pérez',
            },
            fullName: {
              type: 'string',
              description: 'Virtual field: User full name (firstName + lastName)',
              readOnly: true,
              example: 'Juan Pérez',
            },
            role: {
              type: 'string',
              enum: ['ORGANIZER', 'ADMIN', 'CLIENT'],
              description: 'User role',
              default: 'CLIENT',
              example: 'CLIENT',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'juan.perez@example.com',
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the user account is active',
              default: true,
              example: true,
            },
            termsAccepted: {
              type: 'boolean',
              description: 'Whether user accepted terms and conditions',
              default: false,
              example: true,
            },
            termsAcceptedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date when terms were accepted',
              example: '2024-01-15T10:30:00Z',
            },
            marketingConsent: {
              type: 'boolean',
              description: 'Whether user wants to receive marketing promotions',
              default: false,
              example: false,
            },
            marketingConsentUpdatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date when marketing consent was last updated',
              example: '2024-01-15T10:30:00Z',
            },
            profile: {
              type: 'object',
              description: 'User profile information',
              properties: {
                phone: {
                  type: 'string',
                  maxLength: 20,
                  example: '+52 1234567890',
                },
                address: {
                  type: 'string',
                  maxLength: 500,
                  example: 'Calle Principal 123',
                },
                dateOfBirth: {
                  type: 'string',
                  format: 'date',
                  example: '1990-01-15',
                },
              },
            },
            lastLogin: {
              type: 'string',
              format: 'date-time',
              description: 'Last login timestamp',
              example: '2024-01-15T10:30:00Z',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
              example: '2024-01-15T10:30:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp',
              example: '2024-01-15T10:30:00Z',
            },
          },
        },
        UserRegisterInput: {
          type: 'object',
          required: ['fullName', 'email', 'password', 'confirmPassword', 'termsAccepted'],
          properties: {
            fullName: {
              type: 'string',
              description: 'User full name',
              maxLength: 200,
              example: 'Juan Pérez',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'juan.perez@example.com',
            },
            password: {
              type: 'string',
              description: 'User password (minimum 8 characters)',
              minLength: 8,
              example: 'password123',
            },
            confirmPassword: {
              type: 'string',
              description: 'Password confirmation',
              example: 'password123',
            },
            termsAccepted: {
              type: 'boolean',
              description: 'Must be true to register',
              example: true,
            },
          },
        },
        UserLoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'juan.perez@example.com',
            },
            password: {
              type: 'string',
              description: 'User password',
              example: 'password123',
            },
          },
        },
        UserProfileUpdateInput: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
              description: 'User first name',
              maxLength: 100,
              example: 'Juan Carlos',
            },
            lastName: {
              type: 'string',
              description: 'User last name',
              maxLength: 100,
              example: 'Pérez',
            },
            role: {
              type: 'string',
              enum: ['ORGANIZER', 'ADMIN', 'CLIENT'],
              description: 'User role',
              example: 'CLIENT',
            },
            profile: {
              type: 'object',
              properties: {
                phone: {
                  type: 'string',
                  maxLength: 20,
                  example: '+52 1234567890',
                },
                address: {
                  type: 'string',
                  maxLength: 500,
                  example: 'Calle Principal 123',
                },
                dateOfBirth: {
                  type: 'string',
                  format: 'date',
                  example: '1990-01-15',
                },
              },
            },
            marketingConsent: {
              type: 'boolean',
              description: 'Whether user wants to receive marketing promotions',
              example: true,
            },
          },
        },
        UserRegisterResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Usuario registrado correctamente',
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User',
                },
                token: {
                  type: 'string',
                  description: 'JWT token for authentication',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
              },
            },
          },
        },
        UserLoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Inicio de sesión exitoso',
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User',
                },
                token: {
                  type: 'string',
                  description: 'JWT token for authentication',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
              },
            },
          },
        },
        SuccessUserResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              $ref: '#/components/schemas/User',
            },
          },
        },
        SuccessUserListResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            count: {
              type: 'number',
              example: 10,
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/User',
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message description',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/app.js'], // Paths to files containing OpenAPI definitions
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

