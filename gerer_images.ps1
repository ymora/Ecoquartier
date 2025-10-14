# Script PowerShell Unifié - Gestion Complète des Images
# Télécharge depuis JSON OU Copie OU Renomme selon situation

param(
    [switch]$Force,
    [switch]$Help
)

if ($Help) {
    Write-Host "`n🌸 GESTIONNAIRE D'IMAGES - Les Haies de Bessancourt`n" -ForegroundColor Green
    Write-Host "Ce script détecte automatiquement ce qu'il doit faire :`n"
    Write-Host "  1. Si images_urls.json a des URLs → Télécharge automatiquement"
    Write-Host "  2. Si images dans downloads/ bien nommées → Copie automatiquement"
    Write-Host "  3. Si images dans downloads/ mal nommées → Mode interactif`n"
    Write-Host "USAGE :"
    Write-Host "  .\gerer_images.ps1           # Mode automatique"
    Write-Host "  .\gerer_images.ps1 -Force    # Remplace images existantes`n"
    exit
}

Write-Host "`n🌸 GESTIONNAIRE D'IMAGES - Les Haies de Bessancourt`n" -ForegroundColor Green
Write-Host "=" * 70 -ForegroundColor Gray

$baseDir = "client\public\images"
$downloadsDir = "downloads"
$jsonFile = "images_urls.json"

# Mapping des plantes
$plantes = @{
    "prunus-kanzan" = @{
        nom = "Cerisier Kanzan"
        types = @("vue_generale", "fleurs", "bourgeons", "automne")
    }
    "prunus-accolade" = @{
        nom = "Cerisier Accolade"
        types = @("vue_generale", "fleurs", "bourgeons", "automne")
    }
    "prunus-sunset-boulevard" = @{
        nom = "Cerisier Sunset Boulevard"
        types = @("vue_generale", "fleurs", "bourgeons", "automne")
    }
    "noisetier" = @{
        nom = "Noisetier"
        types = @("fleurs", "bourgeons", "automne", "hiver")
    }
    "fusain" = @{
        nom = "Fusain"
        types = @("fleurs", "automne")
    }
    "troene" = @{
        nom = "Troène"
        types = @("fleurs", "automne")
    }
    "osmanthe" = @{
        nom = "Osmanthe"
        types = @("fleurs", "automne")
    }
    "cornouiller" = @{
        nom = "Cornouiller"
        types = @("fleurs", "fruits", "bourgeons", "automne")
    }
    "seringat" = @{
        nom = "Seringat"
        types = @("fleurs", "automne")
    }
}

$descriptions = @{
    "vue_generale" = "Vue générale de l'arbre/arbuste"
    "fleurs" = "Floraison / Fleurs en gros plan"
    "bourgeons" = "Bourgeons au printemps"
    "fruits" = "Fruits / Fructification"
    "automne" = "Couleurs automnales"
    "hiver" = "Aspect hivernal"
}

# ============================================================================
# PARTIE 1 : TÉLÉCHARGEMENT DEPUIS JSON
# ============================================================================

