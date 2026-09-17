const Razorpay = require("razorpay");
const crypto = require("crypto");
const Course = require("../Models/course"); 
const User = require("../Models/user");  
const { mailSender } = require("../Utils/mail"); 
require("dotenv").config();  

// 1. Razorpay Instance Initialize karo
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,      
    key_secret: process.env.RAZORPAY_KEY_SECRET 
});

exports.capturePayment = async (req, res) => {
    try {
        const { courses } = req.body; 
        const userId = req.user.userId;   

        if (!courses || courses.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide at least one Course ID",
            });
        }

        let totalAmount = 0;

        for (const courseId of courses) {
            let course;
            try {
                course = await Course.findById(courseId);
                if (!course) {
                    return res.status(404).json({
                        success: false,
                        message: `Course not found with id: ${courseId}`,
                    });
                }

                const uid = userId.toString(); 
                if (course.studentsEnrolled.includes(uid)) {
                    return res.status(400).json({
                        success: false,
                        message: `Student is already enrolled in the course: ${course.courseName}`,
                    });
                }

                totalAmount += Number(course.price);

            } catch (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: err.message });
            }
        }

        const options = {
            amount: totalAmount * 100, 
            currency: "INR",
            receipt: `receipt_rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        };

        const paymentResponse = await razorpayInstance.orders.create(options);
        console.log("Razorpay Order Generated successfully:", paymentResponse);

        return res.status(200).json({
            success: true,
            courseName: courses.length === 1 ? (await Course.findById(courses[0])).courseName : "Multiple Courses",
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        });

    } catch (error) {
        console.error("Error in capturePayment controller:", error);
        return res.status(500).json({
            success: false,
            message: "Could not initiate order. Try again later.",
        });
    }
};


exports.verifyPayment = async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature, 
            courses 
        } = req.body;

        const userId = req.user.userId; 

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses) {
            return res.status(400).json({
                success: false,
                message: "Payment verification parameters missing!",
            });
        }

        let body = razorpay_order_id + "|" + razorpay_payment_id;
        
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET) 
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $push: { enrolledCourses: { $each: courses } } },
                { new: true }
            );

            await Course.updateMany(
                { _id: { $in: courses } },
                { $push: { studentsEnrolled: userId } }
            );

            const purchasedCourses = await Course.find({ _id: { $in: courses } });
            const courseNames = purchasedCourses.map(c => c.courseName).join(", ");
            const totalAmountPaid = purchasedCourses.reduce((sum, c) => sum + Number(c.price || 0), 0);

            try {
                if (updatedUser && updatedUser.email) {
                    await mailSender(
                        updatedUser.email, 
                        "🎉 Course Purchase Successful - LMS Portal", 
                        `
                        <div style="background-color: #f8fafc; padding: 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                            <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                                
                                <!-- Header -->
                                <div style="background-color: #0f172a; padding: 24px; text-align: center;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 900;">🎓 <span style="color: #6366f1;">LMS</span> Portal</h1>
                                </div>

                                <!-- Body Content -->
                                <div style="padding: 30px; text-align: left;">
                                    <h2 style="color: #1e293b; font-size: 18px; font-weight: 800; margin-top: 0; text-align: center;">Payment Successful! 🎉</h2>
                                    
                                    <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin-bottom: 20px;">Hi <strong>${updatedUser.firstName || "Student"}</strong>, aapka payment successfully verify ho gaya hai aur course aapke account me add kar diya gaya hai.</p>
                                    
                                    <!-- Details Card -->
                                    <div style="background-color: #f1f5f9; border-radius: 12px; padding: 16px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
                                        <p style="color: #334155; font-size: 13px; margin: 6px 0;"><strong>📚 Course(s):</strong> ${courseNames}</p>
                                        <p style="color: #334155; font-size: 13px; margin: 6px 0;"><strong>💰 Total Paid:</strong> ₹${totalAmountPaid}</p>
                                        <p style="color: #334155; font-size: 13px; margin: 6px 0;"><strong>🆔 Order ID:</strong> ${razorpay_order_id}</p>
                                    </div>

                                    <!-- CTA Button -->
                                    <div style="text-align: center; margin-bottom: 20px;">
                                        <a href="http://localhost:5173/studentdashboard/mycourses" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-size: 14px; font-weight: bold; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);">Go to My Courses</a>
                                    </div>

                                    <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">Agar aapko koi bhi sawal ho toh humein support par contact karein. Happy Learning! 🚀</p>
                                </div>
                            </div>
                        </div>
                        `
                    );
                }
            } catch (emailError) {
                console.error("Failed to send purchase confirmation email:", emailError);
            }

            return res.status(200).json({
                success: true,
                message: "Payment Verified & Course Enrolled Successfully! 🎉",
            });

        } else {
            return res.status(400).json({
                success: false,
                message: "Payment authorization failed. Invalid signature!",
            });
        }

    } catch (error) {
        console.error("Error in verifyPayment controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error during payment verification.",
        });
    }
};