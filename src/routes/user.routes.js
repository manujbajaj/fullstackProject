import { Router } from "express";
import {  loginUser, logoutUser, registerUser ,refreshAccessToken , changeCurrentPassword,
     getCurrentUser, updateDetails, updateUserAvatar,
     updateUserCoverImage} 
     from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";   
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },{
            name:"coverImage",
            maxCount:1
        }
    ])
    ,registerUser)

router.route("/login").post(upload.none(),loginUser)

router.route("/logout").post(verifyJWT,logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT,upload.none(),changeCurrentPassword)

router.route("/get-user").post(verifyJWT,getCurrentUser)

router.route("/update-details").post(verifyJWT,upload.none(),updateDetails)

router.route("/change-avatar").post(verifyJWT,upload.single("avatar"),updateUserAvatar)

router.route("/update-coverImage").post(verifyJWT,upload.single("coverImage"),updateUserCoverImage)

export default router