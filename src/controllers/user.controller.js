import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const generateAccessNdRefreshToken=async(userId)=>{
    try{
    
        const user=await User.findById(userId)

        const accessToken=await user.generateAccessToken();
        const refreshToken=await user.generateRefreshToken();

        user.refreshToken=refreshToken;
        await user.save({ validateBeforeSave:false })

        return {refreshToken,accessToken}
    }
    catch(err){
        throw new ApiError(400,"there is error in generating the refresh token")
    }
    
}



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
    let coverImageLocalPath;
    
    if(req.files&&Array.isArray(req.files.coverImage)&&req.files.coverImage.length>0){
        coverImageLocalPath=await req.files.coverImage[0].path;
        
    }
    
    if(!avatarLocalPath){
        throw new ApiError(400,"avatar image is required")
    }
    
    
    
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    

   

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

    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"somwthing wrong in registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registered successfully")
    )

    
})

const loginUser=asyncHandler(async(req,res)=>{
    //get login details username or email and password
    //validate them if entered
    //check and validate password
    //check if user exist or not
    //if not then go to the register else login
    //return response

    const {userName,email,password}=req.body;

    if(userName.trim()===""){
        if(email.trim()===""){
            throw new ApiError(400,"enter username or email")
        }
    }
    if(password.trim()===""){
        throw new ApiError(400,"enter the password")
    }

    const userFound=await User.findOne({
        $or:[{userName},{email}]
    })

    if(!userFound){
        throw new Error(400,"user not found")
    }


    const isPasswordValide=await userFound.isPasswordCorrect(password);

    if(!isPasswordValide){
        throw new ApiError(400,"enter the correct password")
    }

    const {refreshToken,accessToken}=await generateAccessNdRefreshToken(userFound._id)

    const loginedUser=await User.findById(userFound._id).select("-refreshToken -password")

    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,
            {
                user:loginedUser,
                accessToken,
                refreshToken
            },
            "user logged in successfully"
        )
    )


})

const logoutUser=asyncHandler(async(req,res)=>{
    
    await User.findByIdAndUpdate(
        req.body?._id,
        {
            $set:{refreshToken:undefined}
        },
        {
            new:true
        }
        
    )
    const options={
        httpOnly:true,
        secure:true
    }

    res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"user Logged Out successfully")
    )
})

export {registerUser,loginUser,logoutUser}