import User from "../models/userModel.js";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if(!fullName || !username || !password || !confirmPassword || !gender){
            return res.status(400).json({ message: "All fields are required" });
        }
        if(password !== confirmPassword){
            return res.status(400).json({ message: "Passwords do not match" });
        }
        const user = await User.findOne({ username });
        if(user){
            return res.status(400).json({ message: "Username already exists try different one" });
        }
        const hashedPassword = await bycrypt.hash(password, 10);
        // Use DiceBear adventurer avatars for consistent placeholders
        const maleProfilePhoto = `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`;
        const femaleProfilePhoto = `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`;
        await User.create({
            fullName, 
            username, 
            password: hashedPassword, 
            profilePhoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto, 
            gender
         });
        return res.status(201).json({ message: "Account successfully created", success: true });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || !password){
            return res.status(400).json({ message: "All fields are required" });
        };
        const user = await User.findOne({ username });
        if(!user){
            return res.status(404).json({ message: "User not found", success: false });
        }
        const isPasswordMatch = await bycrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(400).json({ message: "Invalid username or password", success: false });
        }
        const tokenData = { 
            userId: user._id
        }

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

        return res.status(200).cookie("token", token, {
            maxAge: 1*24*60*60*1000, 
            httpOnly: true, 
            sameSite: 'none',
            secure: true
        }).json({ 
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePhoto: user.profilePhoto
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password -createdAt -updatedAt -__v");
        return  res.status(200).json({ users: otherUsers });
    } catch (error) {
        console.log(error);
    }
}
    