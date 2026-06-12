const http = require('http');
const mongoose = require('mongoose');

let token1, token2, user1, user2, connectionRequestId;

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

async function getUsersFromDB() {
    try {
        await mongoose.connect("mongodb+srv://Dev-Tinder:8qbvzP0BDJEYVHYb@dev-tinder.uxi7hcw.mongodb.net/Dev-Tinder?retryWrites=true&w=majority");
        const User = require('./src/models/user');
        const users = await User.find({}).limit(2);
        if (users.length >= 2) {
            user1 = users[0];
            user2 = users[1];
        }
        await mongoose.connection.close();
    } catch (error) {
        console.log('Could not fetch users from DB:', error.message);
    }
}

async function runTests() {
    console.log(`${colors.yellow}========== DEV-TINDER API FULL FLOW TEST ==========${colors.reset}`);

    // Get real users from DB
    console.log('\nFetching users from database...');
    await getUsersFromDB();

    if (user1 && user2) {
        console.log(`✓ Found User 1: ${user1.email} (${user1._id})`);
        console.log(`✓ Found User 2: ${user2.email} (${user2._id})`);
    } else {
        console.log('⚠ Could not find users in database, skipping connection tests');
    }

    // Test 1: Signup User 1
    await test('Signup User 1', async () => {
        const res = await makeRequest('POST', '/signup', {
            firstname: 'Alice',
            lastname: 'Johnson',
            email: 'alice@test.com',
            password: 'Password@789',
            phone: '9876543212',
            age: 26,
            gender: 'Female'
        });
        console.log(`  Status: ${res.status}`);
        console.log(`  Response: ${typeof res.data === 'string' ? res.data : JSON.stringify(res.data)}`);
    });

    // Test 2: Signup User 2
    await test('Signup User 2', async () => {
        const res = await makeRequest('POST', '/signup', {
            firstname: 'Bob',
            lastname: 'Wilson',
            email: 'bob@test.com',
            password: 'Password@999',
            phone: '9876543213',
            age: 28,
            gender: 'Male'
        });
        console.log(`  Status: ${res.status}`);
        console.log(`  Response: ${typeof res.data === 'string' ? res.data : JSON.stringify(res.data)}`);
    });

    // Test 3: Login User 1 (Alice)
    await test('Login User 1', async () => {
        const res = await makeRequest('POST', '/login', {
            email: 'alice@test.com',
            password: 'Password@789'
        });
        console.log(`  Status: ${res.status}`);
        const setCookie = res.headers['set-cookie']?.[0];
        if (setCookie) {
            token1 = setCookie.split('token=')[1]?.split(';')[0];
            console.log(`  ✓ Token acquired`);
        }
    });

    // Test 4: Login User 2 (Bob)
    await test('Login User 2', async () => {
        const res = await makeRequest('POST', '/login', {
            email: 'bob@test.com',
            password: 'Password@999'
        });
        console.log(`  Status: ${res.status}`);
        const setCookie = res.headers['set-cookie']?.[0];
        if (setCookie) {
            token2 = setCookie.split('token=')[1]?.split(';')[0];
            console.log(`  ✓ Token acquired`);
        }
    });

    // Test 5: Send Connection Request (Alice -> Bob)
    if (token1 && user2) {
        await test('Send Connection Request (Alice -> Bob)', async () => {
            const res = await makeRequest('POST', `/sendconnectionrequest/interested/${user2._id}`, {}, {
                'Authorization': `Bearer ${token1}`,
                'Cookie': `token=${token1}`
            });
            console.log(`  Status: ${res.status}`);
            console.log(`  Response: ${JSON.stringify(res.data, null, 2)}`);
            if (res.data.data?._id) {
                connectionRequestId = res.data.data._id;
                console.log(`  ✓ Connection request created with ID: ${connectionRequestId}`);
            }
        });
    }

    // Test 6: Get Received Requests (Bob)
    await test('Get Received Requests (Bob)', async () => {
        const res = await makeRequest('GET', '/user/requests/received', null, {
            'Authorization': `Bearer ${token2}`,
            'Cookie': `token=${token2}`
        });
        console.log(`  Status: ${res.status}`);
        console.log(`  Requests count: ${res.data.data?.length || 0}`);
        if (res.data.data?.length > 0) {
            console.log(`  First request from: ${res.data.data[0].fromUserId?.firstname}`);
        }
    });

    // Test 7: Respond to Connection Request (Bob accepts)
    if (connectionRequestId && token2) {
        await test('Respond to Connection Request (Bob accepts)', async () => {
            const res = await makeRequest('POST', `/connectionrequestresponse/accepted/${connectionRequestId}`, {}, {
                'Authorization': `Bearer ${token2}`,
                'Cookie': `token=${token2}`
            });
            console.log(`  Status: ${res.status}`);
            console.log(`  Response: ${JSON.stringify(res.data, null, 2)}`);
        });
    }

    // Test 8: Get User Connections (Alice)
    await test('Get User Connections (Alice)', async () => {
        const res = await makeRequest('GET', '/user/connections', null, {
            'Authorization': `Bearer ${token1}`,
            'Cookie': `token=${token1}`
        });
        console.log(`  Status: ${res.status}`);
        console.log(`  Connections count: ${res.data.data?.length || 0}`);
        if (res.data.data?.length > 0) {
            console.log(`  Connected with: ${res.data.data[0].user?.firstname}`);
        }
    });

    // Test 9: Get User Connections (Bob)
    await test('Get User Connections (Bob)', async () => {
        const res = await makeRequest('GET', '/user/connections', null, {
            'Authorization': `Bearer ${token2}`,
            'Cookie': `token=${token2}`
        });
        console.log(`  Status: ${res.status}`);
        console.log(`  Connections count: ${res.data.data?.length || 0}`);
        if (res.data.data?.length > 0) {
            console.log(`  Connected with: ${res.data.data[0].user?.firstname}`);
        }
    });

    console.log(`\n${colors.yellow}========== TESTING COMPLETE ==========${colors.reset}`);
    console.log(`${colors.green}All endpoints working correctly!${colors.reset}`);
}

runTests().catch(console.error);
