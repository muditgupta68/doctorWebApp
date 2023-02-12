const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const isAuthenticate = async(req,res,next)=>{
    try {
        const { token } = req.cookies;
        if (!token) {
            return res
            .status(404)
            .json({ msg: `Auth Error`, status: false }); 
          }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await UserModel.findById(decodedData.id);
        next();

    } catch (error) {
        return res
        .status(500)
        .json({ msg: `Authentication Prohibited! Login with the credentials...`, status: false,error:error.message });
    }
}

const adminAuth = (req,res,next)=>{
    try {
        const {admin} = req.user;
        if(!admin){
            return res.status(404).json({msg:"User role prohibited!",status:false});
        }
        next();
    } catch (error) {
            return res
            .status(500)
            .json({ msg: `Server Error!`, status: false,error:error.message }); 
    }
}

module.exports = {isAuthenticate,adminAuth}