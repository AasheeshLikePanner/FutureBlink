import jwt from 'jsonwebtoken';
import {ApiError} from '../utils/ApiError.js'
import { AsyncHandler } from '../utils/AsyncHandler.js';
import { User} from "../models/user.model.js"
import {ApiResponse} from '../utils/ApiResponse.js'

const genrateAccessTokenAndRefreshToken = async(id, username) => {
    try {
        const user = await User.findById(id);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.genreateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false});

        return {accessToken, refreshToken};
    } catch (error) {
        throw new ApiError(500, "Something went wrong while genrating refresh and acess token")
    }
}


const getuser = (async (req, res) => {

    const {username} = req.body;

    if(!username){
        throw new ApiError(500, 'frontend did not send credentials to the server')
    }
    
    const fetchedUser = await db.select().from(user).where(eq(user.username, username))

    if (!fetchedUser) {
        throw new ApiError(404, 'user not found')
    }
    return res.status(200).json(new ApiResponse(200, fetchedUser[0], "User fetched successfully"))

})

const CurrentUser = AsyncHandler(async(req,res) => {
    const r = req.user;
    return  res
    .status(200)
    .json(new ApiResponse(
        200,
        r,
        "User fetched successfully"
    ))
})


const registerUser = AsyncHandler(async (req, res) => {
    console.log('i am working here');
    const { username, email, password} = req.body;

    if(
        [username, password, email].some((f) => f?.trim() === "") 
    ){
        throw new ApiError(400, "All feilds are required")
    }
    console.log("Worked Till level 1");

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    console.log("Worked Till level 2");

    if(existedUser){
        throw new ApiError(409, "User with email or username already exist");
    }

    const user = await User.create({
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})

const loginUser = AsyncHandler(async (req, res) => {
    const {email, password} = req.body;

    if(!email && !password){
        throw new ApiError(400, "email or password is required")
    }
    console.log(email, password);
    
    const user = await User.findOne({email})
    console.log(user);
    
    if(!user){
        throw new ApiError(404, "User does not exist")
    }
    const isPassowrdValid = await user.isPasswordCorrect(password);

    if(!isPassowrdValid){
        throw new ApiError(401, "Password is incorect!")
    }
    const {accessToken, refreshToken} = await genrateAccessTokenAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        Secure:true,
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, {httpOnly:true,secure:false})
    .cookie("refreshToken", refreshToken, {httpOnly:true,secure:false})
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
})



export{
    getuser,
    registerUser,
    loginUser,
    CurrentUser
}
