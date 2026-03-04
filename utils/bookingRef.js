const REF_CODE_REGEX = /^[A-Za-z0-9_-]{1,32}$/;

const sanitizeRefCode = (value) => {
    if (typeof value !== 'string') return '';
    return value.trim();
};

const isValidRefCode = (value) => {
    if (!value) return false;
    return REF_CODE_REGEX.test(value);
};

const resolveRefInput = ({ queryRef, bodyRef }) => {
    const queryValue = sanitizeRefCode(queryRef);
    const bodyValue = sanitizeRefCode(bodyRef);

    if (queryValue && bodyValue && queryValue !== bodyValue) {
        return { error: 'REF_CONFLICT', ref: null };
    }
    return { error: null, ref: queryValue || bodyValue || null };
};

module.exports = {
    REF_CODE_REGEX,
    sanitizeRefCode,
    isValidRefCode,
    resolveRefInput,
};
