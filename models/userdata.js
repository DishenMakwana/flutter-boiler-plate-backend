const mongoose = require('mongoose');

// structure of userdata
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        auth_token: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
