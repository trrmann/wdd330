# Format.ps1
# Safely runs Prettier for the project, whether called directly or from another PowerShell script.
# Usage: .\Format.ps1

param(
    [string]$TargetPath = "."
)

# Save the current location to restore later
$originalLocation = Get-Location

try {
    # Change to the script's directory (project root)
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
    Set-Location $scriptDir/..

    # Run Prettier
    if (Test-Path "./node_modules/.bin/prettier") {
        Write-Host "Running Prettier on $TargetPath..."
        ./node_modules/.bin/prettier --write $TargetPath
    } else {
        Write-Host "Prettier not found. Please install dependencies first."
        exit 1
    }
} finally {
    # Restore the original location
    Set-Location $originalLocation
}
