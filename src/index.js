import dotenv from "dotenv" 
import express from "express"
import  connectDB from "./db/index.js";
import app from "./app.js";


dotenv.config({
    path:"./env"
})


connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`the server has started on http://localhost:${process.env.PORT}`);        
    })
    app.on("error",(error)=>{
        console.log(error);
    })
})
.catch((err)=>{
    console.log(`db connection error ${err}`);
})


// (async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error",(error)=>{
//             console.log(error);
            
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`the app is listening on ${process.env.PORT}`);
            
//         })
//     } catch (error) {
//         console.log(`error in connection with the database ${error}`);     
//     }
// })()