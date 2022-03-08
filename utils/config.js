require("dotenv").config();

const { PORT, PASSWORD_INMOBILAPP, PASSWORD, EMAIL } = process.env;
const MONGODB_URI =
  process.env.NODE_ENV === "development"
    ? process.env.MONGODB_URI_TEST
    : process.env.MONGODB_URI;

const PAYPAL_API_CLIENT =
  process.env.PAYPAL_API_CLIENT ||
  "Ade3rW0YsKVU2rKx2uErpRE0NQkRqypM_JZsqORzGGOnGBZNsQCK3Xwaa5oGxomJzgkBpAIbkv0Rbjki";
const PAYPAL_API_SECRET =
  process.env.PAYPAL_API_SECRET ||
  "EEeXgJ1dACE4kufOMHqI9wKAnKMFWMrqahPs8_PqGFafdrCc-PevJATSTk80S0ckspMuSKsNUptpS9y0";
const PAYPAL_API = process.env.PAYPAL_API || "https://api-m.sandbox.paypal.com";

module.exports = {
  PORT,
  MONGODB_URI,
  PASSWORD_INMOBILAPP,
  PASSWORD,
  EMAIL,
  PAYPAL_API_CLIENT,
  PAYPAL_API_SECRET,
  PAYPAL_API,
};
