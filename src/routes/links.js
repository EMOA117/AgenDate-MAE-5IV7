const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', (req, res) => {
    res.render('links/add');
});

router.post('/add', async (req, res) => {
    const { name, phone, description } = req.body;
    const newPhone = {
        name,
        phone,
        description,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO phone set ?', [newPhone]);
    req.flash('success', 'Teléfono guardado satisfactoriamente');
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM phone WHERE user_id = ?', [req.user.id]);
    res.render('links/list', { links });
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM phone WHERE ID = ?', [id]);
    req.flash('success', 'Teléfono removido satisfactoriamente');
    res.redirect('/links');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM phone WHERE id = ?', [id]);
    console.log(links);
    res.render('links/edit', {link: links[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, phone} = req.body; 
    const newLink = {
        name,
        description,
        phone
    };
    await pool.query('UPDATE phone set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Teléfono actualizado correctamente');
    res.redirect('/links');
});

module.exports = router;