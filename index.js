//dot-env
require('dotenv-safe').config();
const jwt = require('jsonwebtoken');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'password') {
        const id = 1;

        // O token espera 3 parâmetros: o payload (qualquer informação importante), 
        // // a chave secreta 
        // //e as opções
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: parseInt(process.env.JWT_EXPIRES) // Tempo de expiração do token
        });

        return res.json({ token });
    }

    res.status(401).json({ message: "Invalid credentials" });
})

const blacklist = {};

app.post('/logout', (req, res) => {
    const token = req.headers['authorization'].replace('Bearer ', '');

    if (!token) res.sendStatus(401);
    blacklist[token] = true;
    setTimeout(() => {
        delete blacklist[token];
    }, parseInt(process.env.JWT_EXPIRES) * 1000); // Remove o token da blacklist após o tempo de expiração
    res.json({ token: null });
})

// Sample route
app.get('/', (req, res) => {
    res.json({ message: "OI estas bem" });
});

function verifyJWT(req, res, next) {
    let token = req.headers['authorization'];

    if (!token) {
        return res.sendStatus(401);
    }

    token = token.replace('Bearer ', '');

    if (blacklist[token]) {
        return res.sendStatus(403);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if( !decoded) {
            return res.sendStatus(403);
        }

        res.locals.userId = decoded; // Armazena o ID do usuário no objeto de resposta
        return next();
    }
    catch (err) {
        return res.status(403).json({ message: err.message });
    }
}

app.get('/clientes', verifyJWT, (req, res) => {
    res.json({ id: 1, nome: "Simão jose" })
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});