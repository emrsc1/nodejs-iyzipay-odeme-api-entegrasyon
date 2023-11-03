require("dotenv").config();
const express = require("express");
const app = express();
const path=require("path");
const iyzicoApi = require("./router/iyzico");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(3000, () => {
  console.log("3000 portuna başarıyla bağlandı");
});

app.use(iyzicoApi);
