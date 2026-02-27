
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


const verifyJWT=asyncHandler(async(req,res,next)=>{

    //jwt from the user
    //jwt from the server env
    //compare both 
    // get the user from the jwt

    try {
        const token = await req.cookies?.accessToken || await req.header("Authorization")?.replace("Bearer ","");
    
        const jwtCompare= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        if(!jwtCompare){
            throw new ApiError(500,"unauthorized request")
        }
    
        const body=await User.findById(jwtCompare._id).select("-password -refreshToken")
        
        if(!body){
            throw new ApiError(500,"swomething went wrong")
        }
    
        req.body=body
    
        next()
    } catch (error) {
        throw new ApiError(500,"invalid JWT")
    }
    

})

export {verifyJWT}



























// try {
//         const token = await req.cookies?.accessToken || req.header("Authorization")
//         ?.replace("Bearer ","")
    
//         if(!token){
//             throw new ApiError(500,"Unauthorized Request")
//         }
    
//         const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
//         const user=await User.findById(decodedToken._id).select("-password -refreshToken")
    
//         if(!user){
//             throw new ApiError(500,"Something went wrong")
//         }
    
//         req.user=user;
    
//         next()
//     } catch (error) {
//         throw new ApiError(500,"error in api fetching")
//     }