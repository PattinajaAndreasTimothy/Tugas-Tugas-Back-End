const express = require('express');
const moment = require('moment');
const users = require('./users');
const morgan = require('morgan');
//const errorhandler = require('errorhandler')
const app = express();
const routers = require('./routers')
const path = require("path");
const cors = require("cors");



//middleware (harus di atas routing)
const log = (req, res, next) => {
    console.log(moment().format("h:mn:ss a")+ " " + req.original.Url + " "+ req.ip);
};

app.use(morgan('tiny'));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


app.use(cors({
    origin: "http://127.0.0.1:5500"
}));

app.use(routers);

//routing




app.get('/', (req, res) => res.send('Andreas Is here'));

app.get('/users', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Users data',
        data: users
    });
});

app.get('/users/:name', (req, res) => {
    const name = req.params.name.toLowerCase();
    const user = users.find(user => user.name.toLowerCase() === name);

    if (!user) {
        return res.status(404).json({ message: "Data user tidak ditemukan" });
    }

    res.json({ status: "success", data: user });
});

app.delete('/users/:name', (req, res) => {
    const name = req.params.name.toLowerCase();
    const userIndex = users.findIndex(user => user.name.toLowerCase() === name);

    if (userIndex === -1) {
        return res.status(404).json({ message: "Data user tidak ditemukan" });
    }

    const deletedUser = users.splice(userIndex, 1);

    res.json({
        status: "success",
        message: "Data user berhasil dihapus",
        data: deletedUser[0]
    });
});

app.get('/about', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Users',
        data: []
    });
});

app.post('/contoh', (req, res) => {
    res.send('Request dengan method POST');
});

app.put('/contoh', (req, res) => {
    res.send('Request dengan method PUT');
});

app.delete('/contoh', (req, res) => {
    res.send('Request dengan method DELETE');
});

app.patch('/contoh', (req, res) => res.send("Request dengan method PATCH"));

app.all("/universal", function (req, res) {
    res.send("Request dengan method " + req.method);
});

app.get('/post/:Number', (req, res) => {
    res.send(`Artikel ke - ${req.params.Number}`);
});

// Endpoint untuk menangani query parameters pada /foods
app.get('/post', (req, res) => {
    const page = req.query.page ? req.query.page : 1;
    
    res.write(`Query yang didapatkan itu adalah : ${page}\n`);
    
    if (req.query.sort) {
        res.write(`Sort by: ${req.query.sort}`);
    }
    
    res.end();
});

app.use((req, res, next) => {
    res.status(404).json({
        status: "error",
        message: "resource tidak ditemukan",
    });
});


const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, () => console.log(`Server running at http://${hostname}:${port}`));