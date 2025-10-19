# 📚 GUIDES COMPLETS - Utilisateur, Admin, Développeur

Tous les guides d'utilisation consolidés.

---

## 👤 GUIDE UTILISATEUR

### 🚀 Démarrage Rapide

**3 étapes pour planifier votre jardin** :

1. **Sélectionner arbres** : Comparer → Cocher 2-3 arbres
2. **Ouvrir planificateur** : Bouton "Planifier"  
3. **Créer le plan** : Drag & drop sur le terrain

### 📐 Utilisation du Planificateur

#### Interface

```
┌─────────────────────────────────────────┐
│  [2D] [3D]  📐 Planificateur      [❓][✕]│
├──────────┬──────────────────────────────┤
│ Panneau  │                              │
│ Latéral  │      Canvas 2D/3D            │
│          │                              │
│ [Outils] │                              │
│ [Stats]  │                              │
└──────────┴──────────────────────────────┘
│     Timeline (0-20 ans)                 │
└─────────────────────────────────────────┘
```

#### Onglet "Outils"

**Structures** :
- 🏠 Maison (10×10m, H:7m, Fondations:1.2m)
- 🏡 Terrasse (4×3m)
- 🟩 Pavés (5×5m)

**Réseaux** :
- 🚰 Canalisation (prof. 0.6m)
- 💧 Citerne/Fosse (2×3m, prof. 2.5m)
- 🚧 Clôture

**Végétation** :
- 🌳 Arbre existant

**Affichage** :
- 👁️ Zones contraintes (ON/OFF)
- ☀️ Ombre maison (ON/OFF)
- 🧲 Snap magnétique (ON/OFF)

**Actions** :
- 🔒 Verrouiller sélection
- 🗑️ Supprimer sélection
- ⚠️ Effacer tout

**Image** :
- 📷 Charger plan fond
- Opacité ajustable
- 🗑️ Retirer image

#### Onglet "Stats"

Statistiques temps réel :
- 🌳 Nombre arbres
- 📏 Surfaces (plantée/minérale/libre)
- 🦋 Biodiversité (score 0-100)
- 💧 Arrosage (L/semaine)
- ⏱️ Entretien (h/mois)
- ⚖️ Conformité (%)
- 🌍 Composition sol (éditable)

#### Timeline (Bas)

- **Slider 0-20 ans** : Voir croissance
- **Saison** (si ombre active) : Hiver/Printemps/Été/Automne
- Affiche la taille actuelle des arbres

#### Validation Temps Réel

**Couleurs arbres** :
- 🟢 **Vert** : Conforme (tout OK)
- 🟠 **Orange** : Avertissement (attention)
- 🔴 **Rouge** : Problème (non-conforme)

**Clic sur arbre** → Panneau validation :
- 📊 Informations (taille, tronc, âge, racines)
- ✅/⚠️/❌ Messages validation
- 💡 Conseils si problème

### 🎮 Vue 3D

**Activer** : Cliquer bouton "3D" en haut

**4 Modes de Vue** :
- 🎮 **Perspective** : Vue libre 3D
- 🔝 **Dessus** : Plan de haut
- 👉 **Côté** : Voir hauteurs
- 📐 **Coupe** : Voir profondeurs

**Édition Interactive** :
- Clic sur objet → Panneau édition à droite
- Modifier hauteur maison, profondeur fondations, etc.
- Toggle "Sous-terre" : Voir/cacher racines, fondations, canalisations

**Validation 3D** :
- Couleurs : Vert (OK), Orange (attention), Rouge (conflit)
- Voir les racines qui touchent les fondations !

### 🖱️ Navigation Canvas (🆕 v2.1.1)

**Zoom** :
- 🖱️ **Molette** : Zoomer/Dézoomer (50%-300%)
- 🔍 **Bouton "Réinitialiser vue"** : Retour à 100%

**Déplacement (Pan)** :
- `Alt` + Clic gauche : Déplacer la carte
- Clic droit : Déplacer la carte
- Clic molette : Déplacer la carte

### ⌨️ Raccourcis Clavier

| Touche | Action |
|--------|--------|
| `Suppr` / `Backspace` | Supprimer sélection |
| `Ctrl+D` | Dupliquer |
| `Flèches` | Déplacer 10cm |
| `Shift+Flèches` | Déplacer 1m |
| `Échap` | Désélectionner |
| **`Molette`** 🆕 | **Zoom in/out** |
| **`Alt+Clic`** 🆕 | **Déplacer carte** |
| **`Clic droit`** 🆕 | **Déplacer carte** |

### 💾 Sauvegarde

- **Automatique** : Toutes les modifications sauvegardées dans le navigateur
- **Export** : Plan sauvegardé dans localStorage
- **Persistance** : Plan rechargé automatiquement

