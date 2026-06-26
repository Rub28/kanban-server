const db = require('../../DB/mysql')

const ctrl = require('./controlador.js');

module.exports = ctrl(db);