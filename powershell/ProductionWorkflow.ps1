# ProductionWorkflow.ps1
# Runs lint, format, commit, push, showrepo, and showsite (GitHub Pages) scripts safely in sequence.
# Usage: .\ProductionWorkflow.ps1

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

function Run-Step {
    param(
        [string]$ScriptName,
        [string]$Description,
        [string[]]$StepArgs = @()
    )
    Write-Host "\n=== $Description ==="
    $scriptPath = Join-Path $scriptDir $ScriptName
    if (Test-Path $scriptPath) {
        if ($StepArgs.Count -gt 0) {
            & $scriptPath @StepArgs
        } else {
            & $scriptPath
        }
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

Write-Host "\n=== Opening HTML, CSS, and Accessibility Validators ==="
$validatorScript = Join-Path $scriptDir "ShowValidator.ps1"
$siteUrl = ""
# Replicate ShowSite.ps1 logic for prod site
$gitRemote = git config --get remote.origin.url
if ($gitRemote -match "^git@github.com:(.+)\.git$") {
    $repoPath = $Matches[1]
} elseif ($gitRemote -match "^https://github.com/(.+)\.git$") {
    $repoPath = $Matches[1]
}
if ($repoPath -match "^([^/]+)/(.+)$") {
    $user = $Matches[1]
    $repo = $Matches[2]
    $siteUrl = "https://$user.github.io/$repo/"
}
if (Test-Path $validatorScript) {
    & $validatorScript -HTML -CSS -Accessibility -Url $siteUrl
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ShowValidator.ps1 failed. Exiting workflow."
        exit $LASTEXITCODE
    }
} else {
    Write-Host "ShowValidator.ps1 not found. Skipping."
}
