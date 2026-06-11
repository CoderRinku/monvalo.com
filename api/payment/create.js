const { connectToDatabase } = require('../db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, bookId, amount, method } = req.body;

    if (!name || !email || !phone || !bookId || !amount || !method) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { db } = await connectToDatabase();

    // Create a unique invoice number
    const timestamp = Date.now();
    const random = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `INV-${timestamp}-${random}`;

    // Create the order document
    const order = {
      invoice: invoiceNumber,
      name,
      email,
      phone,
      bookId: parseInt(bookId, 10),
      amount: parseFloat(amount),
      method: method.toLowerCase(),
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert to DB
    await db.collection('orders').insertOne(order);

    // Generate redirect URL to simulated payment gateway
    const redirectUrl = `/payment-gateway/${method.toLowerCase()}.html?invoice=${invoiceNumber}&amount=${amount}`;

    return res.status(200).json({ success: true, redirectUrl });
  } catch (error) {
    console.error('Payment creation error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
