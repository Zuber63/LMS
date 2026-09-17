const express = require("express");
const app = express();
const dotenv = require("dotenv").config();

const PORT = process.env.PORT || 5000;
const {cloudinaryConnect} = require("./Config/cloudnary");
const {connectDB} = require("./Config/database");
const courseRoutes = require("./Routes/course");
const fileUpload = require("express-fileupload");
const cors = require("cors")
const paymentRoutes = require("./Routes/payment");



app.use(express.json());

app.use(cors({
  origin : process.env.FRONTEND_URL ,
credentials: true
})) 

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);




// cookie parser
app.use(require("cookie-parser")());

cloudinaryConnect(); // Connect to Cloudinary
const userRoutes = require("./Routes/user");
const profileRoutes = require("./Routes/profile");


app.use("/api/user", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/payment", paymentRoutes);

connectDB();



app.listen(PORT, ()  => {
  console.log(`Server is running on port http://localhost:${PORT}`);
})






                