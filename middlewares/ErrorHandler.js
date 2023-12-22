const notFoundHandler = (req, res, next) => {
    const error = new Error(`Not found ${req.originalUrl}`);
    res.status(404);
    next(error);
}

const serverErrorHandler = (err, req, res, next) => {
    console.log('test')
    console.log(err)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        error_schema: {
            error_code: err.message.split('|')[0],
            error_message: {
                english: err.message.split('|')[1],
                indonesia: err.message.split('|')[2],
            }
        },
        output_schema: {}
    });
}

module.exports = { notFoundHandler, serverErrorHandler };