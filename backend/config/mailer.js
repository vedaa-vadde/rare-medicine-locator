const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendLowStockAlert = async (pharmacyEmail, pharmacyName, medicineName, currentStock) => {
  const mailOptions = {
    from: `"Medicine Locator" <${process.env.EMAIL_USER}>`,
    to: pharmacyEmail,
    subject: `⚠️ Low Stock Alert: ${medicineName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #d32f2f;">Low Stock Alert</h2>
        <p>Hello <strong>${pharmacyName}</strong>,</p>
        <p>This is an automated alert to inform you that <strong>${medicineName}</strong> is running low.</p>
        <div style="background: #fff3e0; padding: 16px; border-radius: 6px; margin: 16px 0;">
          <p style="margin: 0;"><strong>Medicine:</strong> ${medicineName}</p>
          <p style="margin: 8px 0 0;"><strong>Current Stock:</strong> ${currentStock} units</p>
        </div>
        <p>Please restock as soon as possible to avoid shortages.</p>
        <p style="color: #888; font-size: 12px;">— Rare Medicine Locator System</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendStockUpdateNotification = async (userEmail, userName, medicineName, pharmacyName, newStock) => {
  const mailOptions = {
    from: `"Medicine Locator" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `✅ Stock Update: ${medicineName} is now available`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2e7d32;">Medicine Now Available</h2>
        <p>Hello <strong>${userName}</strong>,</p>
        <p><strong>${medicineName}</strong> is now back in stock at <strong>${pharmacyName}</strong>.</p>
        <div style="background: #e8f5e9; padding: 16px; border-radius: 6px; margin: 16px 0;">
          <p style="margin: 0;"><strong>Medicine:</strong> ${medicineName}</p>
          <p style="margin: 8px 0 0;"><strong>Pharmacy:</strong> ${pharmacyName}</p>
          <p style="margin: 8px 0 0;"><strong>Available Stock:</strong> ${newStock} units</p>
        </div>
        <p>Visit the app to locate and reserve your medicine.</p>
        <p style="color: #888; font-size: 12px;">— Rare Medicine Locator System</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendLowStockAlert, sendStockUpdateNotification };
