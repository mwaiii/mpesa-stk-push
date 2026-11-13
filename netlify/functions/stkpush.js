exports.handler = async function (event) {
  try {
    const { phone, amount } = JSON.parse(event.body);

    let cleanPhone = phone.replace(/\s+/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "254" + cleanPhone.slice(1);
    } else if (cleanPhone.startsWith("+")) {
      cleanPhone = cleanPhone.slice(1);
    }

    const consumerKey = process.env.CONSUMER_KEY;
    const consumerSecret = process.env.CONSUMER_SECRET;
    const shortcode = process.env.SHORTCODE;
    const tillNumber = process.env.TILL_NUMBER;
    const passkey = process.env.PASSKEY;

    const auth = Buffer.from(consumerKey + ":" + consumerSecret).toString("base64");
    const tokenRes = await fetch(
      "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: "Basic " + auth } }
    );
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return { statusCode: 500, body: JSON.stringify({ error: "Token failed", details: tokenData }) };
    }

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
    const password = Buffer.from(shortcode + passkey + timestamp).toString("base64");

    const stkRes = await fetch(
      "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerBuyGoodsOnline",
          Amount: amount,
          PartyA: cleanPhone,
          PartyB: tillNumber,
          PhoneNumber: cleanPhone,
          CallBackURL: "https://example.com/callback",
          AccountReference: "SkinAnalysis",
          TransactionDesc: "Skin analysis"
        })
      }
    );
    const stkData = await stkRes.json();

    return { statusCode: 200, body: JSON.stringify(stkData) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
