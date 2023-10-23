const validator = require("validator");
const Product = require("../model/Product");
const fs = require("fs");
const path = require("path");

const prueba = (req, res) => {
    return res.status(200).send({
        message: "Acción de prueba desde controlador de producto"
    });
}

// Método de guardar productos
const create = (req, res) => {
    
    // Recoger datos de la petición del body por post
    let params = req.body

    // Validar los datos
    try{

        let validate_title = !validator.isEmpty(params.titulo) && validator.isLength(params.titulo, {min: 3, max: undefined});
        let validate_description = !validator.isEmpty(params.descripcion);
        let validate_price = !validator.isEmpty(params.precio);
        let validate_stock = !validator.isEmpty(params.stock);
        let validate_brand = !validator.isEmpty(params.marca);
        let validate_model = !validator.isEmpty(params.modelo); 

        if(!validate_title || !validate_description || !validate_price || !validate_stock || !validate_brand || !validate_model){
            throw new Error("No se ha validado la información");
        }

    }catch(err){
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar"
        });
    }


    // Crear el objeto a guardar
    let product = new Product(params);

    // Asignar valores a objeto basado en el modelo (manual o automático)
    // product.title = params.title;

    // Guardar prooducto en la base de datos
    product.save()
        .then((productSaved) => {
            // Devolver respuesta
            return res.status(200).json({
                status: "success",
                product: productSaved,
                message: "¡Producto guardado exitosamente!"
            });
        })
        .catch((error) => {
            return res.status(400).json({
                status: "error",
                message: "No se ha guardado el producto",
            });
    });

}


// Método para obtener todos los productos.
const getProducts = (req, res) => {
    let request = Product.find({});
                        
    if (req.params.last) {
        request.limit(3);
    }

    request.sort({fecha: -1})
    .then((products) => {
        if (!products || products.length === 0) {
                return res.status(404).json({
                status: "error",
                message: "No se han encontrado productos!",
            });
        }

        return res.status(200).json({
            status: "success",
            cantidad: products.length,
            param_url: req.params.last,
            products
        });
    })
    .catch((error) => {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener los productos",
            error
        });
    });
};


// Método para obtener un solo producto
const getJustOne = (req, res) => {
    // Recoger id por params de la url
    let id = req.params.id;

    // Buscar el producto
    Product.findById(id)
        .then((product) => {
            if (!product) {
                return res.status(404).json({
                    status: "error",
                    message: "El producto no existe",
                });
            }

            return res.status(200).json({
                status: "success",
                product
            })
        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                message: "Error al buscar el producto",
                error
            })
        })
}

// Método para eliminar un producto
const deleteProduct = (req, res) => {
    // Recoger id por params de la url
    let id = req.params.id;
    Product.findOneAndDelete({ _id: id })
    .then((productDeleted) => {
        if (!productDeleted) {
            return res.status(500).json({
                status: "error",
                message: "El producto no existe",
            });
        }

        return res.status(200).json({
            status: "success",
            product: productDeleted,
            message: "El producto ha sido eliminado"
        })
    })
    .catch((error) => {
        return res.status(500).json({
            status: "error",
            message: "Error al eliminar el producto",
            error
        })
    })
}

// Metodo de para actualizar un producto
const updateProduct = (req, res) => {
    // Recoger id por params de la url
    let id = req.params.id;
    // Recoger datos del body
    let params = req.body;

    // Validar datos
    try{

        let validate_title = !validator.isEmpty(params.titulo) && validator.isLength(params.titulo, {min: 3, max: undefined});
        let validate_description = !validator.isEmpty(params.descripcion);
        let validate_price = !validator.isEmpty(params.precio);
        let validate_stock = !validator.isEmpty(params.stock);
        let validate_brand = !validator.isEmpty(params.marca);
        let validate_model = !validator.isEmpty(params.modelo); 

        if(!validate_title || !validate_description || !validate_price || !validate_stock || !validate_brand || !validate_model){
            throw new Error("No se ha validado la información");
        }

    }catch(err){
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar"
        });
    }

    // Buscar y actualizar el producto
    Product.findOneAndUpdate({ _id: id }, params, { new: true })
    .then((productUpdated) => {
        if (!productUpdated) {
            return res.status(404).json({
                status: "error",
                message: "El producto no existe",
            });
        }

        return res.status(200).json({
            status: "success",
            product: productUpdated,
            message: "El producto ha sido actualizado"
        })
    })
    .catch((error) => {
        return res.status(500).json({
            status: "error",
            message: "Error al actualizar el producto",
            error
        })
    })
}

// Upload de imagen
const uploadImage = (req, res) => {

    // Configurar multer

    // Recoger el fichero de imagen subido
    console.log(req.file);
    // Nombre del archivo
    let archive = req.file.originalname;

    // Extensión del archivo
    let splitArchive = archive.split("\.");
    let extension = splitArchive[1];

    // Comprobar extensión correcta
    if(extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif"){
        
        // Borrar el archivo subido y dar respuesta
        fs.unlink(req.file.path, (err) => {
            return res.status(400).json({
                status: "error",
                message: "Imagen Inválida",
            });
        });
    }
    else{
        // Si todo va bien, actualizar el producto

        // Recoger id del producto a actualizar
        let id = req.params.id;

        // Buscar y actualizar el producto
        Product.findOneAndUpdate({ _id: id }, { imagen: req.file.filename }, { new: true })
        .then((productUpdated) => {
            if (!productUpdated) {
                return res.status(404).json({
                    status: "error",
                    message: "El producto no existe",
                });
            }
    
            // Devolver la respuesta
            return res.status(200).json({
                status: "success",
                product: productUpdated,
                message: "El producto ha sido actualizado",
                imageData: req.file
            })
        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                message: "Error al actualizar el producto",
                error
            })
        })
    }
}

const image = (req, res) => {
    let fileData = req.params.imageData;
    let serverFileRoute = "./uploads/" + fileData;

    fs.stat(serverFileRoute, (error, exist) => {
        if (exist) {
            return res.sendFile(path.resolve(serverFileRoute));
        }
        else{
            return res.status(404).json({
                status: "error",
                message: "La imagen no existe",
                exist,
                fileData,
                serverFileRoute
            })
        }

    });
}

module.exports = {
    prueba,
    create,
    getProducts,
    getJustOne,
    deleteProduct,
    updateProduct,
    uploadImage,
    image
}