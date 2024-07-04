const bcrypt = require("bcrypt");

async function generateHash(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

module.exports = { generateHash };
