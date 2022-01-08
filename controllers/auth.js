const bcrypt = require('bcryptjs');
const UserModal = require('../models/userdata.js');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // find user in database
        const oldUser = await UserModal.findOne({ email });

        // check response form database
        if (!oldUser) {
            return res
                .status(404)
                .json({ success: false, message: "User doesn't exist" });
        }

        // check password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            oldUser.password
        );

        if (!isPasswordCorrect) {
            return res
                .status(400)
                .json({ success: false, message: 'Invalid credentials' });
        }

        // token user for authentication
        const token = jwt.sign(
            {
                email: oldUser.email,
                id: oldUser._id,
                password: oldUser.password,
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        //add auth_token to user data
        await UserModal.findOneAndUpdate(
            { email: email },
            { auth_token: token }
        );

        oldUser.auth_token = token;

        // successfully response
        res.status(200).json({
            success: true,
            user: oldUser,
            message: 'User logged in successfully.',
        });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
        console.log(err);
    }
};

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // find user in database
        const oldUser = await UserModal.findOne({ email });

        if (oldUser) {
            return res
                .status(400)
                .json({ success: false, message: 'Email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // hash password with jwt and value of round 10

        // create new user
        const result = await UserModal.create({
            name: name,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign(
            { email: result.email, id: result._id, password: hashedPassword },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        //add auth_token to user data
        await UserModal.findOneAndUpdate(
            { _id: result._id },
            { auth_token: token }
        );

        // if user created get data in oldUser
        const newUser = await UserModal.findOne({ email });

        res.status(201).json({
            success: true,
            message: 'User created successfully.',
            user: newUser,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong.',
        });
        console.log(err);
    }
};

exports.logout = async (req, res) => {
    try {
        // find user in database
        const oldUser = await UserModal.findOne({
            auth_token: res.locals.token,
        });

        if (!oldUser) {
            return res
                .status(404)
                .json({ success: false, message: 'User not found' });
        }

        // remove auth_token from user data
        await UserModal.findOneAndUpdate(
            { _id: oldUser._id },
            { auth_token: '' }
        );

        // successfully response
        res.status(200).json({
            success: true,
            message: 'User logged out successfully.',
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
        });
        console.log(err);
    }
};
