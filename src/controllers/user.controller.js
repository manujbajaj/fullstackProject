import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary , deleteFromCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"


const generateAccessNdRefreshToken=async(userId)=>{
    try{
    
        const user=await User.findById(userId)

        const accessToken=await user.generateAccessToken();
        const refreshToken=await user.generateRefreshToken();
        console.log(refreshToken);
        

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
    
    if(req.files&&req.files?.coverImage?.length>0){
        coverImageLocalPath=await req.files.coverImage[0].path;
        
    }
    
    if(!avatarLocalPath){
        throw new ApiError(400,"avatar image is required")
    }
    
    
    
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)
    const avatar=await uploadOnCloudinary(avatarLocalPath)

    const public_idImage=coverImage.public_id;
    const public_idAvatar=avatar.public_id;
    

   

    if(!avatar){
        throw new ApiError(400,"avatar image is not uploaded")
    }

    const user=await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        password,
        userName:userName.toLowerCase(),
        public_idAvatar,
        public_idImage
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

    const user=await User.findById(req.user?._id);

    user.refreshToken=undefined;

    await user.save({validateBeforeSave:false})
    
    // await User.findByIdAndUpdate(
    //     req.user?._id,
    //     {
    //         $set:{refreshToken:undefined}
    //     },
    //     {
    //         new:true
    //     }        
    // )
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

const refreshAccessToken=asyncHandler(async(req,res)=>{
    try {
        const incomingRefreshToken=req?.cookies?.refreshToken || req.body.refreshToken
        
    
        if(!incomingRefreshToken){
            throw new ApiError(401,"unauthorized request")
        }
    
        const verified= jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
    
        if(!verified){
            throw new ApiError(500,"unauthorized Request")
        }
    
        const user=await User.findById(verified._id).select("-password")

       
    
        if(!user){
            throw new ApiError(401,"invalid refresh Token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used")
        }
    
        const options={
            httpOnly:true,
            secure:true
        }
    
        const {accessToken,refreshToken}=await generateAccessNdRefreshToken(user._id)
    
        return res.status(200)
        .cookie("refreshToken",refreshToken,options)
        .cookie("accessToken",accessToken,options)
        .json(
            new ApiResponse(200,{
                refreshToken,accessToken
            },
            "access token refreshed"    
        )
        )
    } catch (error) {
        throw new ApiError(500,error.message || "invalid refresh Token")
    }
})

const changeCurrentPassword=asyncHandler(async(req,res)=>{
    try {
        const {oldPassword,newPassword,confirmPassword}=req.body;
    
        const user=await User.findById(req.user?._id)
    
        const verifyPass=await user.isPasswordCorrect(oldPassword)
    
        if(!verifyPass){
            throw new ApiError(400,"your old password is incorrect")
        }
    
        if(newPassword!==confirmPassword){
            throw new ApiError(400,"the password does not match");
        }
    
        user.password=newPassword
        await user.save({validateBeforeSave:false})
    
        return res
        .status(200)
        .json(new ApiResponse(200,{},"password changed successfully"))
    } catch (error) {
        throw new ApiError(500,error.message||"error fetching")
    }

})

const getCurrentUser=asyncHandler(async(req,res)=>{
    return await res.status(200).json({
        message:"successful",
        data:req.user
    })
})

const updateDetails=asyncHandler(async(req,res)=>{
    //verify by sending the verifyJWT
    //get the user details using the req.user
    //verify the user details
    //upddate the user details
    //save the user details await 
    try {
        const{updatedUsername,updatedEmail,fullName}=req.body;
        if(!updatedUsername || !updatedEmail || !fullName){
            throw new ApiError(400,"enter atleast one of the feilds from the three")
        }
    
        const {_id} =req.user;
        const user= await User.findById(_id)
        if (updatedEmail) {
            user.email=updatedEmail;
        }
        if (updatedUsername) {
            user.userName=updatedUsername;
        }
        if (fullName) {
            user.fullName=fullName;
        }
        await user.save({validateBeforeSave:false});
        return res.status(200).json(new ApiResponse(200,user,"successfully done"))

    } catch (error) {
        throw new ApiError(500,"error in fetching the data")
    }
})

const updateUserAvatar=asyncHandler(async(req,res)=>{
    try {
        let userAvatar=req.file?.path;
        
        if(!userAvatar){
            throw new ApiError(400,"error fetching the avatar")
        }
    
        const {_id}=req.user;

        const user=await User.findById(_id);
        
        const oldAvatarUrl=user.public_idAvatar;

        console.log(oldAvatarUrl);
        
        
        const response=await deleteFromCloudinary(oldAvatarUrl)

        if(!response){
            throw new ApiError(400,"error deleting from the cloudinary")
        }
        const uploadedUrl=await uploadOnCloudinary(userAvatar)

        if(!uploadedUrl){
            throw new ApiError(400,"error in uploading the files")
        }




        user.avatar=uploadedUrl.url;

        await user.save({validateBeforeSave:false})
    
        res.status(200).json(
            new ApiResponse(200,{},"avatar updated successful")
        )
    } catch (error) {
        throw new ApiError(500,error.message || "error getting the avtar")
    }

})

const updateUserCoverImage=asyncHandler(async(req,res)=>{
    try {
        const coverImage=req.file?.path;

        if(!coverImage){
            throw new ApiError(400,"upload the cover image")
        }

        const {_id}=req.user;

        const uploadedImage=await uploadOnCloudinary(coverImage)

        if(!uploadedImage){
            throw new ApiError(400,"error uploading the coverImage on the cloudinary")
        }

        const user=await User.findByIdAndUpdate(
            {_id},
            {
                $set:{coverImage:uploadedImage.url}
            },
            {new:true}
        ).select("-password")

        if(!user){
            throw new ApiError(400,"error in returning the userdata")
        }

        res.status(200).json(
            new ApiResponse(200,user,"coverImage uploaded success")
        )

    } catch (error) {
        throw new ApiError(500,error.message||"error fetching the coverimage")
    }
})

const getUserChannelProfile=asyncHandler(async(req,res)=>{
    const {username}=req.params

    if(!username?.trim()){
        throw new ApiError(400,"username is missing")
    }
    // User.find({username})



    //find subscribers and following
    const channel=await User.aggregate([
        {
            $match:{
                username:username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"
            }
        },
        {
            $addFields:{
                subscribersCount:{
                    $size:"$subscribers"
                },
                channelsSubscribedToCount:{
                    $size:"$subscribedTo"
                },
                isSubscribed:{
                    $cond:{
                        if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                        then:true,
                        else:false
                    }
                }
            }
        }
    ])



})

export {registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateDetails,updateUserAvatar,updateUserCoverImage,getUserChannelProfile}