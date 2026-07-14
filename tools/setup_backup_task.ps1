# ============================================================
# Set up daily Windows Scheduled Task to back up Vocab World (round 212)
# Run:     powershell -ExecutionPolicy Bypass -File tools\setup_backup_task.ps1
# Remove:  schtasks /delete /tn "VocabWorldBackup" /f
# Change time: edit $time below, then re-run (uses -Force to overwrite)
# Note: task runs only while THIS user is logged on (uses the firebase login
#       stored in the user profile). If the PC is off at the scheduled time,
#       StartWhenAvailable runs it as soon as the PC is next turned on.
# (ASCII-only on purpose: Windows PowerShell 5.1 mangles UTF-8 Thai without BOM.)
# ============================================================
$ErrorActionPreference = 'Stop'
$bash     = 'C:\Program Files\Git\bin\bash.exe'
$script   = 'C:\Users\rober\english-pet-game\tools\backup_daily.sh'
$taskName = 'VocabWorldBackup'
$time     = '7:00PM'          # daily backup time

$action   = New-ScheduledTaskAction -Execute $bash -Argument "`"$script`""
$trigger  = New-ScheduledTaskTrigger -Daily -At $time
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Minutes 15) -MultipleInstances IgnoreNew
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings `
  -Description 'Back up Vocab World Realtime Database + Auth users to this PC daily (in case server data is deleted).' -Force | Out-Null
Write-Output "OK: registered task '$taskName' daily at $time"
