import { loginUser, registerUser,CurrentUser, getuser } from "../controllers/user.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";



const userRouter = Router();

userRouter.route('/login').post(loginUser)

userRouter.route("/register").post(registerUser)

userRouter.route('/current-user').get( verifyJWT,CurrentUser)

userRouter.route('/getuser').post(verifyJWT,getuser)

export default userRouter ;