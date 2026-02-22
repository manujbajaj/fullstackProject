import dotenv from "dotenv" 
import express from "express"
import connectDB from "./db/index.js";

dotenv.config({
    path:"./env"
})



connectDB()



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