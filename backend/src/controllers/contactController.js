const prisma = require('../config/prisma');
const { sendContactEmail } = require('../utils/email');

const createContact = async (req, res) => {
  const { name, phone, email, service, message } = req.body;

  if (!name || !phone || !email || !service || !message) {
    return res.status(400).json({ message: 'All fields (name, phone, email, service, message) are required.' });
  }

  try {
    const contact = await prisma.contact.create({
      data: {
        name,
        phone,
        email,
        service,
        message,
        status: 'Submitted',
      },
    });

    // Send email notification in the background
    sendContactEmail(contact).catch(err => console.error('Background email notification error:', err));

    res.status(201).json({
      message: 'Service request submitted successfully.',
      requestId: contact.id,
      contact,
    });
  } catch (error) {
    console.error('Create Contact Error:', error);
    res.status(500).json({ message: 'Error submitting service request.' });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(contacts);
  } catch (error) {
    console.error('Get Contacts Error:', error);
    res.status(500).json({ message: 'Error retrieving contact requests.' });
  }
};

const trackContactStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await prisma.contact.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        service: true,
        status: true,
        createdAt: true,
      },
    });

    if (!contact) {
      return res.status(404).json({ message: 'Service request not found with the provided Request ID.' });
    }

    res.json(contact);
  } catch (error) {
    console.error('Track Contact Error:', error);
    res.status(500).json({ message: 'Error retrieving service request details.' });
  }
};

const updateContactStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status is required.' });
  }

  const allowedStatuses = ['Submitted', 'Under Review', 'In Progress', 'Completed'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` });
  }

  try {
    const existingContact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!existingContact) {
      return res.status(404).json({ message: 'Service request not found.' });
    }

    const updatedContact = await prisma.contact.update({
      where: { id },
      data: { status },
    });

    res.json(updatedContact);
  } catch (error) {
    console.error('Update Contact Status Error:', error);
    res.status(500).json({ message: 'Error updating service request status.' });
  }
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  try {
    const existingContact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!existingContact) {
      return res.status(404).json({ message: 'Service request not found.' });
    }

    await prisma.contact.delete({
      where: { id },
    });

    res.json({ message: 'Service request deleted successfully.' });
  } catch (error) {
    console.error('Delete Contact Error:', error);
    res.status(500).json({ message: 'Error deleting service request.' });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  trackContactStatus,
  updateContactStatus,
  deleteContact,
};
