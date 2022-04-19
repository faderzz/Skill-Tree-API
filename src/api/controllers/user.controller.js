const asyncHandler = require("express-async-handler");
const User = require("../../models/user.model");



const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
    });
  } else {
    res.status(401);
    throw new Error("Invalid Username or Password");
  }
});


const registerUser = asyncHandler(async (req, res) => {
  const {username, password } = req.body;

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(404);
    throw new Error("User already exists");
  }

  const user = await User.create({
    username,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({username},{password});

  if (user) {
    user.username = req.body.name || user.username;
    user.pic = req.body.pic || user.pic;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      pic: updatedUser.pic,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});


const removeUser = asyncHandler(async (req,res) =>{
    try{

        const removedUser = await User.remove({username:req.body.username})
        res.json(removedUser)
        }catch(error){
          res.json({message:error})
        }
      })



module.exports= { authUser, updateUserProfile, registerUser, removeUser }