const USER = require("../Models/user");
const OTP = require("../Models/otp");
const PROFILE = require("../Models/profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const crypto = require("crypto");
const {mailSender} = require("../Utils/mail");
dotenv.config();
const otpGenerator = require("otp-generator");
exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      accountType,
      password,
      confirmPassword,
      otp,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !accountType ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const validAccountTypes = ["Student", "Instructor", "Admin"];
    if (!validAccountTypes.includes(accountType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account type",
      });
    }

    const existingUser = await USER.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const otpVerification = await OTP.findOne({ email: email, otp: otp });
    if (!otpVerification) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profileData = await PROFILE.create({
      gender: null,
      dob: null,
      profession: null,
      about: null,
    });

    const newUser = await USER.create({
      firstName,
      lastName,
      phone,
      email,
      accountType,
      password: hashedPassword,
      additionalInfo: profileData._id,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Error occurred while signing up user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }
    const user = await USER.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

 
    const token = jwt.sign(
      { userId: user._id,
         accountType: user.accountType,
        email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "48h" },
    );

     const options = {
  expires: new Date(Date.now() + 48 * 60 * 60 * 1000),
  httpOnly: true,
};

user.password = undefined;
user.token = token;

res.cookie("token", token, options).status(200).json({
  success: true,
  message: "User logged in successfully",
  data: user,
  token: token,
}); 






  } catch (error) {
    console.error("Error occurred while logging in user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
console.log(email)
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await USER.findOne({ email: email });
if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }


        let otp = otpGenerator.generate(6, {
             upperCaseAlphabets: false,
          
             specialChars: false ,
            lowerCaseAlphabets: false,});
            console.log(otp)

          let isOtpExists = await OTP.find({ otp: otp });
          while (isOtpExists.length > 0) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false,
              lowerCaseAlphabets: false,  
              numbers: true,
                
            });
            isOtpExists = await OTP.find({ otp: otp });
          }

const otpData = await OTP.create({
            email: email,
            otp: otp,
        });



        // Send OTP email
        await    mailSender(
    email, 
    "🔒 Verify Your LMS Account - OTP Code", 
    `
    <div style="background-color: #f8fafc; padding: 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <div style="background-color: #0f172a; padding: 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 900;">🎓 <span style="color: #6366f1;">LMS</span> Portal</h1>
            </div>
            <div style="padding: 30px; text-align: center;">
                <h2 style="color: #1e293b; font-size: 18px; font-weight: 800; margin-top: 0;">Verification Code</h2>
                <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin-bottom: 24px;">Aapke account ke liye verification request mili hai. Niche diye gaye OTP ka use karein:</p>
                <div style="display: inline-block; background-color: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 14px 28px; margin-bottom: 24px;">
                    <span style="font-size: 28px; font-weight: 900; letter-spacing: 6px; color: #4f46e5;">${otpData.otp}</span>
                </div>
                <p style="color: #ef4444; font-size: 11px; font-weight: 700; margin: 0;">⏳ Yeh code sirf 5 minutes tak valid hai.</p>
            </div>
        </div>
    </div>
    `
)

return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            data: otpData,
        });




    } catch (error) {
        console.error("Error occurred while sending OTP:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

// get single user details
exports.getUser = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    console.log("Fetching details for User ID:", userId);

    const user = await USER.findById(userId)
      .populate("additionalInfo")
      .populate({
        path: "enrolledCourses",
        populate: {
          path: "instructor",
          select: "firstName lastName email image",
        },
      })
      .populate({
        path: "courseProgress",
        populate: [
          {
            path: "course",
          },
          {
            path: "completedVideos",
          },
        ],
      })
      .exec();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error occurred while getting user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.changePassword = async (req, res) => {
try{
const {oldPassword, newPassword, confirmNewPassword} = req.body;  

if(!oldPassword || !newPassword || !confirmNewPassword){
    return res.status(400).json({
        success: false,
        message: "All fields are required",
    });
}

if(newPassword !== confirmNewPassword){
    return res.status(400).json({
        success: false,
        message: "New password and confirm new password do not match",
    });
}
console.log(req.user.userId)
const userId = req.user.userId;
const user = await USER.findById(userId);
if(!user){
    return res.status(404).json({
        success: false,
        message: "User not found",
    });
}


const ismatch = await bcrypt.compare(oldPassword,user.password);
if(!ismatch){
    return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
    });
  }

const hashedPassword = await bcrypt.hash(newPassword, 10);
user.password = hashedPassword;
await user.save();


return res.status(200).json({
    success: true,
    message: "Password changed successfully",
});



}catch (error) {
        console.error("Error occurred while changing password:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }




}




 


exports.resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;

        // Check karein ki user database me exist karta hai ya nahi
        const user = await USER.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Your Email is not registered with us",
            });
        }

        // 20 bytes ka random secure token generate karein
        const token = crypto.randomBytes(20).toString("hex");

        // User ke model me token aur 5 minute ki expiry time update karein
        await USER.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000, // 5 Minutes
            },
            { new: true }
        );

        // ⚠️ Frontend ka URL (Port 3000 ya jo bhi aapka React/Vite port ho)
        const url = `http://localhost:5173/update-password/${token}`;
await mailSender(
    email,
    "Password Reset Link - LMS Portal",
    `
    <div style="background-color: #f8fafc; padding: 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            
            <!-- Header -->
            <div style="background-color: #0f172a; padding: 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 900;">🎓 <span style="color: #6366f1;">LMS</span> Portal</h1>
            </div>

            <!-- Body Content -->
            <div style="padding: 30px; text-align: left;">
                <h2 style="color: #1e293b; font-size: 18px; font-weight: 800; margin-top: 0; text-align: center;">Reset Your Password 🔒</h2>
                
                <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin-bottom: 20px;">
                    Hello, we received a request to reset your password. Click the button below to choose a new password for your LMS account.
                </p>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 24px 0;">
                    <a href="${url}" target="_blank" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-size: 14px; font-weight: bold; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);">
                        Reset Password
                    </a>
                </div>

            

                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />

                <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0; line-height: 1.5;">
                    ⏳ This link is only valid for <strong>5 minutes</strong>.<br>If you did not request a password reset, please ignore this email.
                </p>
            </div>
        </div>
    </div>
    `
);
        return res.status(200).json({
            success: true,
            message: "Email sent successfully, please check your email and change password",
        });

    } catch (error) {
        console.log("Error in resetPasswordToken:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending reset password mail",
            error: error.message,
        });
    }
};


// ==========================================
// 2. RESET PASSWORD (UPDATE IN DATABASE)
// ==========================================
exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;

        // Validation: Password match ho rahe hain ya nahi
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password does not match",
            });
        }

        // Token ke base par user ko dhoondein
        const userDetails = await USER.findOne({ token: token });

        // Agar user nahi mila ya token galat hai
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "Token is invalid",
            });
        }

        // Check karein ki token expire toh nahi ho gaya
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.status(403).json({
                success: false,
                message: "Token is expired, please regenerate your token",
            });
        }

        // Naye password ko hash (encrypt) karein
        const hashedPassword = await bcrypt.hash(password, 10);

        // Password update karein aur use hone ke baad token ko null kar dein
        await USER.findOneAndUpdate(
            { token: token },
            { 
                password: hashedPassword, 
                token: null, 
                resetPasswordExpires: null 
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Password reset successful",
        });

    } catch (error) {
        console.log("Error in resetPassword:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting the password",
            error: error.message,
        });
    }
};