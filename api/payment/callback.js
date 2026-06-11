const { connectToDatabase } = require('../db');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { invoice, status, paymentID, method } = req.query;

    if (!invoice || !status || !method) {
      return res.status(400).send('<h1>Bad Request</h1><p>Missing parameters.</p>');
    }

    const { db } = await connectToDatabase();

    // Find the order
    const order = await db.collection('orders').findOne({ invoice });

    if (!order) {
      return res.status(404).send('<h1>Not Found</h1><p>Order not found.</p>');
    }

    let updatedStatus = 'FAILED';
    if (status === 'success') {
      updatedStatus = 'COMPLETED';
    } else if (status === 'cancel') {
      updatedStatus = 'CANCELLED';
    }

    // Update order in database
    await db.collection('orders').updateOne(
      { invoice },
      {
        $set: {
          status: updatedStatus,
          paymentId: paymentID || '',
          updatedAt: new Date()
        }
      }
    );

    // Redirect user back to the front-end shop page
    let redirectUrl = `/#/shop?status=${status === 'success' ? 'success' : 'fail'}&invoice=${invoice}&bookId=${order.bookId}`;
    
    res.writeHead(302, { Location: redirectUrl });
    return res.end();
  } catch (error) {
    console.error('Payment callback error:', error);
    return res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
  }
};
