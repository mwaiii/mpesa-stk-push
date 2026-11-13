exports.handler = async function (event) {
  console.log("Callback received:", event.body);

  return {
    statusCode: 200,
    body: JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" })
  };
};
