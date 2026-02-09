# Commit.ps1
# Prompts for a commit message and runs git commit if the message is not empty.
# Usage: .\Commit.ps1

param(
    [string]$Message = ""
)

    # Check for staged or unstaged changes
    $status = git status --porcelain
    if ([string]::IsNullOrWhiteSpace($status)) {
        Write-Host "No changes to commit. Working tree clean."
        exit 0
    }

    # Stage all changes (optional, remove if you want manual staging)
    git add -A

    # Prompt for commit message if not provided
    if (-not $Message) {
        $Message = Read-Host "Enter commit message"
    }

    if ([string]::IsNullOrWhiteSpace($Message)) {
        Write-Host "Commit message cannot be empty. Aborting commit."
        exit 1
    }

    # Commit with the provided message
    git commit -m "$Message"

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Commit successful."
    } else {
        Write-Host "Commit failed."
        exit $LASTEXITCODE
    }
