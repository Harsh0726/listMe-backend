const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

let dbConnection;

dotenv.config();
module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(process.env.MONGO_URL)
      .then((client) => {
        dbConnection = client.db();
        console.log("Connected to MongoDB successfully.");
        return cb();
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
  getSavedListsCollection: () => dbConnection.collection("SavedLists"),
};
