const nodemailer = require('nodemailer');
require('dotenv').config();

const isConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;

let transporter = null;

if (isConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

const sendContactEmail = async (contact) => {
  if (!isConfigured) {
    console.log('--- EMAIL NOTIFICATION LOG (EMAIL NOT CONFIGURED) ---');
    console.log(`To: ${process.env.EMAIL_RECEIVER || 'reach2gtech@gmail.com'}`);
    console.log(`Subject: New G-TECH Lead - Request ID: ${contact.id}`);
    console.log(`Customer Name: ${contact.name}`);
    console.log(`Phone: ${contact.phone}`);
    console.log(`Email: ${contact.email}`);
    console.log(`Service Requested: ${contact.service}`);
    console.log(`Message: ${contact.message}`);
    console.log('------------------------------------------------------');
    return;
  }

  const mailOptions = {
    from: `"G-TECH Lead System" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECEIVER || 'reach2gtech@gmail.com',
    subject: `New Lead: ${contact.service} - Request ID: ${contact.id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">New Service Request</h2>
        <p>You have received a new contact submission/service request from G-TECH Innovation website.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f3f4f6; width: 35%;">Request ID:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f3f4f6;"><code>${contact.id}</code></td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Customer Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f3f4f6;">${contact.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Phone Number:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f3f4f6;"><a href="tel:${contact.phone}">${contact.phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f3f4f6;"><a href="mailto:${contact.email}">${contact.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Service Needed:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f3f4f6;"><strong>${contact.service}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Status:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f3f4f6;"><span style="background-color: #fef3c7; color: #d97706; padding: 2px 6px; border-radius: 4px; font-size: 0.85em;">${contact.status}</span></td>
          </tr>
        </table>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-radius: 4px; border-left: 4px solid #dc2626;">
          <h4 style="margin: 0 0 8px 0; color: #111827;">Customer Message:</h4>
          <p style="margin: 0; color: #4b5563; line-height: 1.5;">${contact.message}</p>
        </div>
        
        <p style="margin-top: 25px; font-size: 0.85em; color: #9ca3af; text-align: center;">
          This is an automated notification from your G-TECH Innovation website administration panel.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Notification email sent for contact request: ${contact.id}`);
  } catch (error) {
    console.error('Failed to send notification email:', error);
  }
};

module.exports = {
  sendContactEmail,
};
