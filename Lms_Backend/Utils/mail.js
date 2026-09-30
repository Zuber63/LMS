// const nodemailer = require("nodemailer");
// require("dotenv").config();

// exports.mailSender = async (email, title, body) => {
//     try {
//         const transporter = nodemailer.createTransport({
//             host: "smtp.gmail.com",
//             port: 587,
//             secure: false,
//             auth: {
//                 user: process.env.MAIL_USER,
//                 pass: process.env.MAIL_PASS,
//             },
//         });

//         const info = await transporter.sendMail({
//             from: `"Zuber Saifi" <${process.env.MAIL_USER}>`,
//             to: email,
//             subject: title,
//             html: body,
//         });

//         console.log("Email sent successfully:", info.messageId);

//         return info;
//     } catch (error) {
//         console.log("MAIL ERROR:", error);
//         throw error;
//     }
// };

const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

exports.mailSender = async (email, title, body) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "LMS <onboarding@resend.dev>",
            to: [email],
            subject: title,
            html: body,
        });

        if (error) {
            console.log("MAIL ERROR:", error);
            throw new Error(error.message);
        }

        console.log("Email sent successfully:", data);

        return data;
    } catch (error) {
        console.log("MAIL ERROR:", error);
        throw error;
    }
};