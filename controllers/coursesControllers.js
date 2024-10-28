// let {courses} = require('../data/courses');
const {validationResult} = require('express-validator');
const Course = require('../models/course_model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');

const getAllCourses = asyncWrapper( async (req, res, next) => {
        const coursesLength = await Course.countDocuments();
        let {page, limit} = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        let skip = (page - 1) * limit;

        if(skip >= coursesLength) {
            const error = appError.create('No More Courses To Show', 400, httpStatusText.FAIL);
            return next(error);
        }

        let courses = await Course.find({price: {$gt: 800}}, {__v: false})
        .skip(skip).limit(limit);

        res.json({
            status: httpStatusText.SUCCESS,
            data: {courses}
        });
    }
)

const AddCourse = asyncWrapper( async (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
            return next(error);
        }
        const newCourse = new Course(req.body);
        await newCourse.save();
        res.status(201).json({
            status: httpStatusText.SUCCESS,
            data: {course: newCourse}
        });
    }
)



const getCourse = asyncWrapper( async (req, res, next) => {
        const id = req.params.id;
        const course = await Course.findById(id);
        if(!course) {
            const error = appError.create('Course Not Found', 404, httpStatusText.FAIL);
            return next(error);
        }
        res.json({
            status: httpStatusText.SUCCESS,
            data: {course}
        });
    }
)


const updateCourse = asyncWrapper( async (req, res) => {
        const id = req.params.id;
        const updatedCourse = await Course.updateOne({_id: id}, {$set: {...req.body}});
        res.status(200).json({
            status: httpStatusText.SUCCESS,
            data: {course: updatedCourse}
        });
    }
)



const deleteCourse =  asyncWrapper( async (req, res) => {
        const id = req.params.id;
        const data = await Course.deleteOne({_id: id});
        res.status(200).json({
            status: httpStatusText.SUCCESS,
            data: null});
    }
)



module.exports = {
    getAllCourses,
    getCourse,
    AddCourse,
    updateCourse,
    deleteCourse
}