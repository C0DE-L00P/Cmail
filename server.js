require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const app = express();
const cAxios = require("axios").create({baseUrl: process.env.HOST});
module.exports = cAxios;

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(express.static("public"));
app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

//mongo Connection
const url = process.env.DB_API_KEY;
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(url, connectionParams)
  .then(() =>
    app.listen(process.env.DB_PORT || 1000, async () => {
      console.log("%c Server started", "color: green;");
    })
  )
  .catch((err) => console.error(`Error DB. ${err}`));

//routes
app.use("/api/attachments", require("./routes/attachment.js"));
app.use("/api/messages", require("./routes/message.js"));
app.use("/api/users", require("./routes/user.js"));
app.use("/api/auth", require("./routes/auth.js"));
app.get("*", (mreq, mres) => mres.sendStatus(404));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server Running on port ${port}`));
