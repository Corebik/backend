const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        //cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
        cb(null, "product" + Date.now() + "_" + file.originalname);
    },
});

const upload = multer({
    storage: storage
})

const productController = require("../controller/productController");

// Rutas de prueba
router.get("/ruta-de-prueba", productController.prueba);

// Rutas de crear
router.post("/create", productController.create);

// Rutas de buscar
//router.get("/products", productController.getProducts);
router.get("/products/:last?", productController.getProducts);
router.get("/product/:id", productController.getJustOne);
router.delete("/product/:id", productController.deleteProduct);
router.put("/product/:id", productController.updateProduct);
router.post("/upload-image/:id", [upload.single("file")], productController.uploadImage);
router.get("/get-image/:imageData", productController.image);

module.exports = router;