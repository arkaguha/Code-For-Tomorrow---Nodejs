require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./Routes/userRoutes");
const app = express();
const PORT = process.env.PORT;
const URI = process.env.URI;

app.use(express.json());
app.use(userRoutes);

app.listen(PORT, () => {
  mongoose
    .connect(URI)
    .then(() => {
      console.log("Connected to mongoDB");
    })
    .catch((e) => console.log(e));
  console.log(`Server started at http://localhost:${PORT}`);
});
