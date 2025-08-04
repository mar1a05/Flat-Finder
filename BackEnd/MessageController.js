const Message = require('./MessageModel');
const Flat = require('./FlatModel');
const User = require('./UserModel');

exports.addMessage = async(request, response) => {
    try{
        const newMessage = await Message.create(request.body);
        await newMessage.save();

        await Flat.findByIdAndUpdate(request.body.flatId, {
            $push: { messages: {_id: newMessage._id} }
        })

        await User.findByIdAndUpdate(request.body.userId, {
            $push: { messages: {_id: newMessage._id}}
        })

        return response.status(201).json({success: "success", data: newMessage});
    }catch(err){
        return response.status(400).json({success: "failed", message: "Internal error"})
    }
}

exports.getAllMessages = async(request, response) => {
    try{
        const messages = await Message.find().populate({path: 'flatId', select: 'city streetName streetNumber'}).populate({path: 'userId', select: 'name'});
        return response.status(200).json({success: "success", data: messages});
    }catch(err){
        return response.status(400).json({success: "failed", message: "Internal error"});
    }
}