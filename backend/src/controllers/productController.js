const prisma = require('../config/prisma');

const getProducts = async (req, res) => {
  const { search, categoryId, minPrice, maxPrice, brand, sort } = req.query;

  try {
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (brand) {
      where.brand = { equals: brand, mode: 'insensitive' };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    let orderBy = { createdAt: 'desc' };
    if (sort) {
      if (sort === 'price_asc') orderBy = { price: 'asc' };
      else if (sort === 'price_desc') orderBy = { price: 'desc' };
      else if (sort === 'name_asc') orderBy = { name: 'asc' };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: {
          select: { name: true, slug: true }
        }
      }
    });

    res.json(products);
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({ message: 'Error retrieving products.' });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { name: true, slug: true }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get Product By ID Error:', error);
    res.status(500).json({ message: 'Error retrieving product.' });
  }
};

const createProduct = async (req, res) => {
  const { name, description, price, discountPrice, stock, sku, brand, imageUrls, isFeatured, categoryId } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  try {
    const existing = await prisma.product.findUnique({ where: { sku } });
    if (existing) {
      return res.status(400).json({ message: 'Product with this SKU already exists.' });
    }

    const slugExists = await prisma.product.findUnique({ where: { slug } });
    const finalSlug = slugExists ? `${slug}-${Date.now()}` : slug;

    const product = await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        description,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        stock: parseInt(stock),
        sku,
        brand,
        imageUrls: imageUrls || [],
        isFeatured: isFeatured === 'true' || isFeatured === true,
        categoryId
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ message: 'Error creating product.' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, discountPrice, stock, sku, brand, imageUrls, isFeatured, categoryId } = req.body;
  const slug = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : undefined;

  try {
    const currentProduct = await prisma.product.findUnique({ where: { id } });
    if (!currentProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (sku && sku !== currentProduct.sku) {
      const existing = await prisma.product.findUnique({ where: { sku } });
      if (existing) {
        return res.status(400).json({ message: 'Product with this SKU already exists.' });
      }
    }

    let finalSlug = currentProduct.slug;
    if (name && name !== currentProduct.name) {
      const slugExists = await prisma.product.findFirst({ where: { slug, NOT: { id } } });
      finalSlug = slugExists ? `${slug}-${Date.now()}` : slug;
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug: finalSlug,
        description,
        price: price !== undefined ? parseFloat(price) : undefined,
        discountPrice: discountPrice === undefined ? undefined : (discountPrice ? parseFloat(discountPrice) : null),
        stock: stock !== undefined ? parseInt(stock) : undefined,
        sku,
        brand,
        imageUrls: imageUrls === undefined ? undefined : imageUrls,
        isFeatured: isFeatured === undefined ? undefined : (isFeatured === 'true' || isFeatured === true),
        categoryId
      }
    });

    res.json(product);
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({ message: 'Error updating product.' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ message: 'Error deleting product.' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
