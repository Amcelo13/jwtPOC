const userModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtGenerate } = require("../config/jwtGenerate");

class userController {
  //Sign Up
  static userRegistration = async (req, res) => {
    const { name, email, password, password_confirmation, tc } = req.body;
    // Check if the email is already registered
    const user = await userModel.findOne({ email });
    if (user) {
      return res.send({
        status: "failed",
        message: "Email already registered",
      });
    }

    if (name && email && password && password_confirmation && tc) {
      if (password === password_confirmation) {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(password, salt);

          const doc = new userModel({
            name: name,
            email: email,
            password: hashPassword,
            tc: tc,
          });
          await doc.save();
          const saved_user = await userModel.findOne({ email });
          //Generate the JWT token
          const generated_token = jwtGenerate(saved_user);

          res.send({
            status: "success",
            message: "Registration successful",
            token: generated_token,
          });
        } catch (err) {
          console.log(err);
          res.send({ status: "failed", message: "Unable to register" });
        }
      } else {
        res.send({
          status: "failed",
          message: "Password and Confirm Password don't match",
        });
      }
    } else {
      res.send({ status: "failed", message: "All fields are required" });
    }
  };

  //Login
  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      //if both are gotten from the frontend
      if (email && password) {
        const user = await userModel.findOne({ email });
        if (user) {
          console.log(user.password, "database");
          console.log(password, "frontend_/postman");
          const isMatch = await bcrypt.compare(
            password.toString(),
            user.password.toString()
          );

          if (user.email === email && isMatch) {
            //Generate the JWT token
            const generated_token = jwtGenerate(user);

            res.send({
              status: "success",
              message: "Login successful",
              token: generated_token,
            });
          } else {
            res.send({
              status: "failed",
              message: "Email or password is invalid",
            });
          }
        } else {
          res.send({
            status: "failed",
            message: "User not registered please signup",
          });
        }
      } else {
        res.send({ status: "failed", message: "All field are required " });
      }
    } catch (err) {
      console.log(err);
      res.send({ status: "failed", message: "Unable to login" });
    }
  };

  //Change the password
  static changePassword = async (req, res) => {
    const { password, password_confirmation } = req.body;
    if (password && password_confirmation) {
      if (password !== password_confirmation) {
        //meaning not old but both new password fields
        res.send({
          status: "failed",
          message: "New password and confirm new password does not match ",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(password, salt);

        //req.user._id is from middleware
        await userModel.findByIdAndUpdate(req.user._id, {
          $set: { password: newHashPassword },
        });
        res.send({
          status: "success",
          message: "Password changed successfully",
        });
      }
    } else {
      res.send({ status: "failed", message: "All fields are required" });
    }
  };

  //Logged user Information/Data found by JWT Authentication TOKEN In middleware
  static loggedUser = async (req, res) => {
    res.send({ "Logged user is : ": req.user });
  };

  //Send Password Reset Email
  static sendPasswordResetEmail = async (req, res) => {
    const { email } = req.body;
    if (email) {
      const user = await userModel.findOne({ email });
      if (user) {
        const secret = user._id + process.env.JWT_SECRET_KEY; //Making a new secret for reseting the emailf
        const token = jwt.sign({ userID: user._id }, secret, {
          expiresIn: "15m",
        });
        const link = `http://localhost:3000/api/users/reset/${user._id}/${token}`; //sending the user too this frontend route with also sending params
        //This is to frontend and nodemailer npm can be used to send email to in realtime
        console.log(link);
        res.send({
          status: "success",
          message: "Reset email sent ,Please check your email",
        });
      } else {
        res.send({
          status: "failed",
          message: "User not registered please signup",
        });
      }
    } else {
      res.send({
        status: "failed",
        message: "Email is required",
      });
    }
  };

  //Now reset the password sent on to the email
  static resetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password, password_confirmation } = req.body;

    const user = await userModel.findById(id);
    const new_secret = user._id + process.env.JWT_SECRET_KEY;

    try {
      jwt.verify(token, new_secret);
      if (password && password_confirmation) {
            if(password === password_confirmation){
              const salt = await bcrypt.genSalt(10);
              const newHashPassword = await bcrypt.hash(password, salt);
              //req.user._id is from middleware
              await userModel.findByIdAndUpdate(user._id, {
                $set: { password: newHashPassword },
              });
              res.send({
                status: "success",
                message: "Password reset successfully",
              });
            }
            else{
              res.send({
                status: "failed",
                message: "Password and confirm password does not match ",
              });
            }
      } else {
        res.send({
          status: "failed",
          message: "All fields are required",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
}

module.exports = userController;