---

## 👨‍💼 GUIDE ADMIN

### 🚀 Démarrage

```bash
cd admin
npm install
npm start
# Ouvrir http://localhost:3001
```

### 📸 Gestion Images

#### Ajouter une Image

1. **Glisser-déposer** image dans zone
2. **Sélectionner** :
   - Espèce (liste déroulante)
   - Type (vue_generale, bourgeons, fleurs, etc.)
3. **Cliquer** 🚀 Ajouter
4. ✅ Image uploadée avec numéro automatique

#### Supprimer des Images

1. **Filtrer** par espèce/type
2. **Cocher** images à supprimer
3. **Cliquer** 🗑️ dans header
4. **Confirmer** suppression

#### Renommer une Image

1. **Modifier** select Espèce ou Type
2. **Cliquer** 💾 (devient orange)
3. ✅ Image renommée et déplacée

#### Changer Numéro

1. **Input numéro** → Taper nouveau
2. **Confirmer** permutation
3. ✅ Swap automatique (#03 ↔ #01)

### 🔄 Synchronisation

- **Automatique** : `images.json` regénéré après chaque action
- **Client** : Rafraîchir pour voir nouvelles images

### 🔐 Sécurité

⚠️ **Interface locale uniquement** (pas d'authentification)  
⚠️ **Ne pas exposer sur Internet** sans sécurisation

---

## 👨‍💻 GUIDE DÉVELOPPEUR

### 🌳 Ajouter un Nouvel Arbre

**Fichier** : `client/src/data/arbustesData.js`

#### Étape 1 : Copier un Modèle

| Pour ajouter... | Copier... |
|----------------|-----------|
| Cerisier | `prunus-kanzan` |
| Arbre méditerranéen | `arbre-judee` |
| Grand arbre | `erable-rouge` |
| Arbuste haie | `troene` |
| Arbuste parfumé | `osmanthe` |
| Arbuste toxique | `fusain` |
| Arbuste fruitier | `noisetier` |

#### Étape 2 : Remplir TOUTES les Sections

**✅ Obligatoires** :
```javascript
{
  id: 'nom-arbre',              // URL-friendly
  name: 'Nom Commun',
  nomScientifique: 'Genus species',
  famille: 'Famille',
  type: 'arbre' | 'arbuste',
  tailleMaturite: 'X-Y m',
  envergure: 'X-Y m',
  floraison: { periode, description, couleur },
  fructification: { ... },
  feuillage: { ... },
  plantation: { ... },
  sol: { type, ph, humidite },
  exposition: '...',
  arrosage: '...',
  rusticite: 'Zone X',
  croissance: 'Rapide/Moyenne/Lente (X cm/an)',
  taille: { ... },
  calendrierAnnuel: [...],
  maladies: [...],
  biodiversite: { ... },
  utilisations: [...],
  anecdote: '...',
  
  // RÉGLEMENTATION (CRITIQUE pour validation)
  reglementation: {
    systemeRacinaire: {
      type: 'pivotant' | 'fasciculé' | 'traçant',
      profondeur: 'X-Y m',
      etalement: 'X-Y m',
      agressivite: 'Faible' | 'Modérée' | 'Élevée'
    },
    distancesLegales: {
      voisinage: {
        distance: 'Xm',
        regle: 'Code Civil Art. 671',
        sanction: '...'
      },
      infrastructures: {
        fondations: 'Xm',
        canalisations: 'Xm',
        fossesSeptiques: 'Xm',
        terrasse: 'Xm',
        piscine: 'Xm'
      },
      entreArbres: {
        distance: 'Xm',
        raison: '...'
      }
    },
    risques: [...]
  }
}
```

#### Étape 3 : Ajouter les Images

**Nommage** : `espece_type_numero.jpg`

Exemples :
- `prunus-kanzan_vue_generale_01.jpg`
- `prunus-kanzan_fleurs_01.jpg`
- `prunus-kanzan_fruits_01.jpg`

**Via Admin** :
1. `npm run admin`
2. Upload images
3. Sélectionner espèce/type
4. `images.json` mis à jour automatiquement

### 🚀 Déploiement

**Build Production** :
```bash
cd client
npm run build
# → Fichiers dans client/dist/
```

**Déployer sur Render** :
1. Push code sur GitHub
2. Render auto-déploie depuis `main`
3. Build command : `cd client && npm install && npm run build`
4. Publish directory : `client/dist`

**Variables d'environnement** : Aucune requise

---

## 📞 CONTACT

**Mairie de Bessancourt** : 01 30 40 44 47

---

**Version** : 2.1.0  
**Dernière mise à jour** : 19 octobre 2025

