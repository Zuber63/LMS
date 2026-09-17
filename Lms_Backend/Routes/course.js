const express = require('express');
const router = express.Router();
const {createCourse , updateCourse, getAllCourses, getSingleCourse, updateCourseProgress, removeCourseProgress , createRating ,getAllRatings , deleteCourse } = require('../Controllers/course');
const {createSection} = require('../Controllers/section');
const {auth, isInstructor} = require('../Middlewares/Auth');


// Route to create a new course

router.post('/createCourse', auth, isInstructor, createCourse);

// Route to update a course
router.put('/updateCourse', auth, isInstructor, updateCourse);

// route to get all courses
router.get('/getAllCourses', getAllCourses);

// route to get a single course
router.get('/getSingleCourse/:courseId', getSingleCourse);

// route to get instructor courses
const {getInstructorCourses} = require('../Controllers/course');
router.get('/getInstructorCourses/:instructorId', getInstructorCourses);


// route to create sections
router.post('/createSection', auth, isInstructor, createSection);

// route to update sections
const { updateSection } = require('../Controllers/section');
router.put('/updateSection', auth, isInstructor, updateSection);

// route to delete sections
const { deleteSection } = require('../Controllers/section');
router.delete('/deleteSection', auth, isInstructor, deleteSection);

// route to create subsections
const { createSubsection } = require('../Controllers/subsection');
router.post('/createSubsection', auth, isInstructor, createSubsection);

// route to update subsections
const { updateSubsection } = require('../Controllers/subsection');
router.put('/updateSubsection', auth, isInstructor, updateSubsection);

// route to delete subsections
const {deleteSubsection} = require('../Controllers/subsection');
router.delete('/deleteSubsection', auth, isInstructor, deleteSubsection);

router.post("/updateCourseProgress", auth, updateCourseProgress);
router.post("/removeCourseProgress", auth, removeCourseProgress);

router.post("/createRating", auth, createRating);

router.get("/getAllRatings", getAllRatings);

router.delete("/deleteCourse/:courseId", auth, isInstructor, deleteCourse);



module.exports = router;