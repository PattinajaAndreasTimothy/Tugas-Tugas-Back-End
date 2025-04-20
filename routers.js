const express = require("express");
const routers = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "public" });
const users = require("./users");
const client = require("./mongodb");
const { count } = require("console");
const ObjectId = require("mongodb");

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

// Routing mongodb
routers.get("/db", async (req, res) => {
  try {
    const db = client.db("latihan");
    const users = await db.collection("users").find().toArray();
    res.json({
      status: "success",
      message: "list users",
      data: users,
    });
  } catch (error) {
    res.json({
      status: "error",
    });
  }
});

//Routers MongoDB
routers.get("/db/:id", async (req, res) => {
  try {
    const db = client.db("latihan");
    const users = await db.collection("users").findOne({
      _id: new ObjectId(req.params.id),
    });
    res.json({
      status: "success",
      message: "single users",
      data: users,
    });
  } catch (error) {
    res.json({
      status: "error",
    });
  }
});

//Routers insert user
routers.post("/db", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({
        status: "error",
        message: "Mohon isi data dengan lengkap (name dan email)",
      });
    }

    const db = client.db("latihan");
    const result = await db.collection("users").insertOne({ name, email });

    res.status(201).json({
      status: "success",
      message: "User berhasil ditambahkan",
      data: {
        id: result.insertedId,
        name,
        email,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan saat insert user",
    });
  }
});

//Routers Update User
routers.put("/db/:id", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name && !email) {
      return res.status(400).json({
        status: "error",
        message: "Data yang diubah tidak boleh kosong",
      });
    }

    const db = client.db("latihan");
    const result = await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { name, email } }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "User tidak ditemukan",
      });
    }

    res.json({
      status: "success",
      message: "User berhasil diperbarui",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal update user",
    });
  }
});

//Routers Delete Users
routers.delete("/db/:id", async (req, res) => {
  try {
    const db = client.db("latihan");
    const result = await db.collection("users").deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "User tidak ditemukan",
      });
    }

    res.json({
      status: "success",
      message: "User berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal menghapus user",
    });
  }
});

//Routers Get Order User (Join/aggregate)
routers.get("/db/order", async (req, res) => {
  try {
    const db = client.db("latihan");
    const data = await db
      .collection("orders")
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        {
          $unwind: "$userInfo",
        },
      ])
      .toArray();

    res.json({
      status: "success",
      message: "Data order dengan informasi user",
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data order",
    });
  }
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
