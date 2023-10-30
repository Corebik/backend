// Importar dependencias 
const jwt = require("jwt-simple");
const moment = require("moment");

// Clave secreta
const secret = "SECRET_PASSWORD_ECOMMERCE_13022023";

// Crear función para generar tokens
const createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        imagen: user.imagen,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    };

    // Devolver jwt token codificado
    return jwt.encode(payload, secret);
}

module.exports = {
    createToken,
    secret
}


