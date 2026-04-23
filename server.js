const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const usersRoute = require("./routes/users");
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
  res.send("Server hidup bro 🔥");
});

app.use("/users", usersRoute);

// error handler HARUS paling bawah
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server jalan di http://localhost:${PORT}`);
});