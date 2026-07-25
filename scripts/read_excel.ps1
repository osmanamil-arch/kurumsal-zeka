$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
$wb = $excel.Workbooks.Open("C:\Users\User\.gemini\antigravity\scratch\kobi-panel\SELEC.xlsx")

foreach ($ws in $wb.Worksheets) {
    Write-Host "=== SHEET: $($ws.Name) ==="
    $usedRange = $ws.UsedRange
    $rows = $usedRange.Rows.Count
    $cols = $usedRange.Columns.Count
    Write-Host "Rows: $rows  Cols: $cols"
    
    for ($r = 1; $r -le [Math]::Min($rows, 60); $r++) {
        $line = ""
        for ($c = 1; $c -le [Math]::Min($cols, 20); $c++) {
            $val = $usedRange.Cells.Item($r, $c).Text
            $line += $val + "`t"
        }
        Write-Host $line
    }
}

$wb.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
