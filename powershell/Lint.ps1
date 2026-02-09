# Lint.ps1
# Safely runs ESLint for the project, whether called directly or from another PowerShell script.
# Usage: .\Lint.ps1

param(
    [string]$TargetPath = "."
)

# Save the current location to restore later
$originalLocation = Get-Location

try {
    # Change to the script's directory (project root)
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
    Set-Location $scriptDir/..

    # Run ESLint
    if (Test-Path "./node_modules/.bin/eslint") {
        Write-Host "Running ESLint on $TargetPath..."
        ./node_modules/.bin/eslint $TargetPath
    } else {
        Write-Host "ESLint not found. Please install dependencies first."
        exit 1
    }
} finally {
    # Restore the original location
    Set-Location $originalLocation
}
