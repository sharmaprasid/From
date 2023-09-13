const express = require("express");
const serviceRoutes = require("./routes/serviceRoutes");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const db = require("./config/database");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config();
const app = express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());

app.use(express.json());
db();

app.use("/api", serviceRoutes);
app.use("/api", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hello" });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
