const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./routes');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.TOKEN_SERVER_PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/', (request, response) => response.send('Tudo funcionando!'));
app.use('/api', routes);
app.listen(port, () => console.log('Estou escutando na porta ' + port));

module.exports = {
    app
};