import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";     
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res, next) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists : username , email
    // check for images, check for avatar
    // upload images to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token from response
    // check for user creation
    // return res

    const {fullName, email, username, password} = req.body;
    console.log("email", email);

    // if(fullName===""){
    //     throw new ApiError(400, "Full name is required"); 
    // }
    if(
        [fullName, email, username, password].some(field => 
            field?.trim() === ""
        )
    ){
        throw new ApiError(400, "All fields are required");
    }

    // check if user already exists
    const existedUser = await User.findOne({ 
        $or: [{ email }, { username }] 
    })

    if(existedUser) {
        throw new ApiError(400, "User already exists with this email or username");
    }

    // check for images and avatar 

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar is  required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) {
        throw new ApiError(500, "Failed to upload avatar to cloudinary");
    }
    console.log("avatar", avatar);
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser) {
        throw new ApiError(500, "Failed to create user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")  
      );

})

export { registerUser };