if (Test-Path $jsonFile) {
    Write-Host "`n📋 Fichier JSON détecté : $jsonFile" -ForegroundColor Cyan
    
    try {
        $config = Get-Content $jsonFile -Raw | ConvertFrom-Json
        $totalImages = $config.images.Count
        $imagesAvecURL = $config.images | Where-Object { -not [string]::IsNullOrWhiteSpace($_.url) }
        $imagesSansURL = $totalImages - $imagesAvecURL.Count
        
        Write-Host "   Total : $totalImages image(s)" -ForegroundColor White
        Write-Host "   Avec URL : $($imagesAvecURL.Count)" -ForegroundColor $(if ($imagesAvecURL.Count -gt 0) { "Green" } else { "Red" })
        Write-Host "   Sans URL : $imagesSansURL" -ForegroundColor $(if ($imagesSansURL -gt 0) { "Yellow" } else { "Green" })
        
        if ($imagesSansURL -gt 0) {
            Write-Host "`n   ⚠️  $imagesSansURL image(s) n'ont pas d'URL !" -ForegroundColor Yellow
            Write-Host "   💡 Lisez COMMENT_OBTENIR_URLS.md pour savoir comment les obtenir" -ForegroundColor Cyan
            Write-Host "   💡 OU utilisez ChatGPT pour générer les images automatiquement !`n" -ForegroundColor Cyan
        }
        
        if ($imagesAvecURL.Count -gt 0) {
            Write-Host "`n   ✅ $($imagesAvecURL.Count) image(s) prête(s) à télécharger`n" -ForegroundColor Green
            
            $choice = Read-Host "Télécharger ces images depuis les URLs ? (O/N)"
            
            if ($choice -eq 'O' -or $choice -eq 'o') {
                $downloadedFromJSON = 0
                
                foreach ($img in $imagesAvecURL) {
                    $fileName = "$($img.plante)_$($img.type).jpg"
                    $targetDir = Join-Path $baseDir $img.plante
                    $targetPath = Join-Path $targetDir $fileName
                    
                    if (-not (Test-Path $targetDir)) {
                        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
                    }
                    
                    if ((Test-Path $targetPath) -and -not $Force) {
                        Write-Host "⏭️  $fileName - Existe déjà" -ForegroundColor Yellow
                        continue
                    }
                    
                    Write-Host "`n📥 $fileName..." -ForegroundColor Cyan
                    
                    try {
                        Invoke-WebRequest -Uri $img.url -OutFile $targetPath -ErrorAction Stop -TimeoutSec 30
                        $fileSize = [math]::Round((Get-Item $targetPath).Length / 1KB, 1)
                        Write-Host "   ✅ Téléchargé : $fileSize KB" -ForegroundColor Green
                        $downloadedFromJSON++
                    }
                    catch {
                        Write-Host "   ❌ Erreur : $($_.Exception.Message)" -ForegroundColor Red
                        if (Test-Path $targetPath) { Remove-Item $targetPath -Force }
                    }
                    
                    Start-Sleep -Milliseconds 500
                }
                
                Write-Host "`n✅ Téléchargement terminé : $downloadedFromJSON image(s)`n" -ForegroundColor Green
            }
        }
    }
    catch {
        Write-Host "   ⚠️  Erreur lecture JSON : $_" -ForegroundColor Yellow
    }
}

# ============================================================================
# PARTIE 2 : TRAITEMENT DES IMAGES DANS downloads/
# ============================================================================

