const routeModules = [
    './routes/auth',
    './routes/profile',
    './routes/slots',
    './routes/bookings',
    './routes/referrals',
    './routes/activityLogs',
];

try {
    routeModules.forEach((mod) => {
        const router = require(`../${mod}`);
        if (typeof router !== 'function' || !Array.isArray(router.stack)) {
            throw new Error(`${mod} did not export an Express router`);
        }
    });
    console.log('Backend smoke passed: route modules loaded.');
    process.exit(0);
} catch (err) {
    console.error('Backend smoke failed:', err.message);
    process.exit(1);
}
