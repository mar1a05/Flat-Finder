const User = require("./UserModel");
const jwt = require('jsonwebtoken');
const util = require('util');
const sendEmail  = require('./Email');


exports.signup = async(request, response) => {
    try{
        let newUser = await User.create(request.body);
        response.status(201).json({status: "success", data: newUser})
    }catch(err){
        response.status(400).json({status: "failed", message: err.message});
    }
}

exports.login = async(request, response) => {
    const email = request.body.email;
    const password = request.body.password;

    if(!email || !password){
        return response.status(400).json({status: "failed", message: "Please provide an email and password."});
    }

    const userDB = await User.findOne({email});

    if(!userDB || !(await userDB.comparePassword(password, userDB.password))){
        return response.status(400).json({status: "failed", message: "Incorrect email or password!"});
    }

    const token = jwt.sign({id: userDB._id}, process.env.SECRET_STR);
    userDB.activeToken = token;
    await userDB.save();

    return response.status(200).json({status: "success", message: "Login", token: token, data: userDB})
}


//Verificam daca requestul - contine tokenul + citire
//Verificam daca tokenul este valid (este acelasi cu cel emis la login + daca nu a expirat)
//Verificam daca userul exista in baza de date
//Verificam daca userul si-a schimbat paroola dupa ce a fost emis tokenul(login)
//Daca toate verificarile de mai sus sunt ok - atunci ii permitem userului sa faca acel request.


exports.protectSystem = async(request, response, next) => {
    try{
        //PART 1
        const valueToken = request.headers.authorization;
        let token;

        if(valueToken && valueToken.startsWith('bearer')){
            token = valueToken.split(" ")[1];
        }

        if(!token){
            return response.status(401).json({status: "failed", messagge: "You are not logged in."})
        }


        //PART 2 
        const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);
        


        //PART 3
        const currentUser = await User.findById(decodedToken.id);
        if(!currentUser){
            return response.status(401).json({status: "failed", messagge: "The user doesn't exist!"});
        }

        if(currentUser.activeToken !== token){
            return response.status(401).json({status: "failed", messagge: "Invalid token. Please login again!"})
        }


        //Part 4
        if(await currentUser.isPasswordChanged(decodedToken.iat)){
            return response.status(401).json({status: "failed", messagge: "The password was changed!Please login again!"})
        }


        request.currentUser = currentUser;
        next();
    }catch(err){
        return response.status(400).json({status: "failed", messagge: err.message})
    }
}


exports.permission = async(request, response, next) => {
    if(request.currentUser && request.currentUser.isAdmin){
        next();
    }else{
        return response.status(403).json({messagge: "You don't have permission!"});
    }   
}


exports.forgotPassword = async(request, response) => {
    //PART 1
    const user = await User.findOne({email: request.body.email});
    if(!user){
        return response.status(404).json({status: "failed", message: "User not found!"});
    }

    //PART 2
    const resetToken = await user.createNewPasswordToken();
    await user.save();
    


    const resetUrl = `http://localhost:5173/resetPassword/${resetToken}`;
    const message = `Follow this link to reset your password\n${resetUrl}.This link will expire in 10 minutes.`;


    try{
        await sendEmail({
            email: user.email,
            subject: "Reset your password",
            message: message
        })

        return response.status(200).json({status: "success", message: "Token sent to your email."})
    }catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        await user.save();
        return response.status(500).json({status: "failed", message: "error sending email"})
    }
    
}

exports.resetPassword = async(request, response) => {
    
    const userData = await User.findOne({passwordResetToken: request.params.token, passwordResetTokenExpires: {$gt: Date.now()}})
    console.log(userData);
    if(!userData){
        return response.status(400).json({status: "failed", message: "Token is invalid or has expired!"});
    }

    console.log(userData);

    userData.password = request.body.password;
    userData.passwordResetToken = undefined;
    userData.passwordResetTokenExpires = undefined;
    userData.passwordChangeAt = Date.now();
    await userData.save();

    const JWT = jwt.sign({id: userData._id}, process.env.SECRET_STR, {
        expiresIn: process.env.EXPIRATION_TIME,
    });

    return response.status(200).json({status: "success", JWT, data: userData})
}

exports.updatePassword = async(request, response) => {
    const user = await User.findById(request.currentUser.id);

    if(!await user.comparePassword(request.body.password, user.password)){
        return response.status(400).json({status: "failed", message: "Current password is incorrect"})
    }

    user.password = request.body.newPassword;
    user.passwordChangeAt = Date.now();
    await user.save();

    const JWT = jwt.sign({id: user._id}, process.env.SECRET_STR, {
        expiresIn: process.env.EXPIRATION_TIME,
    });

    return response.status(200).json({status: "success", JWT, data: user})
}

exports.updateProfile = async(request, response) => {
    const {userData, password} = request.body;
    const userID = request.currentUser.id;
    const user = await User.findById(userID);
    if (password != "add favourite" && password != "add flat"){
        if(!await user.comparePassword(password, user.password)){
            return response.status(400).json({status: "failed", message: "Current password is incorrect"})
        }
    }
    

    userData.updated = Date.now();

    const updatedUser = await User.findByIdAndUpdate(userID, userData, {new: true, runValidators: true});

    console.log(request.body);
    return response.status(200).json({status: "success", data: updatedUser})
}

exports.updateOtherUserProfile = async(request, response) => {
    const userID = request.body.ID;
    const userData = request.body.userData;

    const user = await User.findById(userID);
    userData.updated = Date.now();
    const updatedUser = await User.findByIdAndUpdate(userID, userData, {new: true, runValidators: true});

    return response.status(200).json({status: "success", data: updatedUser})
}

exports.deleteProfile = async(request, response) => {
    await User.findByIdAndDelete(request.currentUser.id);
    return response.status(200).json({status: "success", message: "Account deleted successfully!"})
}

exports.deleteOtherUser = async(request, response) => {
    await User.findByIdAndDelete(request.body.ID);
    return response.status(200).json({status: "success", message: "Account deleted successfully!"})
}


exports.getUserById = async(request, response) => {
    try{
        let userId = request.params.id;
        let user = await User.findById(userId).populate({path: 'flats', options: {projection: {createdBy: 0, price: 0, created: 0, __v: 0}}}).populate({path: 'messages', select: 'contents'});
        
        if(!user){
            return response.status(404).json({status: "failed", message: "User not found"});
        }

        return response.status(200).json({status: "succes", data: user});

    }catch(err){
        return response.status(400).json({status: "failed", message: "Error fetching user"})
    }
}


exports.getAllUsers = async(request, response) => {
    // const allUsers = await User.find();
    // return response.status(200).json({status: "succes", count: allUsers.length, data: allUsers});


    const currentUserId = request.currentUser.id;
    const allUsersExceptCurrent = await User.find({_id: {$ne: currentUserId}});

    return response.status(200).json({status: "succes", count: allUsersExceptCurrent.length, data: allUsersExceptCurrent});
}

exports.getCurrentUser = async(request, response) => {
    try{
        let user = request.currentUser;

        if(!user){
            return response.status(404).json({status: "failed", message: "User not found"});
        }
        
        return response.status(200).json({status: "success", data: user});
    }catch(err){
        return response.status(400).json({status: "failed", message: "Error fetching user"})
    }
}