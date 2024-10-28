const express = require('express');
const {validationSchema} = require('../middlewares/validationSchema');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();
const userRoles = require('../utils/usersRoles');
const allowedTo = require('../middlewares/allowedTo');

const {getAllCourses, getCourse,
    AddCourse, updateCourse, deleteCourse
} = require('../controllers/coursesControllers');


router.route('/')
    .get(getAllCourses)
    .post(verifyToken, allowedTo(userRoles.MANAGER), validationSchema(), AddCourse)

router.route('/:id')
    .get(getCourse)
    .patch(updateCourse)
    .delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANAGER), deleteCourse)







module.exports = router;