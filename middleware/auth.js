const UserModal = require('../models/userdata.js');
const jwt = require('jsonwebtoken');

const responseFormet = {
    status: false,
    message: 'validation failed',
    data: {
        name: ['The name field is proper.'],
        email: ['The email field is proper.'],
        password: ['The password field is proper.'],
    },
};

exports.validateRegisterRequest = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            if (!name) {
                responseFormet.data.name = ['Provide proper username'];
            }
            if (!email) {
                responseFormet.data.email = ['Provide proper email'];
            }
            if (!password) {
                responseFormet.data.password = ['Provide proper password'];
            }
            return res.status(200).json(responseFormet); // 400 - bad request
        } else {
            let flag = false;

            // email is already exist
            if (await UserModal.findOne({ email: email })) {
                responseFormet.data.email = ['Email already exists'];
                flag = true;
            }

            // user is already exist
            if (await UserModal.findOne({ name: name })) {
                responseFormet.data.name = ['Username already exists'];
                flag = true;
            }

            // password is less than 6 characters
            if (password.length < 6) {
                responseFormet.data.password = [
                    'Password must be at least 6 characters long',
                ];
                flag = true;
            }

            if (flag) {
                return res.status(200).json(responseFormet); // 400 - bad request
            }
        }

        next();
    } catch (err) {
        responseFormet.data.message = ['Something went wrong'];
        res.status(200).json(responseFormet); // 500 - internal server error
        console.log(err);
    }
};

exports.validateLoginRequest = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            if (!email) {
                responseFormet.data.email = ['Provide proper email'];
            }
            if (!password) {
                responseFormet.data.password = ['Provide proper password'];
            }
            return res.status(200).json(responseFormet); // 400 - bad request
        } else if (password.length < 6) {
            // password is less than 6 characters
            responseFormet.data.password = [
                'Password must be at least 6 characters long',
            ];
            return res.status(200).json(responseFormet); // 400 - bad request
        }
        next();
    } catch (err) {
        responseFormet.data.message = ['Something went wrong'];
        res.status(200).json(responseFormet); // 500 - internal server error
        console.log(err);
    }
};

exports.validateToken = async (req, res, next) => {
    let checkToken, token;
    try {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            responseFormet.data.message = ['No token provided'];
            return res.status(200).json(responseFormet); // 401 - unauthorized
        }

        try {
            checkToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (err) {
            responseFormet.data.message = ['Something went wrong'];
            res.status(200).json(responseFormet); // 500 - internal server error
            console.log(err);
        }
    } catch (err) {
        responseFormet.message = 'Something went wrong';
        res.status(200).json(responseFormet); // 500 - internal server error
        console.log(err);
    }

    // res added with token and id for controller
    res.locals.token = token;
    res.locals.id = checkToken.id;

    next();
};
