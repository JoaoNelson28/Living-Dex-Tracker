# Simple HTTP Server for PowerShell
$port = 8081
$root = "$PSScriptRoot\Living-Dex"

Write-Host "Starting HTTP server at http://localhost:$port/"
Write-Host "Serving files from $root"
Write-Host "Press Ctrl+C to stop"

try {
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
} catch {
    Write-Error "Failed to start listener: $_"
    exit 1
}

try {
    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            $path = $request.Url.LocalPath
            Write-Host "Request: $path"
            
            if ($path -eq "/") { $path = "/index.html" }
            
            # Remove potential query strings for file lookup
            $cleanPath = $path -split '\?' | Select-Object -First 1
            
            $localPath = Join-Path $root $cleanPath.TrimStart('/')
            
            if (Test-Path $localPath -PathType Leaf) {
                $content = [System.IO.File]::ReadAllBytes($localPath)
                $response.ContentLength64 = $content.Length
                
                # Simple MIME type detection
                $extension = [System.IO.Path]::GetExtension($localPath)
                switch ($extension) {
                    ".html" { $response.ContentType = "text/html; charset=utf-8" }
                    ".js"   { $response.ContentType = "application/javascript; charset=utf-8" }
                    ".css"  { $response.ContentType = "text/css; charset=utf-8" }
                    ".json" { $response.ContentType = "application/json; charset=utf-8" }
                    ".png"  { $response.ContentType = "image/png" }
                    ".jpg"  { $response.ContentType = "image/jpeg" }
                    ".svg"  { $response.ContentType = "image/svg+xml" }
                }
                
                $response.OutputStream.Write($content, 0, $content.Length)
                $response.StatusCode = 200
            } else {
                $response.StatusCode = 404
                Write-Warning "404 Not Found: $localPath"
            }
            $response.Close()
        } catch {
            Write-Error "Error handling request: $_"
        }
    }
} finally {
    if ($listener -ne $null) {
        $listener.Stop()
    }
}
