const USER = require("../Models/user");
const PROFILE = require("../Models/profile");


exports.updateProfile = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const { gender, dob, profession, about, firstName, lastName, phone  } = req.body; 
     
console.log("Request body:", req.body);
        // Find the user by ID
        console.log(req.user.userId)    
        const user = await USER.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

const profileId = user.additionalInfo;

        // Find the profile by ID
        const profile = await PROFILE.findById(profileId);
        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

const updatedUser = await USER.findByIdAndUpdate(
            req.user.userId,
            { firstName, lastName, phone },
            { new: true } // Return the updated document
        );

        // Update the profile fields
       const updatedProfile = await PROFILE.findByIdAndUpdate(
            profile._id,{ gender, dob, profession, about, },
            { new: true } // Return the updated document
        );

        const updatedProfileData = await USER.findById(req.user.userId).populate("additionalInfo");

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",    
            user: updatedUser,
            profile: updatedProfileData.additionalInfo, 
        });

} 
catch (error) {
        console.error("Error occurred while updating profile:", error);
        return res.status(500).json({ success: false, 
            message: "Internal server error",
            error: error.message,
         });
    }}



    exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
    
    
    
    
    
    
    }





    catch (error) {
        console.error("Error occurred while deleting account:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });}

    }