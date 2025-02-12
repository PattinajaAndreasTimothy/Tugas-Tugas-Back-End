const express = require('express');
const moment = require('moment');
const users = require('./users');

const app = express();
const hostname = '127.0.0.1';
const port = 3000;

app.get('/', (req, res) => {
    res.status(200).send('This is the home page');
});

app.get('/about', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'response success',
        description: 'Exercise #02',
        date: moment().format('YYYY-MM-DDTHH:mm:ssZ')
    });
});

app.get('/users', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Users data',
        data: users
    });
});

app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route tidak ditemukan',
        date: moment().format('YYYY-MM-DDTHH:mm:ssZ')
    });
});

app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
