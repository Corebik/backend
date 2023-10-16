const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");

//Inicializar 
console.log("Incio de App");

//Conectar a la base de datos
connection();

// Crear servidor Node
const app = express();
const puerto = 3900;

// Configurarción de CORS
app.use(cors());

// Transformar body a Objeto
app.use(express.json());

// Crear rutas
app.get("/Probando", (req, res) => {
    console.log("Se ha ejecutado el endpoint probando");
    return res.status(200).send({
        message: "Se ha ejecutado el endpoint probando",
        modulo: "NodeJS",
        capa: "BackEnd",
        profesor: "Diego Rodriguez",
    });
});

app.get("/", (req, res) => {
    return res.status(200).send(
        `<h1>Empezando a crear API Rest proyecto final</h1>`
    )
});

// Crear servidor y escuchar peticiones
app.listen(puerto, () => {
    console.log("Servidor corriendo en el puerto " + puerto);
});