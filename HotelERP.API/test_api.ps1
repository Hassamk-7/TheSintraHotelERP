# Test RoomTypeImage API endpoints
$baseUrl = "http://localhost:5146/api"

Write-Host "Testing RoomTypeImage API endpoints..." -ForegroundColor Green

# Test 1: Get images for room type 28 (Standard Room)
Write-Host "`n1. Testing GET /roomtypeimage/roomtype/28" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/roomtypeimage/roomtype/28" -Method GET
    Write-Host "Success! Found $($response.Count) images" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Get images for room type 29 (Deluxe Room)  
Write-Host "`n2. Testing GET /roomtypeimage/roomtype/29" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/roomtypeimage/roomtype/29" -Method GET
    Write-Host "Success! Found $($response.Count) images" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get all room type images
Write-Host "`n3. Testing GET /roomtypeimage" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/roomtypeimage" -Method GET
    Write-Host "Success! Found $($response.Count) total images" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Get all room types to verify IDs
Write-Host "`n4. Testing GET /roomtypes" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/roomtypes" -Method GET
    Write-Host "Success! Found $($response.Count) room types" -ForegroundColor Green
    $response | Select-Object Id, Name, Code | Format-Table
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
