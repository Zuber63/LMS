const nodemailer=require("nodemailer")
require("dotenv").config()


exports.mailSender=async(email,title,body)=>{
    try{
        const transporter=nodemailer.createTransport({
            host:"smtp.gmail.com",
            port: 465,
            secure: true,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            },
            secure:true,
        })
        let info=await transporter.sendMail({
            from:"Zuber Saifi ",
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })
       console.log("Email sent successfully: ", info.messageId);
        return info;

    }
    catch(error){
        console.log(error.message);
    }
}