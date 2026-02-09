# DevWorkflow.ps1
# Runs lint, format, and showsite scripts safely in sequence.
# Usage: .\DevWorkflow.ps1

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

function Run-Step {
    param(
        [string]$ScriptName,
        [string]$Description,
        [string[]]$Args = @()
    )
    Write-Host "=== $Description ==="
    $scriptPath = Join-Path $scriptDir $ScriptName
    if (Test-Path $scriptPath) {
        & $scriptPath @Args
        if ($LASTEXITCODE -ne 0) {
            Write-Host "$Description failed. Exiting workflow."
            exit $LASTEXITCODE
        }
    } else {
        Write-Host "$ScriptName not found. Skipping."
    }
}

Run-Step "Lint.ps1" "Linting code"
Run-Step "Format.ps1" "Formatting code"
Run-Step "RemoveTrailingSlashes.ps1" "Fixing trailing slashes in HTML void elements"
Write-Host "=== Opening local website ==="
$scriptPath = Join-Path $scriptDir "ShowSite.ps1"
if (Test-Path $scriptPath) {
    & $scriptPath -Dev
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Opening local website failed. Exiting workflow."
        exit $LASTEXITCODE
    }
} else {
    Write-Host "ShowSite.ps1 not found. Skipping."
}

Write-Host "\n=== Opening Trello board ==="
$trelloScript = Join-Path $scriptDir "ShowTrello.ps1"
if (Test-Path $trelloScript) {
    & $trelloScript
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ShowTrello.ps1 failed. Exiting workflow."
        exit $LASTEXITCODE
    }
} else {
    Write-Host "ShowTrello.ps1 not found. Skipping."
}
