const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const contactsRouter = require("./controllers/contacts");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
logger.info("connecting to");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("Connected to db successfully");
  })
  .catch((error) => {
    console.log(`error connecting to db: ${error.message}`);
    return;
  });

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.logger);
app.use("/api/persons", contactsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
