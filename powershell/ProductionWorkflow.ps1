# ProductionWorkflow.ps1
# Runs lint, format, commit, push, showrepo, and showsite (GitHub Pages) scripts safely in sequence.
# Usage: .\ProductionWorkflow.ps1

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

function Run-Step {
    param(
        [string]$ScriptName,
        [string]$Description,
        [string[]]$Args = @()
    )
    Write-Host "\n=== $Description ==="
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
Run-Step "Commit.ps1" "Committing changes"
Run-Step "Push.ps1" "Pushing to GitHub"
Run-Step "ShowRepo.ps1" "Opening GitHub repository page"
Run-Step "ShowSite.ps1" "Opening GitHub Pages site"
