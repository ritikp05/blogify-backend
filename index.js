const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
app.use(express.json());
dotenv.config();
app.use(cors());
app.use("/api/auth", userRoutes);
app.use("/api/blog", blogRoutes);
const dbConnect = require("./db/dbconfig");

dbConnect(process.env.URL);
app.listen(process.env.PORT ||4400, function () {
  console.log("App is running ");
});

app.use((err, req, res, next) => {
  if (err){
    return res.json({
      msg: err.message,
    });
  }
  
});
