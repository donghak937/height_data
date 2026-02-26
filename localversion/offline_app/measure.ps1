Add-Type -AssemblyName System.Drawing
$imgM = [System.Drawing.Image]::FromFile("public\male.png")
$bmpM = new-object System.Drawing.Bitmap($imgM)
$topM = $bmpM.Height; $botM = 0;
for ($y = 0; $y -lt $bmpM.Height; $y++) {
    for ($x = 0; $x -lt $bmpM.Width; $x++) {
        if ($bmpM.GetPixel($x, $y).A -gt 10) {
            if ($y -lt $topM) { $topM = $y }
            if ($y -gt $botM) { $botM = $y }
        }
    } 
} 
Write-Host "MALE: Top=$topM Bot=$botM Height=$($bmpM.Height)"

$imgF = [System.Drawing.Image]::FromFile("public\female.png")
$bmpF = new-object System.Drawing.Bitmap($imgF)
$topF = $bmpF.Height; $botF = 0;
for ($y = 0; $y -lt $bmpF.Height; $y++) {
    for ($x = 0; $x -lt $bmpF.Width; $x++) { 
        if ($bmpF.GetPixel($x, $y).A -gt 10) { 
            if ($y -lt $topF) { $topF = $y }
            if ($y -gt $botF) { $botF = $y }  
        }  
    }  
}  
Write-Host "FEMALE: Top=$topF Bot=$botF Height=$($bmpF.Height)"
    