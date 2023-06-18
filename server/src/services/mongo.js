const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connection.once("open", () => {
  console.log("MongoDb database is available");
});

mongoose.connection.on("error", (err) => {
  console.log("An error occured:", err);
});

async function mongoConnect (){
  await mongoose.connect(
    process.env.MONGO_URL
  );
}

module.exports = {
  mongoConnect
};
