# API Testing Script for Dev-Tinder

$baseUrl = "http://localhost:3000"
$headers = @{"Content-Type" = "application/json"}

# Colors for output
$successColor = "Green"
$errorColor = "Red"
$infoColor = "Cyan"

Write-Host "========== DEV-TINDER API TESTING ==========" -ForegroundColor $infoColor

# Test 1: Signup User 1
Write-Host "`n[TEST 1] Signup User 1" -ForegroundColor $infoColor
$user1Data = @{
    firstname = "John"
    lastname = "Doe"
    email = "john@test.com"
    password = "Password@123"
    phone = "9876543210"
    age = 25
    gender = "Male"
} | ConvertTo-Json

try {
    $response1 = Invoke-WebRequest -Uri "$baseUrl/signup" -Method POST -Headers $headers -Body $user1Data
    Write-Host "✓ User 1 signup successful: $($response1.StatusCode)" -ForegroundColor $successColor
} catch {
    Write-Host "✗ User 1 signup failed: $($_.Exception.Message)" -ForegroundColor $errorColor
}

# Test 2: Signup User 2
Write-Host "`n[TEST 2] Signup User 2" -ForegroundColor $infoColor
$user2Data = @{
    firstname = "Jane"
    lastname = "Smith"
    email = "jane@test.com"
    password = "Password@456"
    phone = "9876543211"
    age = 23
    gender = "Female"
} | ConvertTo-Json

try {
    $response2 = Invoke-WebRequest -Uri "$baseUrl/signup" -Method POST -Headers $headers -Body $user2Data
    Write-Host "✓ User 2 signup successful: $($response2.StatusCode)" -ForegroundColor $successColor
} catch {
    Write-Host "✗ User 2 signup failed: $($_.Exception.Message)" -ForegroundColor $errorColor
}

# Test 3: Login User 1
Write-Host "`n[TEST 3] Login User 1" -ForegroundColor $infoColor
$loginData1 = @{
    email = "john@test.com"
    password = "Password@123"
} | ConvertTo-Json

try {
    $response3 = Invoke-WebRequest -Uri "$baseUrl/login" -Method POST -Headers $headers -Body $loginData1 -SessionVariable "session1"
    Write-Host "✓ User 1 login successful: $($response3.StatusCode)" -ForegroundColor $successColor
    $token1 = $session1.Cookies.GetCookies("http://localhost:3000") | Where-Object {$_.Name -eq "token"} | Select-Object -First 1
    Write-Host "Token obtained for User 1" -ForegroundColor $successColor
} catch {
    Write-Host "✗ User 1 login failed: $($_.Exception.Message)" -ForegroundColor $errorColor
}

# Test 4: Login User 2
Write-Host "`n[TEST 4] Login User 2" -ForegroundColor $infoColor
$loginData2 = @{
    email = "jane@test.com"
    password = "Password@456"
} | ConvertTo-Json

try {
    $response4 = Invoke-WebRequest -Uri "$baseUrl/login" -Method POST -Headers $headers -Body $loginData2 -SessionVariable "session2"
    Write-Host "✓ User 2 login successful: $($response4.StatusCode)" -ForegroundColor $successColor
    $token2 = $session2.Cookies.GetCookies("http://localhost:3000") | Where-Object {$_.Name -eq "token"} | Select-Object -First 1
    Write-Host "Token obtained for User 2" -ForegroundColor $successColor
} catch {
    Write-Host "✗ User 2 login failed: $($_.Exception.Message)" -ForegroundColor $errorColor
}

# Test 5: Send Connection Request (User 1 -> User 2)
Write-Host "`n[TEST 5] Send Connection Request (User 1 -> User 2)" -ForegroundColor $infoColor
if ($session1) {
    $user2Id = "REPLACE_WITH_USER2_ID"  # You'll need to get this from DB
    try {
        $response5 = Invoke-WebRequest -Uri "$baseUrl/sendconnectionrequest/interested/$user2Id" -Method POST -Headers $headers -WebSession $session1
        Write-Host "✓ Connection request sent: $($response5.StatusCode)" -ForegroundColor $successColor
        $connectionRequestData = $response5.Content | ConvertFrom-Json
        $requestId = $connectionRequestData.data._id
        Write-Host "Request ID: $requestId" -ForegroundColor $infoColor
    } catch {
        Write-Host "✗ Connection request failed: $($_.Exception.Message)" -ForegroundColor $errorColor
    }
}

# Test 6: Get Received Requests (User 2)
Write-Host "`n[TEST 6] Get Received Requests (User 2)" -ForegroundColor $infoColor
if ($session2) {
    try {
        $response6 = Invoke-WebRequest -Uri "$baseUrl/user/requests/received" -Method GET -WebSession $session2
        Write-Host "✓ Received requests retrieved: $($response6.StatusCode)" -ForegroundColor $successColor
        $requests = $response6.Content | ConvertFrom-Json
        Write-Host "Requests: $($requests.data | ConvertTo-Json)" -ForegroundColor $infoColor
    } catch {
        Write-Host "✗ Failed to get received requests: $($_.Exception.Message)" -ForegroundColor $errorColor
    }
}

# Test 7: Respond to Connection Request (User 2)
Write-Host "`n[TEST 7] Respond to Connection Request (User 2 accepts)" -ForegroundColor $infoColor
if ($session2 -and $requestId) {
    try {
        $response7 = Invoke-WebRequest -Uri "$baseUrl/connectionrequestresponse/accepted/$requestId" -Method POST -Headers $headers -WebSession $session2
        Write-Host "✓ Connection request responded: $($response7.StatusCode)" -ForegroundColor $successColor
        $responseData = $response7.Content | ConvertFrom-Json
        Write-Host "Response: $($responseData | ConvertTo-Json)" -ForegroundColor $infoColor
    } catch {
        Write-Host "✗ Failed to respond to request: $($_.Exception.Message)" -ForegroundColor $errorColor
    }
}

# Test 8: Get User Connections
Write-Host "`n[TEST 8] Get User Connections (User 1)" -ForegroundColor $infoColor
if ($session1) {
    try {
        $response8 = Invoke-WebRequest -Uri "$baseUrl/user/connections" -Method GET -WebSession $session1
        Write-Host "✓ Connections retrieved: $($response8.StatusCode)" -ForegroundColor $successColor
        $connections = $response8.Content | ConvertFrom-Json
        Write-Host "Connections: $($connections.data | ConvertTo-Json)" -ForegroundColor $infoColor
    } catch {
        Write-Host "✗ Failed to get connections: $($_.Exception.Message)" -ForegroundColor $errorColor
    }
}

Write-Host "`n========== TESTING COMPLETE ==========" -ForegroundColor $infoColor
