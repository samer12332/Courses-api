const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
dotenv.config();


const swaggerUi = require('swagger-ui-express'); 
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));




app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const httpStatusText = require('./utils/httpStatusText');
const coursesRouter = require('./routes/coursesRoutes');
const usersRouter = require('./routes/usersRoutes');

const url = process.env.MONGO_URL;
const port = process.env.PORT || 4000

// mongoose.connect(url)
// .then((conn) => {
//     console.log(`Database connected at ${conn.connection.host}`);
//     app.listen(port , () => {
//         console.log(`App listening on port ${port}`);
//     });
// })
// .catch((err) => {
//     console.log(err);
// });

app.listen(port , () => {
    console.log(`App listening on port ${port}`);
});

app.use(cors());


app.use(express.json());

app.use('/api/courses', coursesRouter);
app.use('/api/users', usersRouter);

//global middleware for not found routes
app.all('*', (req, res, next) => {
    res.status(404).json({
        status: httpStatusText.ERROR,
        message: 'This Resource Is Not Available'
    });
})

//global error handler
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        status: err.statusText || httpStatusText.ERROR,
        message: err.message,
        code: err.statusCode || 500,
        data: null
    });
});
