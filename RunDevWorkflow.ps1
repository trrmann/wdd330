# RunDevWorkflow.ps1
# Runs the DevWorkflow.ps1 script from the project root, safely handling paths.
# Usage: .\RunDevWorkflow.ps1

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$workflowScript = Join-Path $scriptDir "powershell\DevWorkflow.ps1"

if (Test-Path $workflowScript) {
    & $workflowScript
    exit $LASTEXITCODE
} else {
    Write-Host "DevWorkflow.ps1 not found in powershell folder."
    exit 1
}
