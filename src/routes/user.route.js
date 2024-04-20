import { loginUser, logoutuser, refresh_access_token, registerUser } from "../controllers/user.controller.js";
import express from "express";
import upload from "../middlewares/nulter.middleware.js";
import { verifyJWT } from "../middlewares/auth.midddleware.js";
const router=express.Router();
router.route("/register").post(
    upload.fields(
        [
            {name:"avatar",maxCount:1},
            {name:"coverImage",maxCount:1}
        ]
    ),
    registerUser
);
router.route("/login").post(loginUser);

//secured route
router.route("/logout").post(verifyJWT,logoutuser);
router.route('/refreshtoken').post(refresh_access_token);
export default router;