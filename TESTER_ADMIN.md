# 🧪 Tester l'Interface Admin

## ⚠️ REDÉMARRER LE SERVEUR

Les corrections ont été faites. Vous devez redémarrer :

### **1. Arrêter le serveur actuel**
Dans le terminal où tourne `npm run admin` :
```
Ctrl + C
```

### **2. Relancer le serveur**
```bash
npm run admin
```

### **3. Rafraîchir la page**
```
http://localhost:3001
```

Appuyez sur **Ctrl + F5** (rafraîchissement forcé)

---

## 🧪 TESTS À FAIRE

### **Test 1 : Parcourir**
1. Ouvrir http://localhost:3001
2. **Cliquer** sur la zone de drop
3. Une fenêtre de sélection de fichiers doit s'ouvrir
4. Sélectionner une image JPG
5. L'image doit apparaître en bas

### **Test 2 : Glisser-déposer**
1. Ouvrir un dossier avec des images JPG
2. **Glisser** une image sur la zone de drop
3. La zone doit devenir verte pendant le survol
4. Relâcher
5. L'image doit apparaître en bas

### **Test 3 : Console** (Debug)
1. Appuyer sur **F12** (outils développeur)
2. Onglet **Console**
3. Essayer de glisser une image
4. Vous devez voir des logs :
   ```
   Files dropped: 1
   handleFiles called with: FileList
   Processing file: image.jpg image/jpeg
   addImageToList: image.jpg
   Image loaded, creating preview
   ```

---

## 🐛 SI ÇA NE MARCHE TOUJOURS PAS

### **Vérifier la console** (F12)
Chercher des erreurs en rouge

### **Erreurs possibles** :

**1. "Cannot read property 'addEventListener' of null"**
→ Élément DOM non trouvé
→ Vérifier que tous les IDs existent dans index.html

**2. "CORS error"**
→ Problème serveur
→ Vérifier que le serveur est bien sur localhost:3001

**3. Rien ne se passe**
→ JavaScript ne se charge pas
→ Vérifier la console pour erreurs de chargement

---

## 📋 CHECKLIST

- [ ] Serveur redémarré (Ctrl+C puis npm run admin)
- [ ] Page rafraîchie (Ctrl+F5)
- [ ] Console ouverte (F12)
- [ ] Test clic sur zone → Fichier s'ouvre
- [ ] Test glisser image → Image apparaît

---

**Si tout fonctionne, vous verrez les logs dans la console !** 🎉

