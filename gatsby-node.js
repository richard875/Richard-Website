const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

exports.onPostBuild = async () => {
  const indexNowKey = process.env.INDEXNOW_KEY;
  const fileName = `./public/${indexNowKey}.txt`;

  fs.writeFileSync(fileName, indexNowKey);
};
