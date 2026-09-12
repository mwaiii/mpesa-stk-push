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
    const shortcode = "174379";
    const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";

    const auth = Buffer.from(consumerKey + ":" + consumerSecret).toString("base64");
    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: "Basic " + auth } }
    );
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
    const password = Buffer.from(shortcode + passkey + timestamp).toString("base64");

    const siteUrl = "https://" + event.headers.host;
    const callbackUrl = siteUrl + "/.netlify/functions/callback";

    const stkRes = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
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
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: cleanPhone,
          PartyB: shortcode,
          PhoneNumber: cleanPhone,
          CallBackURL: callbackUrl,
          AccountReference: "TestPayment",
          TransactionDesc: "Test"
        })
      }
    );
    const stkData = await stkRes.json();

    return { statusCode: 200, body: JSON.stringify(stkData) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
