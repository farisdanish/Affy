const buildPublicSlotsQuery = (now = new Date()) => ({
    isActive: true,
    $or: [
        { endTime: { $gte: now } },
        { endTime: { $exists: false }, startTime: { $gte: now } },
        { endTime: null, startTime: { $gte: now } },
        { startTime: { $exists: false }, endTime: { $exists: false }, date: { $gte: now } },
        { startTime: null, endTime: null, date: { $gte: now } },
    ],
});

const isValidSlotWindow = (slot) => {
    if (!slot) return false;
    if (slot.startTime && slot.endTime) {
        return slot.startTime <= slot.endTime;
    }
    return true;
};

module.exports = {
    buildPublicSlotsQuery,
    isValidSlotWindow,
};
