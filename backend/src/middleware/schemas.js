const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters')
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
  })
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address')
  })
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters')
  })
});

const productSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.coerce.number().positive('Price must be a positive number'),
    discountPrice: z.coerce.number().nonnegative().optional().nullable(),
    stock: z.coerce.number().int().nonnegative('Stock must be a non-negative integer'),
    sku: z.string().min(3, 'SKU must be at least 3 characters'),
    brand: z.string().min(1, 'Brand is required'),
    categoryId: z.string().uuid('Invalid Category ID'),
    isFeatured: z.coerce.boolean().optional(),
    imageUrls: z.array(z.string().url('Invalid image URL')).optional()
  })
});

const categorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required')
  })
});

const checkoutSchema = z.object({
  body: z.object({
    addressId: z.string().uuid('Invalid Address ID'),
    paymentMethod: z.enum(['COD', 'ONLINE'], {
      errorMap: () => ({ message: 'Payment method must be COD or ONLINE' })
    })
  })
});

const addressSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name is required'),
    phone: z.string().min(10, 'Phone must be at least 10 digits'),
    addressLine1: z.string().min(5, 'Address line 1 is required'),
    addressLine2: z.string().optional().nullable(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().min(6, 'Pincode must be at least 6 digits'),
    country: z.string().default('India'),
    isDefault: z.boolean().optional()
  })
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  productSchema,
  categorySchema,
  checkoutSchema,
  addressSchema
};
