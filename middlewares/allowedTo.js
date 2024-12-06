const appError = require("../utils/appError");

module.exports = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.currentUser.role)) {
            const error = appError.create('This Role Is Not Authorized', 401)
            return next(error);
        }
        next();
    }
}