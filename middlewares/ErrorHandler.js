const notFoundHandler = (req, res, next) => {
    const error = new Error(`Not found ${req.originalUrl}`);
    res.status(404);
    next(error);
}

const serverErrorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        error_schema: {
            error_code: err.message
        },
        output_schema: {}
    });
}

module.exports = { notFoundHandler, serverErrorHandler };