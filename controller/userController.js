const User = require("../model/User");
const bcrypt = require("bcrypt");
// Importar servicios 
const jwt = require("../services/jwt");

// Prueba
const prueba = (req, res) => {
    return res.status(200).json({
        status: "success",
        message: "Acción de prueba desde controlador de usuario",
        usuario: req.user
    });
}

// Registro de usuarios

const register = (req, res) => {

    // Recoger datos de la petición
    let params = req.body;

    // Comprobar que me llegan bien (+ Validación)
    if(!params.nombre || !params.email || !params.password){
        console.log("Aviso por consola en la validación de datos de registro de usuario");
    
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar en el registro de usuario",
            params
        });
    }

    

    // Control de usuarios duplicados
    User.find({ $or: [
        { email: params.email.toLocaleLowerCase() },
    ]})
    .then( users => {
        if(users && users.length >= 1){
            return res.status(409).json({
                status: "error",
                message: "El usuario ya existe",
            });
        }
    })
    .catch(err => {
        return res.status(500).json({
            status: "error",
            message: "Error en la consulta de usuarios",
            err
        });
    })
        

        
        
        // Cifrar la contraseña
        bcrypt.hash(params.password, 10, (err, hash) => {
            console.log(hash);
            params.password = hash;

            // Crear objeto de usuario
            let user_to_save = new User(params);

            //console.log(user_to_save);

            // Guardar usuario en la base de datos
            user_to_save.save()
            .then(userSaved => {
                // Devolver respuesta
                return res.status(200).json({
                status: "success",
                message: "¡Usuario registrado correctamente!",
                user: userSaved
                });
            })
            .catch(error => {
                return res.status(500).json({
                status: "error",
                message: "Error al guardar el usuario",
                error
                });
            });
        })

}

// Login
const login = (req, res) => {

    // Recoger parámetros del body
    let params = req.body;

    if(!params.email || !params.password){
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar en el login",
        })
    }

    // Buscar en la base de datos
    User.findOne({ email: params.email })
    //.select({"fecha": 0, "__v": 0, "password": 0})
    .then(user => {
        if(!user){
            return res.status(404).json({
                status: "error",
                message: "El usuario no existe",
            })
        }

        // Comprobar contraseña
        let pwd = bcrypt.compareSync(params.password, user.password);

        if(!pwd){
            return res.status(404).json({
                status: "error",
                message: "El usuario no existe",
            })
        }

        // Conseguir token
        const token = jwt.createToken(user);

        // Devolver datos del usuario


        return res.status(200).json({
            status: "success",
            message: "¡Se ha identificado el usuario correctamente!",
            user: {
                nombre: user.nombre,
                email: user.email
            },
            token
        })
    })



    .catch(err => {
        return res.status(500).json({
            status: "error",
            message: "Error en la consulta de usuarios",
            err
        })
    })

}

module.exports = {
    register,
    login, 
    prueba
}