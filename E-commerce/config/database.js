const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose.connect(process.env.DB_CONNECTION_STRING).then((conn) => {
    console.log(`Database Connected: ${conn.connection.host}`);
  });
};

module.exports = dbConnection;
