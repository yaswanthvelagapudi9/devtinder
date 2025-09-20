const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({
    firstName: "John",
    lastName: "Doe",
  });
});

app.post("/user", (req, res) => {
  res.send({
    message: "User created",
  });
});

app.delete("/user", (req, res) => {
  res.send({
    message: "User deleted",
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
