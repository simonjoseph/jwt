const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.json({message: "OI estas bem"});
});

app.get('/clientes', (req, res) =>{
    return res.json({id: 1, nome: "Simão jose"})
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});