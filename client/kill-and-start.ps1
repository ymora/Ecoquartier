# Kill processes on ports 5173 and 5174
Write-Host "Killing processes on ports 5173 and 5174..."

# Kill process on port 5173
$process5173 = netstat -ano | findstr ":5173" | findstr "LISTENING"
if ($process5173) {
    $pid = ($process5173 -split '\s+')[-1]
    Write-Host "Killing process $pid on port 5173"
    taskkill /PID $pid /F 2>$null
}

# Kill process on port 5174
$process5174 = netstat -ano | findstr ":5174" | findstr "LISTENING"
if ($process5174) {
    $pid = ($process5174 -split '\s+')[-1]
    Write-Host "Killing process $pid on port 5174"
    taskkill /PID $pid /F 2>$null
}

Write-Host "Waiting 2 seconds..."
Start-Sleep -Seconds 2

Write-Host "Starting dev server..."
npm run dev

