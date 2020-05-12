const express = require('express');
const ruter = express.Router();

const pool = require('../database');
const { isLogeedIn } = require('../lib/proteccionRutas');

ruter.get('/agregar', isLogeedIn,(req, res)  => {
    res.render('links/agregar');
})


ruter.post('/agregar', isLogeedIn ,async (req, res)  => {
    const {title, url, description} = req.body;
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    };
    // console.log(newLink)========= guardadndo en mysql
   await pool.query('INSERT INTO links set ?', [newLink]);
   req.flash('success', 'Link guardado correctamente');
    res.redirect('/links');
});
// mostrar lo que hay en sql guardado
ruter.get('/', isLogeedIn ,async (req, res) => {
 const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
//  console.log(links);
 res.render('links/lista', {links});
})

// eliminar de sql
ruter.get('/delete/:id', isLogeedIn , async (req, res) => {
    // console.log(req.params.id);
    const { id  } = req.params;
   await pool.query('DELETE FROM links WHERE ID = ?', [id]);
   req.flash('success', 'Eliminado');
    res.redirect('/links');
});

// esta end-poin nos mustra en el formulario los datos para editarlos
ruter.get('/edit/:id',isLogeedIn ,async (req, res) => {
    const { id } = req.params;
 const links = await pool.query('SELECT * FROM links WHERE ID =?', [id]); // estaconsulta solo nos muestra los datos de este id
    // console.log(links [0]); // 
    res.render('links/editar', { links: links [0] }) // con esto le pasmos los datos al formulario{links} 
});

// con esto guardamo los datos actualizados en la base de datos
ruter.post('/edit/:id',isLogeedIn , async (req, res) => {
    const {id} = req.params;
    const { title, url, description } = req.body;

    const newLink = {
        title,
        url,
        description
    }
    console.log(newLink);
   await pool.query('UPDATE links set ?  WHERE id = ?', [newLink, id])
    req.flash('success', 'Actualizado correctamente'); // con flas podemos mandar mensajes entre rutas
    res.redirect('/links');
});






module.exports = ruter