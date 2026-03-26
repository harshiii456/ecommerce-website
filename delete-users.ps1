# PowerShell script to delete all users (temporary endpoint without authentication)
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/v1/user/temp/delete-all" -Method DELETE -ContentType "application/json" -UseBasicParsing
    Write-Host "✅ Success: $($response.Content)"
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
}

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
