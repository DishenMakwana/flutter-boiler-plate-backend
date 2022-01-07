// Requiring module
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger/swagger_output.json');
// const fs = require('fs');
// const customCss = fs.readFileSync(
//     process.cwd() + '/swagger/swagger.css',
//     'utf8'
// );

//routers
const userRoute = require('./routes/users.js');

// config
dotenv.config();

// Creating express object
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// cross-origin request
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    );
    next();
});

// routes
app.use('/auth', userRoute);

// use swagger api documentation
// app.use(
//     '/api/docs',
//     swaggerUi.serve,
//     swaggerUi.setup(swaggerDocument, { customCss })
// );

// Port Number
const PORT = process.env.PORT || 5000;

// mongo connection
const CONNECTION_URL = process.env.CONNECTION_URL;

mongoose
    .connect(CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`);
            console.log(CONNECTION_URL);
        });
    })
    .catch((err) => {
        console.log(err.message);
    });
