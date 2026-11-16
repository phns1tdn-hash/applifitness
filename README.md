# Carnet de muscu

Application web installable (PWA) pour suivre ses séances de musculation :

- les exercices de chaque séance, avec le poids et les répétitions de chaque série ;
- un récap des muscles les plus travaillés **pendant la séance** (séries, tonnage ou répétitions) ;
- un onglet **Corps** : un **écorché** (vue de face et de dos, sans peau) dont chaque muscle est coloré selon le travail fait pendant la **semaine** (lundi → dimanche, avec les flèches pour revoir les semaines passées) : gris = pas touché, vert citron = très sollicité. Touche un muscle pour voir son nom et sa valeur ; la liste en dessous montre aussi les muscles pas encore travaillés. Le même écorché existe pour chaque séance (onglet « Muscles » d'une séance) ;
- des **molettes** à rouler pour choisir le poids (kg + décimales 0 / 0,25 / 0,5 / 0,75) et les répétitions, au lieu de taper au clavier ;
- 78 exercices, dont 26 à la machine (dos en tête), avec un schéma Départ → Arrivée dessiné pour chacun ;
- des filtres « Machines » et « Basic-Fit », et la possibilité d'ajouter ses propres photos ;
- l'historique, les records et la progression par exercice ;
- tout fonctionne **sans connexion** et les données restent **sur ton téléphone**.

## Installer sur iPhone

1. Ouvre l'adresse de l'appli dans **Safari** (voir « Mettre en ligne » plus bas).
2. Touche **Partager** (le carré avec une flèche), puis **Sur l'écran d'accueil**, puis **Ajouter**.
3. Ouvre l'appli depuis l'icône qui vient d'apparaître.

> Installe l'appli **avant** de t'en servir. Sur iPhone, les données de Safari et celles de l'appli installée sont séparées : ce que tu saisis dans Safari ne se retrouve pas dans l'icône. Si c'est arrivé, exporte depuis Safari puis importe dans l'appli installée (voir ci-dessous).

Sur Android, Chrome propose un bouton **Installer** dans l'appli (ou dans le menu ⋮ › « Ajouter à l'écran d'accueil »).

## Tes données

Tout est enregistré dans le navigateur de ton téléphone : les séances et exercices perso dans `localStorage`, les photos dans `IndexedDB`. Rien n'est envoyé sur internet.

Les données disparaissent si tu supprimes l'appli, si tu effaces les données du site ou si tu perds le téléphone. Pour t'en protéger :

- **Exercices › Sauvegarde › Exporter mes données** crée un fichier `carnet-muscu-AAAA-MM-JJ.json` (séances, exercices perso et photos). Sur iPhone, choisis « Enregistrer dans Fichiers » ou envoie-le par e-mail.
- **Importer un fichier** remet tout en place, par exemple sur un nouveau téléphone. L'import fusionne : il n'efface rien.
- **Importer depuis du texte copié** accepte aussi le texte copié depuis l'ancienne version de l'appli.
- L'appli te rappelle de sauvegarder quand ta dernière sauvegarde a plus de 3 semaines.

## Mettre en ligne (GitHub Pages)

L'appli est faite de fichiers statiques : il suffit de les publier.

1. Le dépôt doit être **public** (GitHub Pages gratuit ne publie pas les dépôts privés). Il ne contient aucun secret.
2. Sur github.com : **Settings › Pages › Build and deployment › Source : Deploy from a branch**, branche **main**, dossier **/ (root)**, puis **Save**.
3. Après une ou deux minutes, l'appli est disponible à l'adresse `https://phns1tdn-hash.github.io/applifitness/`.

Le fichier `.nojekyll` indique à GitHub de publier les fichiers tels quels.

## Contenu du dépôt

| Fichier | Rôle |
| --- | --- |
| `index.html` | Page de l'appli |
| `app.js` | Logique : séances, récap, historique, sauvegarde |
| `illus.js` | Schémas des exercices (bonhomme dessiné par code, cinématique inverse) |
| `body.js` | Écorché de face et de dos (SVG dessiné à la main), couleurs selon le travail des muscles (séance et semaine) |
| `styles.css` | Thème sombre « Salle » (noir et vert citron), molettes, écorché |
| `manifest.webmanifest` | Nom, icônes et affichage plein écran de l'appli installée |
| `sw.js` | Service worker : mise en cache pour le mode hors ligne |
| `icons/` | Icônes de l'appli |
| `fonts/` | Polices Space Grotesk (titres) et Inter (texte, sous-ensemble latin), avec leurs licences |

## Développer

Aucune dépendance, aucune étape de build. Pour essayer en local :

```sh
python3 -m http.server 8000
```

puis ouvre `http://localhost:8000`. Le service worker fonctionne sur `localhost` et sur HTTPS.

**Publier une nouvelle version :** modifie les fichiers, puis change `VERSION` en tête de `sw.js` (par exemple `v3`). L'ancien cache est supprimé à l'activation. Sans ça, les pages et scripts sont de toute façon rechargés depuis le réseau dès que le téléphone est en ligne ; la version sert surtout à nettoyer l'ancien cache.

**Ajouter un exercice :** une ligne dans la liste `BASE` de `app.js` (`id|nom|muscles principaux|muscles secondaires|type|1`), où `type` vaut `m` (machine), `p` (poulie) ou vide (poids libres), et `1` marque une machine citée par les guides officiels de Basic-Fit. Pour son schéma, ajoute l'`id` dans la table `MAP` de `illus.js`.

## Limites connues

- Les machines marquées « Basic-Fit » sont celles que citent les guides officiels de Basic-Fit. Les autres sont des modèles courants (Matrix, Technogym) : ce que ta salle possède vraiment varie d'un club à l'autre.
- Les schémas et l'écorché sont stylisés et indicatifs, pas une démonstration de la bonne technique ni un atlas d'anatomie. La coloration compte 1 point par série validée pour les muscles principaux et ½ pour les secondaires.
- Les données ne se synchronisent pas entre appareils : passe par l'export et l'import.
- L'appli a été testée dans Chrome (navigateur de bureau simulant un iPhone), en mode hors ligne et en clair/sombre. Elle n'a pas été essayée sur un vrai iPhone.

## Licence des polices

Les polices [Inter](https://github.com/rsms/inter) et [Space Grotesk](https://github.com/floriankarsten/space-grotesk) sont distribuées sous la SIL Open Font License 1.1 (voir `fonts/OFL.txt` et `fonts/OFL-SpaceGrotesk.txt`).
