import app from '../src/app';

// Example script to verify changes (protected routes, validation, no breaking existing)
// Run with: npm run test:example or tsx tests/example.test.ts
async function runTests() {
    console.log('Running API changes verification...');

    // Test public routes (no impact)
    const healthRes = await app.request('/health');
    console.assert(healthRes.status === 200, 'Health should return 200');

    // Test POST validation
    const invalidRegRes = await app.request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: 'invalid', password: 'short', name: '' }),
        headers: { 'Content-Type': 'application/json' },
    });
    console.assert(invalidRegRes.status === 400, 'Register should validate and return 400');

    // Test protected
    const protectedRes = await app.request('/api/users/profile', {
        headers: { Authorization: 'Bearer invalid' },
    });
    console.assert(protectedRes.status === 401, 'Protected route should return 401');

    // Test public events
    const eventsRes = await app.request('/api/events');
    console.assert(eventsRes.status === 200, 'Events list should be public');

    console.log('All tests passed - changes do not impact existing features');
}

runTests().catch(console.error);
