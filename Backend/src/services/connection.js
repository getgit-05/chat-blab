const mongoose=require('mongoose')

async function connectDb(url){
    await mongoose.connect(url)
}

module.exports=connectDb
