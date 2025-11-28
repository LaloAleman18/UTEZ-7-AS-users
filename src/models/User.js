const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * Defines the structure of a user document in MongoDB
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't return password by default
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [100, 'First name cannot exceed 100 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [100, 'Last name cannot exceed 100 characters'],
    },
    role: {
      type: String,
      enum: ['ORGANIZER', 'ADMIN', 'CLIENT'],
      default: 'CLIENT',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    termsAccepted: {
      type: Boolean,
      default: false,
    },
    termsAcceptedAt: {
      type: Date,
      default: Date.now,
    },
    marketingConsent: {
      type: Boolean,
      default: false,
    },
    marketingConsentUpdatedAt: {
      type: Date,
    },
    profile: {
      phone: {
        type: String,
        trim: true,
        maxlength: [20, 'Phone number cannot exceed 20 characters'],
      },
      address: {
        type: String,
        trim: true,
        maxlength: [500, 'Address cannot exceed 500 characters'],
      },
      dateOfBirth: {
        type: Date,
      },
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Hash password with cost of 10
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password (for auth service compatibility)
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Method to update last login 
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  await this.save({ validateBeforeSave: false });
};

// Transform output to include virtuals and remove sensitive data
userSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;

