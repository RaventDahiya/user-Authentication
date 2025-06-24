import User from "../model/user.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  //get data
  //validate
  //check user exist
  //add in database
  //genearate verification token tokens
  //save token in database(6 digit)
  //send token as email to user
  //succes status

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "all fields are reuired",
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "user already exist",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (!user) {
      return res.status(400).json({
        message: "user not registered",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.verficationToken = token;
    await user.save();
    console.log(user);

    //send email
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOption = {
      from: process.env.MAILTRAP_SENDEREMAIL,
      to: user.email,
      subject: "your verification token",
      text: `please click on the following link:
             ${process.env.CORS_ORIGIN}/api/v1/users/verify/${token}`,
    };

    await transporter.sendMail(mailOption);

    res.status(201).json({
      message: "user register successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: `user not register ERROR: ${error}`,
      success: false,
    });
  }
};

const verifyUser = async (req, res) => {
  // get token from url
  // validate check in database yes-verfiy no-error
  // set isVerfied true
  // remove vT
  //save return

  const { token } = req.params;
  if (!token) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }
  const user = await User.findOne({ verficationToken: token });
  if (!user) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }
  user.isVerified = true;
  user.verficationToken = undefined;
  await user.save();
  await user.save();
  return res.status(200).json({
    message: "User verified successfully",
    success: true,
  });
};

const login = async (req, res) => {
  //take username password
  //check username with same username and then password (bcyrt)
  //bring jwt (its like a key so that user can keep login again on same systum)
  //genearte jwt and save it in cookie by cookie parser
  //user login succesfull response
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      message: "both email and password are required",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        message: "invalid user or password",
      });
    }
    if (user.isVerified === false) {
      res.status(400).json({
        message: "user not verifyed",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({
        message: "wrong password",
      });
    }

    //jwt.sign(data,secret,expire)
    const token = jwt.sign(
      { id: user._id, role: user.role }, //token contain id which will help in identifying it
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    //now token will be store in cookies
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);
    res.status(200).json({
      message: "login successful",
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: `login fail ERROR: ${error}`,
      success: false,
    });
  }
};

const getMe = async (req, res) => {
  //take token from cookie +> by middleware auth we get req.user which contain token
  //find user by token and get data
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    //send user with res
    return res.status(201).json({
      success: true,
      message: "user data fetched succesfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      /*expires: new DataTransfer(0)*/
    }); // clear cookie to logout
    return res.status(201).json({
      success: true,
      message: "user loged out succesfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "can not logout",
      error: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    //get email
    const { email } = req.body;
    //find user based on email
    const user = await User.findOne({ email });
    //reset token + reser expiry Date.now()+10*60*1000 +>10 min user.save
    const token = crypto.randomBytes(32).toString("hex");
    const rTokenExp = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    //now token will be store in cookies
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);
    //save user
    user.resetPasswordToken = token;
    user.resetPasswordTokenExpires = rTokenExp;
    await user.save();

    //send email design url
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOption = {
      from: process.env.MAILTRAP_SENDEREMAIL,
      to: user.email,
      subject: "reset Password Token",
      text: `please click on the following link:
             ${process.env.CORS_ORIGIN}/api/v1/users/resetPassword/${token}`,
    };

    await transporter.sendMail(mailOption);

    res.status(200).json({
      success: true,
      message: "reset link send to email",
    });
  } catch (error) {
    res.status(500).json({
      message: "can not geneate reset token",
      error: error.message,
    });
  }
};
const resetPassword = async (req, res) => {
  //collect token from params
  //password from req.body
  const { token } = req.params;
  const { NewPassword } = req.body;

  //find user by token
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: Date.now() }, //grater than
    });

    if (!user) {
      return res.status(400).json({
        message: "user not found",
        success: false,
      });
    }
    //set new password in user
    user.password = NewPassword;
    //empty reset tokens
    user.resetPasswordToken = "";
    user.resetPasswordTokenExpires = "";
    //save
    await user.save();
    //return res
    return res.status(201).json({
      success: true,
      message: "password changed succesfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "can not change password",
      error: error.message,
    });
  }
};

export {
  registerUser,
  verifyUser,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
};
