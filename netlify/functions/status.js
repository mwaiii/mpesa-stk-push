const { getStore } = require("@netlify/blobs");

exports.handler = async function (event) {
  try {
    const checkoutId = event.queryStringParameters.id;
    const store = getStore("payments");
    const result = await store.get(checkoutId, { type: "json" });

    if (!result) {
      return { statusCode: 200, body: JSON.stringify({ status: "pending" }) };
    }
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
