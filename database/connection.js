const mongoose = require("mongoose");

const connection = async () => {
    try {

        await mongoose.connect("mongodb://127.0.0.1:27017/Ecommerce");
        console.log("Conected to MongoDB server");
        /*await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');*/
    }
    catch (err) {
        console.log(err);
        throw new Error('Error en la conexión a Mongoose');
    }
}

module.exports = {
    connection
}

