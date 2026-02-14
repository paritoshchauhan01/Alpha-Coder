const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const newMotherRoutes = require("./routes/newMother.routes");
const generalRoutes = require("./routes/general.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/new-mother", newMotherRoutes);
app.use("/api/general", generalRoutes);

module.exports = app;
