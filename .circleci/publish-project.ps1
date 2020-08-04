$solutionPath = "backend/UmbracoJAM.sln"
$projectPath = "backend/src/Project/UmbracoJAM/code/UmbracoJAM.Project.Web.csproj"
$clean = $true
$nuGet = $true

 if ($nuGet) {
     Write-Host "Restoring NuGet packages" -foregroundcolor green
     nuget restore "$($solutionPath)"
 }

 if ($clean) {
     Write-Host "Cleaning $($solutionPath)" -foregroundcolor green
     & msbuild "$($solutionPath)" /t:Clean /m
 }

Write-Host "Building $($solutionPath)" -foregroundcolor green
& "$($msBuildExe)" "$($solutionPath)" /t:Build /m

Write-Host "Publishing $($solutionPath)" -foregroundcolor green
& msbuild "$($projectPath)" /p:VisualStudioVersion=16.0 /p:DeployOnBuild=true /p:Configuration=Debug /p:PublishProfile=Properties/PublishProfiles/Production.pubxml
