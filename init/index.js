const mongoose = require("mongoose");
const initData = require("./data.js");
const Note = require("../models/notes.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/note";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Note.deleteMany({});
  initData.data = initData.data.map((obj) => ({...obj, user: 'PriyanshuValiya'}));
  await Note.insertMany(initData.data);
  console.log("Data Was Initialized");
};

initDB();