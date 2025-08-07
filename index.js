//dot-env
require('dotenv-safe').config();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

const refreshTokens = {};

function generateRefreshToken(userId) {
    const token = uuidv4();
    refreshTokens[token] = userId; // Store the refresh token

    Object.keys(refreshTokens).forEach((key) => {
        if (key !== token && refreshTokens[key] === userId) {
            delete refreshTokens[key]; // Remove any existing refresh token for the user
        }
    });

    setTimeout(() => {
        delete refreshTokens[token]; // Remove the refresh token after expiration
    }, parseInt(process.env.REFRESH_EXPIRES)); // Use the REFRESH_EXPIRES from .env

    return token;
}

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'password') {
        const id = 1;

        // O token espera 3 parâmetros: o payload (qualquer informação importante), 
        // // a chave secreta 
        // //e as opções
        const acessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: parseInt(process.env.JWT_EXPIRES) // Tempo de expiração do token
        });

        const refreshToken = generateRefreshToken(id); // Gera o refresh token

        return res.json({ acessToken, refreshToken });
    }

    res.status(401).json({ message: "Invalid credentials" });
})

app.post('/refresh', (req, res) => {
    let refreshToken = req.headers['authorization'];
    if(!refreshToken) return res.sendStatus(401);

    refreshToken = refreshToken.replace('Bearer ', '');

    const userId = refreshTokens[refreshToken];
    if (!userId) return res.sendStatus(403);

    // Gera um novo token de acesso
    const newAccessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: parseInt(process.env.JWT_EXPIRES) // Tempo de expiração do token
    });

    // Gera um novo refresh token
    const newRefreshToken = generateRefreshToken(userId);

    return res.json({ acessToken: newAccessToken, refreshToken: newRefreshToken });
})

const blacklist = {};

app.post('/logout', verifyJWT, (req, res) => {
    const token = req.headers['authorization'].replace('Bearer ', '');

    if (!token) res.sendStatus(401);
    blacklist[token] = true;
    setTimeout(() => {
        delete blacklist[token];
    }, parseInt(process.env.JWT_EXPIRES) * 1000); // Remove o token da blacklist após o tempo de expiração

    Object.keys(refreshTokens).forEach((key) => {
        if (refreshTokens[key] === res.locals.token.id) {
            delete refreshTokens[key]; // Remove o refresh token associado ao usuário
        }
    });
    
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

        if (!decoded) {
            return res.sendStatus(403);
        }

        res.locals.token = decoded; // Armazena o ID do usuário no objeto de resposta
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