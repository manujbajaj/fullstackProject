import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser=asyncHandler(async(req,res)=>{
    //get user deatils from frotend
    //validation
    //if user already exist
    //check for images
    //upload to cloudinary
    //create user
    //remove pass and refreshtoken from response
    //check for user creation
    //return response
    
    const {userName,fullName,email,password}=req.body

    if([userName,fullName,email,password].some((feild)=>feild?.trim()==="")){
        //you can use simple if else also
        throw new ApiError(401,"Please enter the full name")
    }

    const existedUser=await User.findOne(
        {
            $or:[{userName},{email}]
        }
    
    )

    if(existedUser){
        throw new ApiError(409,"user already exist")
    }
    
    const avatarLocalPath=await req.files?.avatar[0]?.path
    const coverImageLocalPath=await req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400,"avatar image is required")
    }

    
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"avatar image is not uploaded")
    }

    const user=await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        password,
        userName:userName.toLowerCase()
    })

    const createdUser=User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"somwthing wrong in registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registered successfully")
    )
    
})

export {registerUser}