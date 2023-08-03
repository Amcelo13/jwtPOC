const jwt = require("jsonwebtoken");
const userModel = require("../models/User");

//Token validation to authenticate THE user
module.exports.checkAuth = async (req, res, next) => { 

    let tokenFromFrontend;
    //Get token from header
    const {authorization} = req.headers

    if(authorization && authorization.startsWith('Bearer')) {
            try{
                tokenFromFrontend = authorization.split(' ')[1]
                //Verify the token
                const {userID} = jwt.verify(tokenFromFrontend, process.env.JWT_SECRET_KEY)
                //GETTING THE USER using token
                req.user = await userModel.findById(userID).select('-password')  //it will be on this route and can be used after next also
                next() 
            }
            catch(err){
                    res.status(401).send({status:"failed", message:"Unauthorized User"})
            }
    }

    if(!tokenFromFrontend) {

        res.status(401).send({status:"failed", message:"Unauthorized User as No token found"})
    }
}