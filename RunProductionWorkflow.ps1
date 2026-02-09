# RunLocalWorkflow.ps1
# Runs the LocalWorkflow.ps1 script from the project root, safely handling paths.
# Usage: .\RunLocalWorkflow.ps1

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$workflowScript = Join-Path $scriptDir "powershell\ProductionWorkflow.ps1"

if (Test-Path $workflowScript) {
    & $workflowScript
    exit $LASTEXITCODE
} else {
    Write-Host "ProductionWorkflow.ps1 not found in powershell folder."
    exit 1
}
