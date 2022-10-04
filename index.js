require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const { TEL_TOKEN, NGROK_URL } = process.env;

console.log("TEL_TOKEN :>> ", TEL_TOKEN);
console.log("NGROK_URL :>> ", NGROK_URL);

const TEL_API = `https://api.telegram.org/bot${TEL_TOKEN}`;

const URI = `/webhook/${TEL_TOKEN}`;
const WEBHOOK_URL = NGROK_URL + URI;

console.log("URI :>> ", URI);
console.log("WEBHOOK_URL :>> ", WEBHOOK_URL);

const app = express();
app.use(bodyParser.json());

const init = async () => {
  const res = await axios.get(`${TEL_API}/setWebhook?url=${WEBHOOK_URL}`);
  console.log(res.data);
};

app.post(URI, async (req, res) => {
  console.log("req.body :>> ", req.body);

  const chat_id = req.body.message.chat.id;
  const username = req.body.message.from.username;
  const text = req.body.message.text;

  await axios.post(`${TEL_API}/sendMessage`, {
    chat_id,
    text: `${text}, ${username}`,
  });

  return res.send();
});

app.listen(process.env.PORT || 8080, async () => {
  console.log("app running on port", process.env.PORT || 8080);
  await init();
});
