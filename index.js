const express = require('express');
const morgan = require('morgan');
const users = require('./users');
const errorhandler = require('errorhandler')

const app = express();
const port = 3000;


app.use(morgan('tiny'));


app.get('/users', (req, res) => {
    res.json({ status: "success", data: users });
});


app.get('/users/:name', (req, res) => {
    const name = req.params.name.toLowerCase();
    const user = users.find(user => user.name.toLowerCase() === name);

    if (!user) {
        return res.status(404).json({ message: "Data user tidak ditemukan" });
    }

    res.json({ status: "success", data: user });
});


app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: "Resource tidak ditemukan"
    });
});


app.get((err, req, res, next) => {
    res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan pada server"
    });
});
app.use(errorhandler);


app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
