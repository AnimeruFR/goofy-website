# BIDULOSHOP™ — UX design

> Le merch le plus goofy d'internet… avec une UX sérieuse en dessous.

Principe directeur : **le ton est absurde, le parcours d'achat ne l'est jamais.**
La bêtise vit dans le contenu, les micro-interactions et les easter eggs.
Chercher, comprendre un prix, ajouter au panier et payer restent des gestes
standards et prévisibles.

## 1. Cibles

| Persona | Besoin | Ce que le site lui apporte |
|---|---|---|
| **Léa, 24 ans, cherche un cadeau débile** | Trouver vite un truc drôle entre 5 et 25 € | Goof-o-mètre, catégories, bouton « Surprends-moi » |
| **Kévin, 31 ans, collectionneur d'absurde** | Voir les nouveautés, se sentir dans le délire | Stickers « Nouveau », avis absurdes, Club des Canards |
| **Mamie Josette, 87 ans, achète pour ses petits-enfants** | Ne pas se perdre | Gros boutons, contrastes forts, parcours linéaire, pas de piège |

## 2. Parcours principal

```
Hero ──► Boutique (filtres) ──► + Panier ──► Drawer panier ──► Commande
  │            ▲                    │
  └─ 🎲 Surprends-moi ─┘            └─ toast + confettis + klaxon (feedback)
```

- **Accès à la boutique en 1 clic** depuis le hero (CTA principal) et un lien d'évitement pour le clavier.
- **Ajout au panier sans changement de page** : feedback triple (toast, compteur qui « klaxonne », confettis) sans ouvrir le panier de force.
- **Panier en tiroir latéral** : on garde le contexte de la boutique, on ferme avec ✕, Échap ou clic sur le fond.
- **Barre de progression livraison offerte** (seuil à 42 €) : incite à ajouter un article, de manière honnête.

## 3. Composants signature

| Composant | Rôle UX | Touche goofy |
|---|---|---|
| **Goof-o-mètre** (slider 1→5) | Filtre principal, remplace un filtre « style » | Niveaux 😐 → 🥴, libellés (« Débile assumé ») |
| **Chips de catégorie** | Filtre secondaire, état `aria-pressed` | Emojis |
| **Carte produit** | Nom, promesse, prix, note, CTA toujours visible | Note en 🦆, badge penché, tilt au survol |
| **État vide** | Explique et propose de réinitialiser | « Même nous, on n'a pas osé fabriquer ça » 🦗 |
| **Code promo** | Messages d'erreur utiles | Indice 🍌, `BANANE` = -10 % |
| **Mode chaos** | Optionnel, désactivé par défaut | Cartes penchées, traînée d'emojis, curseur banane |
| **Easter egg** | Récompense les curieux | Konami code = site à l'envers |

## 4. Design system

**Couleurs** — fond crème `#fff8e7`, encre `#1b1036` (contours + texte, contraste AAA).
Accents : banane `#ffd23f`, bubblegum `#ff5fa2`, slime `#3ddc84`, ciel `#5bc0ff`, raisin `#8a5cff`, tomate `#ff6b3d`.

**Typo** — *Bagel Fat One* pour les titres (rond, gras, rigolo), *Nunito* 500/700/900 pour le texte.

**Formes** — contours 3 px partout, ombres portées dures (`6px 6px 0`, style néo-brutaliste cartoon), rayons généreux, formes « blob » qui ondulent.

**Mouvement** — courbe à rebond `cubic-bezier(.34,1.8,.64,1)` sur tous les états. Boutons : se soulèvent et penchent au survol, s'écrasent au clic.

## 5. Garde-fous (goofy ≠ pénible)

- **`prefers-reduced-motion`** : toutes les animations sont coupées, pas de confettis ni de traînée.
- **Son** : klaxon uniquement après une action de l'utilisateur, très bref et à faible volume.
- **Accessibilité** : HTML sémantique, focus visible (pointillé violet), `aria-live` pour le compteur et les toasts, piège à focus dans le panier, emojis décoratifs en `aria-hidden` avec texte alternatif (« 4 canards sur 5 »).
- **Pas de dark patterns** : pas de faux compte à rebours, pas de fausse rareté, prix barrés affichés clairement, blagues jamais placées dans le CTA de paiement.
- **Responsive** : grille auto-fill, hero sur une colonne sous 900 px, header compacté en icônes sous 520 px.

## 6. Pistes suivantes

- Fiche produit avec « démo » sonore (écouter la Chaussette-Klaxon).
- Configurateur « Crée ta propre bêtise ».
- Quiz « Quel objet inutile es-tu ? » pour recommander un produit.
- Tunnel de paiement réel (Stripe) avec le même ton, mais formulaires sobres.

## Lancer le site

Site statique, sans build : ouvrir `index.html` ou lancer `python3 -m http.server`.
