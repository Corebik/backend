// Importar módulos
const jwt = require("jwt-simple");
const moment = require("moment");

// Importar clave secreta
const libkwt = require("../services/jwt");
const secret = libkwt.secret;

// Middleware de autenticación
exports.auth = (req, res, next) => {
    // Comprobar si llega la cabecera de auth
    if(!req.headers.authorization){
        return res.status(403).json({
            status: "error",
            message: "No hay cabecera de autorización"
        });
    }

    // Limpiar el token
    let token = req.headers.authorization.replace(/['"]+/g, "");

    // Decodificar el token
    try{
        let payload = jwt.decode(token, secret);

        // Comprobar la fecha de expiración
        if(payload.exp <= moment().unix()){
            return res.status(401).json({
                status: "error",
                message: "El token ha expirado"
            });
        }

        // Agregar datos de usuario a la request
        req.user = payload;

    }catch(error){
        return res.status(401).json({
            status: "error",
            message: "Token inválido",
            error
        })
    }

    // Pasar a la ejecución de la ruta
    next();
}
