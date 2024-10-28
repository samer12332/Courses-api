const User = require('../models/user_model');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const generateJWT = require('../utils/generateJWT');


const getAllUsers = asyncWrapper( async (req, res, next) => {
    const usersLength = await User.countDocuments();
    let {page, limit} = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    let skip = (page - 1) * limit;

    if(skip >= usersLength) {
        const error = appError
        .create('No More Users To Show', 400, httpStatusText.FAIL);
        return next(error);
    }

    let users = await User.find({}, {__v: false, password: false})
    .skip(skip).limit(limit);

    res.json({
        status: httpStatusText.SUCCESS,
        data: {users}
    });
}
)

const register = asyncWrapper( async (req, res, next) => {
    const {firstName, lastName, email, password, role} = req.body;
    const existingUser = await User.findOne({email});
    if (existingUser) {
        const error = appError
        .create('User already exists', 400, httpStatusText.FAIL);
        return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        avatar: req.file.filename
    });
    //generate JWT token
    const token = await generateJWT({email: newUser.email, 
        id: newUser._id, role: newUser.role});
    newUser.token = token;
    await newUser.save();

    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: {user: newUser}
    });

});

const login = asyncWrapper( async (req, res, next) => {
    const {email, password} = req.body;
    if (!email || !password) {
        const error = appError.create
        ('Email And Password Are Required', 400, httpStatusText.FAIL);
        return next(error);
    }

    const existingUser = await User.findOne({email});
    if (!existingUser) {
        const error = appError
        .create('Email Does Not Exist', 400, httpStatusText.FAIL);
        return next(error);
    }
    const same = await bcrypt.compare(password, existingUser.password);
    if(!same) {
        const error = appError
        .create('Password Does Not Match', 400, httpStatusText.FAIL);
        return next(error);
    }

    //generate JWT token
    const token = await generateJWT({email: existingUser.email,
        id: existingUser._id, role: existingUser.role});
    existingUser.token = token;
    await existingUser.save();
    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: {token}
    })
})

module.exports = {
    getAllUsers,
    register,
    login
}
