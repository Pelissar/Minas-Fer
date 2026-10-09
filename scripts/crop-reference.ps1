Add-Type -AssemblyName System.Drawing

$sourcePath = 'C:\Users\DANIELA\AppData\Local\Temp\codex-clipboard-bc34b22c-f163-443f-b219-350ed6c8be83.png'
$outputPath = Join-Path (Get-Location) 'public\reference'

if (-not (Test-Path -LiteralPath $sourcePath)) {
  throw "Imagem de referência não encontrada: $sourcePath"
}

New-Item -ItemType Directory -Path $outputPath -Force | Out-Null
$source = [System.Drawing.Bitmap]::new($sourcePath)

function Export-Crop {
  param(
    [string]$Name,
    [int]$X,
    [int]$Y,
    [int]$Width,
    [int]$Height
  )

  $crop = $source.Clone(
    [System.Drawing.Rectangle]::new($X, $Y, $Width, $Height),
    [System.Drawing.Imaging.PixelFormat]::Format24bppRgb
  )
  try {
    $crop.Save((Join-Path $outputPath $Name), [System.Drawing.Imaging.ImageFormat]::Png)
  } finally {
    $crop.Dispose()
  }
}

# Imagens sem os textos da interface para que os componentes continuem renderizando os próprios labels.
Export-Crop 'hero-metals.png' 500 80 524 267
Export-Crop 'category-profiles.png' 387 447 143 74
Export-Crop 'category-sheets.png' 539 447 142 74
Export-Crop 'category-tubes.png' 692 447 140 74
Export-Crop 'category-accessories.png' 843 447 131 74
Export-Crop 'category-tools.png' 387 552 143 73
Export-Crop 'category-abrasives.png' 540 552 140 73
Export-Crop 'category-epi.png' 692 552 140 73
Export-Crop 'category-more.png' 843 552 131 73
Export-Crop 'featured-square.png' 56 746 173 88
Export-Crop 'featured-rebar.png' 243 746 172 88
Export-Crop 'featured-sheet.png' 427 746 171 88
Export-Crop 'featured-disc.png' 610 746 173 88
Export-Crop 'featured-welder.png' 797 746 171 88
Export-Crop 'rental-machines.png' 0 947 400 187
Export-Crop 'equipment-excavator.png' 0 947 170 187
Export-Crop 'equipment-mixer.png' 155 947 145 187
Export-Crop 'equipment-generator.png' 280 947 120 187
Export-Crop 'about-store.png' 418 1152 302 189
Export-Crop 'cta-metal.png' 0 1358 1024 65

$source.Dispose()
