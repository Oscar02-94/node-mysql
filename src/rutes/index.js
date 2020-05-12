// tredireccion de la vista principal


const express = require('express');
 const ruter = express.Router();

ruter.get('/', (req, res) => {
    res.render('index')
})



module.exports = ruter