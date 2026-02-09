# Push.ps1
# Safely runs git push if there are commits to push.
# Usage: .\Push.ps1

# Check for commits to push
$branch = git rev-parse --abbrev-ref HEAD
$local = git rev-parse $branch
$remote = git rev-parse origin/$branch 2>$null

if ($local -eq $remote) {
    Write-Host "No new commits to push."
    exit 0
}

Write-Host "Pushing commits to origin/$branch..."
git push origin $branch

if ($LASTEXITCODE -eq 0) {
    Write-Host "Push successful."
} else {
    Write-Host "Push failed."
    exit $LASTEXITCODE
}
