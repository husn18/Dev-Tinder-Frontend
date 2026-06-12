const http = require('http');

let token1, token2, connectionRequestId;

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m'
};

function makeRequest(method, path, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path,
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', chunk => responseData += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        data: responseData ? JSON.parse(responseData) : responseData
                    });
                } catch {
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        data: responseData
                    });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function test(name, fn) {
    try {
        console.log(`\n${colors.blue}[TEST] ${name}${colors.reset}`);
        await fn();
        console.log(`${colors.green}✓ PASSED${colors.reset}`);
    } catch (error) {
        console.log(`${colors.red}✗ FAILED${colors.reset}`);
        console.log(`Error: ${error.message}`);
    }
}

async function runTests() {
    console.log(`${colors.yellow}========== DEV-TINDER API TESTING ==========${colors.reset}`);

    // Test 1: Signup User 1
    await test('Signup User 1', async () => {
        const res = await makeRequest('POST', '/signup', {
            firstname: 'John',
            lastname: 'Doe',
            email: 'john@test.com',
            password: 'Password@123',
            phone: '9876543210',
            age: 25,
            gender: 'Male'
        });
        console.log(`  Status: ${res.status}`);
        console.log(`  Response: ${typeof res.data === 'string' ? res.data : JSON.stringify(res.data)}`);
    });

    // Test 2: Signup User 2
    await test('Signup User 2', async () => {
        const res = await makeRequest('POST', '/signup', {
            firstname: 'Jane',
            lastname: 'Smith',
            email: 'jane@test.com',
            password: 'Password@456',
            phone: '9876543211',
            age: 23,
            gender: 'Female'
        });
        console.log(`  Status: ${res.status}`);
        console.log(`  Response: ${typeof res.data === 'string' ? res.data : JSON.stringify(res.data)}`);
    });

    // Test 3: Login User 1
    await test('Login User 1', async () => {
        const res = await makeRequest('POST', '/login', {
            email: 'john@test.com',
            password: 'Password@123'
        });
        console.log(`  Status: ${res.status}`);
        console.log(`  Response: ${typeof res.data === 'string' ? res.data : JSON.stringify(res.data)}`);
        // Extract token from Set-Cookie header
        const setCookie = res.headers['set-cookie']?.[0];
        if (setCookie) {
            token1 = setCookie.split('token=')[1]?.split(';')[0];
            console.log(`  Token acquired: ${token1 ? 'Yes' : 'No'}`);
        }
    });

    // Test 4: Login User 2
    await test('Login User 2', async () => {
        const res = await makeRequest('POST', '/login', {
            email: 'jane@test.com',
            password: 'Password@456'
        });
        console.log(`  Status: ${res.status}`);
        console.log(`  Response: ${typeof res.data === 'string' ? res.data : JSON.stringify(res.data)}`);
        const setCookie = res.headers['set-cookie']?.[0];
        if (setCookie) {
            token2 = setCookie.split('token=')[1]?.split(';')[0];
            console.log(`  Token acquired: ${token2 ? 'Yes' : 'No'}`);
        }
    });

    // Test 5: Send Connection Request (Use placeholder ID)
    await test('Send Connection Request', async () => {
        if (!token1) {
            throw new Error('Token1 not available');
        }
        const res = await makeRequest('POST', '/sendconnectionrequest/interested/676a1b2c3d4e5f6g7h8i9j0k', {}, {
            'Authorization': `Bearer ${token1}`,
            'Cookie': `token=${token1}`
        });
        console.log(`  Status: ${res.status}`);
        console.log(`  Response: ${JSON.stringify(res.data, null, 2)}`);
        if (res.data.data?._id) {
            connectionRequestId = res.data.data._id;
        }
    });

    // Test 6: Get Received Requests
    await test('Get Received Requests (User 2)', async () => {
        if (!token2) {
            throw new Error('Token2 not available');
        }
        const res = await makeRequest('GET', '/user/requests/received', null, {
            'Authorization': `Bearer ${token2}`,
            'Cookie': `token=${token2}`
        });
        console.log(`  Status: ${res.status}`);
        console.log(`  Response: ${JSON.stringify(res.data, null, 2)}`);
    });

    // Test 7: Respond to Connection Request
    if (connectionRequestId && token2) {
        await test('Respond to Connection Request', async () => {
            const res = await makeRequest('POST', `/connectionrequestresponse/accepted/${connectionRequestId}`, {}, {
                'Authorization': `Bearer ${token2}`,
                'Cookie': `token=${token2}`
            });
            console.log(`  Status: ${res.status}`);
            console.log(`  Response: ${JSON.stringify(res.data, null, 2)}`);
        });
    }

    // Test 8: Get User Connections
    await test('Get User Connections (User 1)', async () => {
        if (!token1) {
            throw new Error('Token1 not available');
        }
        const res = await makeRequest('GET', '/user/connections', null, {
            'Authorization': `Bearer ${token1}`,
            'Cookie': `token=${token1}`
        });
        console.log(`  Status: ${res.status}`);
        console.log(`  Response: ${JSON.stringify(res.data, null, 2)}`);
    });

    console.log(`\n${colors.yellow}========== TESTING COMPLETE ==========${colors.reset}`);
}

runTests().catch(console.error);
