const { getStore } = require("@netlify/blobs");

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body);
    const stkCallback = body.Body.stkCallback;

    const checkoutId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    const status = resultCode === 0 ? "paid" : "failed";

    const store = getStore("payments");
    await store.setJSON(checkoutId, { status });

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
