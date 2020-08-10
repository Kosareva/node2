import express from 'express';
import userRouter from './routes/users.js';
import indexRouter from './routes/index.js';
import notFoundRouter from './routes/not-found.js';
import dbClient from './db/db-client.js';

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('*', notFoundRouter);

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        success: false,
        errors: [{message: err.toString()}]
    });
});

app.listen(port, () => {
    console.log(`Server has been started on ${port}`);
});

process.on('SIGINT', function () {
    dbClient.clear();
});
