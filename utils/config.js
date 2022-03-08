require("dotenv").config();

const { PORT, PASSWORD_INMOBILAPP } = process.env;
const MONGODB_URI =
  process.env.NODE_ENV === "development"
    ? process.env.MONGODB_URI_TEST
    : process.env.MONGODB_URI;

module.exports = {
  PORT,
  MONGODB_URI,
  PASSWORD_INMOBILAPP,
};
