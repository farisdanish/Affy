const sendError = (res, status, message, code, details) => {
    const payload = { message, code };
    if (details !== undefined) {
        payload.details = details;
    }
    return res.status(status).json(payload);
};

const sendValidationError = (res, details) => {
    return sendError(res, 400, 'Validation failed', 'VALIDATION_ERROR', details);
};

module.exports = {
    sendError,
    sendValidationError,
};
