// Simple test script to validate API endpoints
// Run with: node test-api.mjs

const API_BASE = 'http://localhost:3000';

const testHealthEndpoint = async () => {
    console.log('🔍 Testing health endpoint...');
    try {
        const response = await fetch(`${API_BASE}/health`);
        const data = await response.json();

        if (response.ok) {
            console.log('✅ Health endpoint working:', data.message);
            return true;
        } else {
            console.log('❌ Health endpoint failed:', data);
            return false;
        }
    } catch (error) {
        console.log('❌ Health endpoint error:', error.message);
        return false;
    }
};

const testAuthProtection = async () => {
    console.log('🔍 Testing authentication protection...');
    try {
        const response = await fetch(`${API_BASE}/api/events`);
        const data = await response.json();

        if (response.status === 401) {
            console.log('✅ Authentication protection working');
            return true;
        } else {
            console.log('❌ Authentication protection failed:', data);
            return false;
        }
    } catch (error) {
        console.log('❌ Authentication test error:', error.message);
        return false;
    }
};

const runTests = async () => {
    console.log('🚀 Starting API Tests');
    console.log('='.repeat(30));

    const healthOk = await testHealthEndpoint();
    const authOk = await testAuthProtection();

    console.log('');
    console.log('📊 Test Results:');
    console.log(`Health Endpoint: ${healthOk ? '✅' : '❌'}`);
    console.log(`Auth Protection: ${authOk ? '✅' : '❌'}`);

    if (healthOk && authOk) {
        console.log('');
        console.log('🎉 Basic API tests passed!');
        console.log('💡 To test authenticated endpoints, you need a valid Firebase ID token.');
    } else {
        console.log('');
        console.log('⚠️  Some tests failed. Check if the server is running on port 3000.');
    }
};

runTests().catch(console.error);
