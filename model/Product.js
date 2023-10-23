const { Schema, model } = require("mongoose");

const ProductSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String
    },
    precio: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    marca: {
        type: String,
        required: true
    },
    modelo: {
        type: String,
        required: true
    },
    fecha: {
        type: String,
        default: Date.now
    },
    imagen: {
        type: String,
        default: "default.png"
    }
});

module.exports = model("Product", ProductSchema, "products");