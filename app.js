const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, 'data', 'products.json');
const BANNERS_FILE = path.join(__dirname, 'data', 'banners.json');

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'segredo-super-secreto', // altere para algo mais seguro
    resave: false,
    saveUninitialized: false
}));

// Usuário admin fixo
const ADMIN = { username: 'admin', password: '123456' };

// Autenticação
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN.username && password === ADMIN.password) {
        req.session.authenticated = true;
        res.redirect('/admin.html');
    } else {
        res.send('Usuário ou senha incorretos!');
    }
});

// Middleware para proteger admin
app.use('/admin.html', (req, res, next) => {
    if (req.session.authenticated) {
        next();
    } else {
        res.redirect('/login.html');
    }
});

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API (mesmas do CRUD)
app.get('/api/products', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(data);
});
app.post('/api/products', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    const newProduct = { id: Date.now(), ...req.body };
    data.push(newProduct);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.status(201).json(newProduct);
});

// Rotas para banners
app.get('/api/banners', (req, res) => {
    const data = JSON.parse(fs.readFileSync(BANNERS_FILE));
    res.json(data);
});
app.post('/api/banners', (req, res) => {
    const data = JSON.parse(fs.readFileSync(BANNERS_FILE));
    const newBanner = { id: Date.now(), ...req.body };
    data.push(newBanner);
    fs.writeFileSync(BANNERS_FILE, JSON.stringify(data, null, 2));
    res.status(201).json(newBanner);
});
app.delete('/api/banners/:id', (req, res) => {
    let data = JSON.parse(fs.readFileSync(BANNERS_FILE));
    const id = parseInt(req.params.id);
    data = data.filter(b => b.id !== id);
    fs.writeFileSync(BANNERS_FILE, JSON.stringify(data, null, 2));
    res.json({ message: 'Banner removido' });
});

app.put('/api/products/:id', (req, res) => {
    let data = JSON.parse(fs.readFileSync(DATA_FILE));
    const id = parseInt(req.params.id);
    data = data.map(p => p.id === id ? { ...p, ...req.body } : p);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ message: 'Produto atualizado' });
});
app.delete('/api/products/:id', (req, res) => {
    let data = JSON.parse(fs.readFileSync(DATA_FILE));
    const id = parseInt(req.params.id);
    data = data.filter(p => p.id !== id);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ message: 'Produto removido' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
