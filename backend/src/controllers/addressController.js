const prisma = require('../config/prisma');

const getAddresses = async (req, res) => {
  const customerId = req.user.id;

  try {
    const addresses = await prisma.address.findMany({
      where: { customerId },
      orderBy: { isDefault: 'desc' }
    });
    res.json(addresses);
  } catch (error) {
    console.error('Get Addresses Error:', error);
    res.status(500).json({ message: 'Error retrieving addresses.' });
  }
};

const createAddress = async (req, res) => {
  const customerId = req.user.id;
  const { fullName, phone, addressLine1, addressLine2, city, state, pincode, country, isDefault } = req.body;

  try {
    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { customerId, isDefault: true },
        data: { isDefault: false }
      });
    }

    // If this is the user's first address, force it to be default
    const count = await prisma.address.count({ where: { customerId } });
    const finalDefault = count === 0 ? true : !!isDefault;

    const address = await prisma.address.create({
      data: {
        customerId,
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
        country: country || 'India',
        isDefault: finalDefault
      }
    });

    res.status(201).json(address);
  } catch (error) {
    console.error('Create Address Error:', error);
    res.status(500).json({ message: 'Error creating address.' });
  }
};

const updateAddress = async (req, res) => {
  const { id } = req.params;
  const customerId = req.user.id;
  const { fullName, phone, addressLine1, addressLine2, city, state, pincode, country, isDefault } = req.body;

  try {
    const existing = await prisma.address.findFirst({
      where: { id, customerId }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Address not found or unauthorized.' });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { customerId, isDefault: true },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
        country,
        isDefault
      }
    });

    res.json(address);
  } catch (error) {
    console.error('Update Address Error:', error);
    res.status(500).json({ message: 'Error updating address.' });
  }
};

const deleteAddress = async (req, res) => {
  const { id } = req.params;
  const customerId = req.user.id;

  try {
    const existing = await prisma.address.findFirst({
      where: { id, customerId }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Address not found or unauthorized.' });
    }

    await prisma.address.delete({ where: { id } });

    // If we deleted the default address, set another one as default
    if (existing.isDefault) {
      const nextAddress = await prisma.address.findFirst({
        where: { customerId }
      });
      if (nextAddress) {
        await prisma.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true }
        });
      }
    }

    res.json({ message: 'Address deleted successfully.' });
  } catch (error) {
    console.error('Delete Address Error:', error);
    res.status(500).json({ message: 'Error deleting address.' });
  }
};

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress
};