if (Test-Path $downloadsDir) {
    $files = Get-ChildItem -Path $downloadsDir -Include *.jpg,*.jpeg,*.png -File
    
    if ($files.Count -gt 0) {
        Write-Host "`n📂 $($files.Count) image(s) trouvée(s) dans '$downloadsDir'`n" -ForegroundColor Cyan
        
        # Vérifier si images bien nommées
        $bienNommees = @()
        $malNommees = @()
        
        foreach ($file in $files) {
            if ($file.Name -match '^(prunus-kanzan|prunus-accolade|prunus-sunset-boulevard|noisetier|fusain|troene|osmanthe|cornouiller|seringat)_(vue_generale|fleurs|bourgeons|fruits|automne|hiver)\.(jpg|jpeg|png)$') {
                $bienNommees += $file
            } else {
                $malNommees += $file
            }
        }
        
        # ========== MODE 1 : Copie Automatique ==========
        if ($bienNommees.Count -gt 0) {
            Write-Host "✅ $($bienNommees.Count) image(s) correctement nommée(s)" -ForegroundColor Green
            Write-Host "`nCopier ces images automatiquement ? (O/N)" -ForegroundColor Cyan
            $choice = Read-Host
            
            if ($choice -eq 'O' -or $choice -eq 'o') {
                $copied = 0
                
                foreach ($img in $bienNommees) {
                    $plante = ($img.Name -split '_')[0]
                    $targetDir = Join-Path $baseDir $plante
                    
                    if (-not (Test-Path $targetDir)) {
                        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
                    }
                    
                    $targetPath = Join-Path $targetDir $img.Name
                    
                    try {
                        Copy-Item -Path $img.FullName -Destination $targetPath -Force
                        $fileSize = [math]::Round($img.Length / 1KB, 1)
                        $status = if ($img.Length -gt 500KB) { "⚠️ " } else { "✅" }
                        Write-Host "$status $($img.Name) ($fileSize KB)" -ForegroundColor $(if ($img.Length -gt 500KB) { "Yellow" } else { "Green" })
                        $copied++
                    }
                    catch {
                        Write-Host "❌ Erreur : $($img.Name)" -ForegroundColor Red
                    }
                }
                
                Write-Host "`n✅ $copied image(s) copiée(s)`n" -ForegroundColor Green
            }
        }
        
        # ========== MODE 2 : Renommage Interactif ==========
        if ($malNommees.Count -gt 0) {
            Write-Host "`n⚠️  $($malNommees.Count) image(s) avec nom incorrect" -ForegroundColor Yellow
            Write-Host "Lancer le renommage interactif ? (O/N)" -ForegroundColor Cyan
            $choice = Read-Host
            
            if ($choice -eq 'O' -or $choice -eq 'o') {
                foreach ($file in $malNommees) {
                    Write-Host "`n" + "-" * 70 -ForegroundColor Gray
                    Write-Host "📸 Image : $($file.Name)" -ForegroundColor Yellow
                    Write-Host "   Taille : $([math]::Round($file.Length / 1KB, 1)) KB"
                    
                    if ($file.Length -gt 500KB) {
                        Write-Host "   ⚠️  ATTENTION : > 500 KB → Compresser sur tinypng.com" -ForegroundColor Red
                    }
                    
                    Write-Host "`n   Cette image correspond à quelle plante ?`n"
                    
                    $i = 1
                    $plantesArray = @()
                    foreach ($key in $plantes.Keys | Sort-Object) {
                        Write-Host "   [$i] $($plantes[$key].nom) ($key)" -ForegroundColor Cyan
                        $plantesArray += $key
                        $i++
                    }
                    Write-Host "   [S] Sauter cette image"
                    Write-Host "   [Q] Quitter`n"
                    
                    $choixPlante = Read-Host "   Votre choix"
                    
                    if ($choixPlante -eq 'Q' -or $choixPlante -eq 'q') {
                        Write-Host "`n👋 Script interrompu.`n"
                        break
                    }
                    
                    if ($choixPlante -eq 'S' -or $choixPlante -eq 's') {
                        Write-Host "   ⏭️  Image sautée.`n"
                        continue
                    }
                    
                    $planteIndex = [int]$choixPlante - 1
                    if ($planteIndex -lt 0 -or $planteIndex -ge $plantesArray.Count) {
                        Write-Host "   ❌ Choix invalide. Image sautée.`n" -ForegroundColor Red
                        continue
                    }
                    
                    $planteKey = $plantesArray[$planteIndex]
                    $planteInfo = $plantes[$planteKey]
                    
                    Write-Host "`n   Cette image représente quel aspect ?`n"
                    
                    $j = 1
                    foreach ($type in $planteInfo.types) {
                        Write-Host "   [$j] $($descriptions[$type])" -ForegroundColor Cyan
                        $j++
                    }
                    Write-Host "   [S] Sauter`n"
                    
                    $choixType = Read-Host "   Votre choix"
                    
                    if ($choixType -eq 'S' -or $choixType -eq 's') {
                        Write-Host "   ⏭️  Image sautée.`n"
                        continue
                    }
                    
                    $typeIndex = [int]$choixType - 1
                    if ($typeIndex -lt 0 -or $typeIndex -ge $planteInfo.types.Count) {
                        Write-Host "   ❌ Choix invalide. Image sautée.`n" -ForegroundColor Red
                        continue
                    }
                    
                    $type = $planteInfo.types[$typeIndex]
                    $newFileName = "$planteKey`_$type.jpg"
                    $targetDir = Join-Path $baseDir $planteKey
                    $targetPath = Join-Path $targetDir $newFileName
                    
                    if (-not (Test-Path $targetDir)) {
                        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
                    }
                    
                    try {
                        Copy-Item -Path $file.FullName -Destination $targetPath -Force
                        Write-Host "`n   ✅ Image copiée et renommée :" -ForegroundColor Green
                        Write-Host "      $($file.Name) → $newFileName"
                        Write-Host "      Destination : $targetPath"
                    } catch {
                        Write-Host "`n   ❌ Erreur lors de la copie : $_" -ForegroundColor Red
                    }
                }
            }
        }
    } else {
        Write-Host "`n⚠️  Aucune image dans '$downloadsDir'" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n📁 Création du dossier '$downloadsDir'..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $downloadsDir | Out-Null
    Write-Host "   ✅ Dossier créé. Placez-y vos images téléchargées.`n" -ForegroundColor Green
}

# ============================================================================
# RÉSUMÉ ET INSTRUCTIONS
# ============================================================================

Write-Host "`n" + "=" * 70 -ForegroundColor Gray
Write-Host "`n🎯 PROCHAINES ÉTAPES :" -ForegroundColor Green
Write-Host ""
Write-Host "   1. Vérifier les images :"
Write-Host "      cd client"
Write-Host "      npm run check-images"
Write-Host ""
Write-Host "   2. Voir le résultat :"
Write-Host "      http://localhost:5173/"
Write-Host ""
Write-Host "💡 ASTUCE :" -ForegroundColor Yellow
Write-Host "   • Éditer images_urls.json et remplir URLs → Script télécharge auto"
Write-Host "   • Télécharger images + placer dans downloads/ → Script copie/renomme"
Write-Host "   • Utiliser -Force pour remplacer images existantes`n"

