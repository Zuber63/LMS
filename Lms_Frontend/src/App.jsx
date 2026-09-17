import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Auth from "./Pages/Auth";
import Signup from "./Pages/Signup";
import Layout from "./assets/Layout";
import VerifyEmail from "./Pages/VerifyEmail";
import StudentDashboard from "./Pages/StudentDashboard";
import ProtectedRoute from "./assets/ProtectedRoute";
import StudentDashboardHome from "./Pages/StudentDashboardHome";
import MyCourses from "./Pages/MyCourses";
import BuyCourse from "./Pages/BuyCourse";
import MyCart from "./Pages/MyCart";
import MyProfile from "./Pages/MyProfile";
import Certificates from "./Pages/Certificates";
import InstructorRoute from "./assets/InstructorRoute";
import InstructorDashboard from "./Pages/InstructorDashboard";
import InstructorHome from "./Pages/InstructorHome";
import InstructorProfile from "./Pages/InstructorProfile";
import InstructorMyCourses from "./Pages/InstructorMyCourses";
import CourseCreate from "./Pages/CourseCreate";
import CourseSyllabusForm from "./Pages/CourseSyllabusForm";
import CourseViewer from "./Pages/CourseViewer";
import CourseDetails from "./Pages/CourseDetails";
import ForgotPassword from "./Components/ForgotPassword";
import UpdatePassword from "./Components/UpdatePassword";
import Courses from "./Pages/Courses";
import CourseDetails1 from "./Pages/CourseDetails1";
import NotFound from "./Components/NotFound"; // ✅ Correct import path

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout><Home/></Layout>} />
        <Route path="/signin" element={<Auth />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verifyemail" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password/:token" element={<UpdatePassword />} />
        <Route path="/courses" element={<Layout><Courses/></Layout>} />
        <Route path="/coursedetails1/:courseId" element={<Layout><CourseDetails1/></Layout>} />

        {/* Student Routes */}
        <Route path="/studentdashboard" element={<ProtectedRoute><StudentDashboard/></ProtectedRoute>}>
          <Route index element={<StudentDashboardHome />} />
          <Route path="mycourses" element={<MyCourses />} />
          <Route path="buycourse" element={<BuyCourse />} />
          <Route path="mycart" element={<MyCart />} />
          <Route path="myprofile" element={<MyProfile />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="courseviewer/:courseId" element={<CourseViewer />} />
          <Route path="coursedetails/:courseId" element={<CourseDetails />} />
        </Route>

        {/* Instructor Routes */}
        <Route path="/instructordashboard" element={<InstructorRoute><InstructorDashboard/></InstructorRoute>}>
          <Route index element={<InstructorHome />} />
          <Route path="instructorprofile" element={<MyProfile />} />
          <Route path="instructormycourses" element={<InstructorMyCourses />} />
          <Route path="coursecreate" element={<CourseCreate />} />
          <Route path="coursesyllabusform/:courseId" element={<CourseSyllabusForm />} />
          <Route path="updatecourse/:courseId" element={<CourseCreate />} />
        </Route>

        {/* 404 Catch-all Route (Sabse last mein honi chahiye) */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  );
};

export default App;