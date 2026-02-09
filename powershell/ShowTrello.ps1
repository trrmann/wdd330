# ShowTrello.ps1
# Opens the specified Trello board in the default browser.
# Usage: .\ShowTrello.ps1 [-Url <TrelloBoardUrl>]
# Can be called standalone or from another PowerShell script.

param(
    [string]$Url = "https://trello.com/b/rzDBv49D/chow-planner"
)

Write-Host "Opening Trello board..."
Start-Process $Url
