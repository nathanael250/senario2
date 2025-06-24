const mongoose = require('mongoose');
const connectDb = async () => {
    try{
        const conn = await mongoose.connect('mongodb+srv://nathanaelniyogushimwa:dH5xuN6o0AUNhWBt@cluster0.argdsjj.mongodb.net/ussd')
        console.log(`MongoDB Connected: ${conn.connection.host}`);

    }catch(error){
        console.log('Database conncetion error', error);
    }
}


module.exports = connectDb