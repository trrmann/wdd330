# ShowSite.ps1
# Opens the local dev site or the GitHub Pages site in the default browser.
# Usage: .\ShowSite.ps1 [-Dev] [-Port 5500]


param(
    [switch]$Dev,
    [int]$Port = 5500
)

# Ensure -Dev is detected even if PowerShell doesn't set the switch
if ($args -contains "-Dev") { $Dev = $true }
# Dev mode: Only run local logic, never proceed to prod logic
if ($Dev) {
    $siteUrl = "http://localhost:$Port/"
    try {
        $response = Invoke-WebRequest -Uri $siteUrl -UseBasicParsing -TimeoutSec 2
        Write-Host "returned "+$response.StatusCode
        if ($response.StatusCode -eq 200) {
            Write-Host "Opening $siteUrl in your default browser..."
            Start-Process $siteUrl
        } else {
            Write-Host "Please start Live Server in VS Code for index.html."
        }
    } catch {
        Write-Host "Could not connect to $siteUrl."
        Write-Host "\nPlease start Live Server in VS Code for index.html, then re-run this script."
        Start-Sleep -Seconds 3
    }
} else {
    # Otherwise, open GitHub Pages site
    # Get the remote URL
    $gitRemote = git config --get remote.origin.url
    Write-Host "=== Prod === "+$gitRemote

    if (-not $gitRemote) {
        Write-Host "No remote 'origin' found."
        exit 1
    }

    # Convert SSH or HTTPS URL to user/repo
    if ($gitRemote -match "^git@github.com:(.+)\.git$") {
        $repoPath = $Matches[1]
    } elseif ($gitRemote -match "^https://github.com/(.+)\.git$") {
        $repoPath = $Matches[1]
    } else {
        Write-Host "Unrecognized remote URL format: $gitRemote"
        exit 1
    }

    # Extract user and repo
    if ($repoPath -match "^([^/]+)/(.+)$") {
        $user = $Matches[1]
        $repo = $Matches[2]
        $siteUrl = "https://$user.github.io/$repo/"
        Write-Host "Opening $siteUrl in your default browser..."
        Start-Process $siteUrl
    } else {
        Write-Host "Could not parse user and repo from: $repoPath"
        exit 1
    }
