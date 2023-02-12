const colors = require('colors');
const mongoose = require('mongoose')

const dbConnect = async()=>{
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.DB_URI , { useNewUrlParser : true, useUnifiedTopology : true})
        console.log('> Connected database success'.bgGreen)
    } catch (error) {
        console.log(`> Error while connecting to mongoDB : ${error}`.underline.red )
    }
}
module.exports = dbConnect







