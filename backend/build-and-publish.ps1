$solutionPath = "UmbracoJAM.sln"
$msBuildExe = "C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\MSBuild\Current\Bin\msbuild.exe" 
$clean = $true
$nuGet = $true

 if ($nuGet) {
     Write-Host "Restoring NuGet packages" -foregroundcolor green
     nuget restore "$($solutionPath)"
 }

 if ($clean) {
     Write-Host "Cleaning $($solutionPath)" -foregroundcolor green
     & "$($msBuildExe)" "$($solutionPath)" /t:Clean /m
 }

Write-Host "Building $($solutionPath)" -foregroundcolor green
& "$($msBuildExe)" "$($solutionPath)" /t:Build /m

Write-Host "Publishing $($solutionPath)" -foregroundcolor green
& "$($msBuildExe)" "src\Project\UmbracoJAM\code\UmbracoJAM.Project.Web.csproj" /p:VisualStudioVersion=16.0 /p:DeployOnBuild=true /p:Configuration=Debug /p:PublishProfile=Properties\PublishProfiles\Production.pubxml
