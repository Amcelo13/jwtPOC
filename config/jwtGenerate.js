const jwt = require("jsonwebtoken");

module.exports.jwtGenerate =  (saved_user) =>{
    const token =  jwt.sign({userID: saved_user._id},  process.env.JWT_SECRET_KEY ,{expiresIn: '5d'})
    return token
}