$solutionPath = "backend/UmbracoJAM.sln"
$projectPath = "backend/src/Project/UmbracoJAM/code/UmbracoJAM.Project.Web.csproj"
$clean = $false
$nuGet = $true

 if ($clean) {
     Write-Host "Cleaning $($solutionPath)" -foregroundcolor green
     & msbuild "$($solutionPath)" /t:Clean /m
 }

 if ($nuGet) {
     Write-Host "Restoring NuGet packages" -foregroundcolor green
     nuget restore "$($solutionPath)"
 }

Write-Host "Publishing $($solutionPath)" -foregroundcolor green
& msbuild "$($projectPath)" /p:VisualStudioVersion=16.0 /p:DeployOnBuild=true /p:Configuration=Debug /p:PublishProfile=Properties/PublishProfiles/Production.pubxml /p:Password=$env:PRODUCTION_PASS
