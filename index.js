// Requiring module
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
// const swaggerUi = require('swagger-ui-express');
// const swaggerJsDoc = require('swagger-jsdoc');

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

// swagger
// const swaggerDefinition = {
//     openapi: '3.0.0',
//     info: {
//         title: 'Express API for JSONPlaceholder',
//         version: '1.0.0',
//         description:
//             'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
//         license: {
//             name: 'Licensed Under MIT',
//             url: 'https://spdx.org/licenses/MIT.html',
//         },
//         contact: {
//             name: 'JSONPlaceholder',
//             url: 'https://jsonplaceholder.typicode.com',
//         },
//     },
//     servers: [
//         {
//             url: 'http://localhost:3000',
//             description: 'Development server',
//         },
//     ],
// };

// const options = {
//     swaggerDefinition,
//     // Paths to files containing OpenAPI definitions
//     apis: ['./routes/*.js'],
// };

// const swaggerSpec = swaggerJsDoc(options);
// app.use('api/docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc));

// routes
app.use('/auth', userRoute);

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
