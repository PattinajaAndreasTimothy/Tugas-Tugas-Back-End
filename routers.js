const express = require("express");
const routers = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "public" });
const users = require("./users");

// Routing Upload
routers.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  if (file) {
    const target = path.join(__dirname, "public", file.originalname);
    fs.renameSync(file.path, target);
    res.send("File berhasil diupload");
  } else {
    res.send("File gagal diupload");
  }
});

// Routing Download
routers.post("/download", function (req, res) {
  const filename = "reniel.jpg";
  res.sendFile(path.join(__dirname, "download", filename), {
    headers: {
      "Content-Disposition": 'attachment; filename="reniel-peks.jpg"',
    },
  });
});

// Routing lainnya
routers.post("/login", (req, res) => {
  const { username, password } = req.body;
  res.status(200).json({
    status: "success",
    message: "Login page",
    data: { username, password },
  });
});

routers.get("/users", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Users data",
    data: users,
  });
});

routers.put("/users/:name", (req, res) => {
  const name = req.params.name.toLowerCase();
  const user = users.find((user) => user.name.toLowerCase() === name);

  if (!users) {
    return res.status(404).json({ message: "Data user tidak ditemukan" });
  }

  res.json({ status: "success", data: users });
});

routers.get("/", (req, res) => res.send("Hello World"));
routers.get("/about", (req, res) =>
  res.status(200).json({
    status: "success",
    message: "About page",
    data: [],
  })
);

routers.post("/users", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Masukan data yang akan diubah" });
  }

  const newUser = {
    id: users.length + 1,
    name,
  };

  users.push(newUser);

  routers.delete("/users/:name", (req, res) => {
    const name = req.params.name.toLowerCase();
    const userIndex = users.findIndex(
      (user) => user.name.toLowerCase() === name
    );

    if (userIndex === -1) {
      return res.status(404).json({ message: "Data user tidak ditemukan" });
    }

    const deletedUser = users.splice(userIndex, 1);

    res.json({
      status: "success",
      message: "Data user berhasil dihapus",
      data: deletedUser[0],
    });
  });

  res.status(201).json({
    status: "success",
    message: "User berhasil ditambahkan",
    data: newUser,
  });
});

routers.post("/contoh", (req, res) => res.send("Request method POST"));
routers.put("/contoh", (req, res) => res.send("Request method PUT"));
routers.delete("/contoh", (req, res) => res.send("Request method DELETE"));
routers.patch("/contoh", (req, res) => res.send("Request method PATCH"));

routers.all("/universal", (req, res) =>
  res.send(`Request method ${req.method}`)
);

// Routing dinamis
routers.get("/post/:id", (req, res) =>
  res.send(`Artikel ke - ${req.params.id}`)
);

routers.get("/post", (req, res) => {
  const { page, sort } = req.query;
  res.send(`Query string= page: ${page}, sort: ${sort}`);
});

module.exports = routers;
