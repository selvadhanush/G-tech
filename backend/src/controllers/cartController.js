const prisma = require('../config/prisma');

const getCart = async (req, res) => {
  const customerId = req.user.id;

  try {
    let cart = await prisma.cart.findUnique({
      where: { customerId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                discountPrice: true,
                stock: true,
                imageUrls: true,
                brand: true
              }
            }
          }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { customerId },
        include: {
          items: {
            include: { product: true }
          }
        }
      });
    }

    res.json(cart);
  } catch (error) {
    console.error('Get Cart Error:', error);
    res.status(500).json({ message: 'Error retrieving cart.' });
  }
};

const addToCart = async (req, res) => {
  const customerId = req.user.id;
  const { productId, quantity = 1 } = req.body;

  try {
    // Verify product exists and has stock
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    let cart = await prisma.cart.findUnique({ where: { customerId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { customerId } });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId }
    });

    const targetQty = existingItem ? existingItem.quantity + quantity : quantity;
    if (product.stock < targetQty) {
      return res.status(400).json({ message: `Cannot add. Only ${product.stock} items left in stock.` });
    }

    let cartItem;
    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: targetQty }
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
      });
    }

    res.json(cartItem);
  } catch (error) {
    console.error('Add To Cart Error:', error);
    res.status(500).json({ message: 'Error adding item to cart.' });
  }
};

const updateCartItem = async (req, res) => {
  const customerId = req.user.id;
  const { productId, quantity } = req.body;

  if (quantity < 1) {
    return res.status(400).json({ message: 'Quantity must be at least 1.' });
  }

  try {
    const cart = await prisma.cart.findUnique({ where: { customerId } });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: `Only ${product.stock} items available in stock.` });
    }

    const item = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId }
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart.' });
    }

    const updated = await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update Cart Item Error:', error);
    res.status(500).json({ message: 'Error updating quantity.' });
  }
};

const removeFromCart = async (req, res) => {
  const customerId = req.user.id;
  const { productId } = req.body;

  try {
    const cart = await prisma.cart.findUnique({ where: { customerId } });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const item = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId }
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart.' });
    }

    await prisma.cartItem.delete({ where: { id: item.id } });
    res.json({ message: 'Item removed from cart.' });
  } catch (error) {
    console.error('Remove From Cart Error:', error);
    res.status(500).json({ message: 'Error removing item from cart.' });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
};
