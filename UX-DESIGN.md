# Biduloshop — UX design

> Du merch décalé, avec l'exécution d'un e-commerce professionnel.

**Principe directeur : l'humour est dans les produits, pas dans le parcours.**
La personnalité passe par le catalogue, les couleurs, les formes et quelques
micro-interactions. La navigation, les prix, le panier et le paiement suivent
les conventions e-commerce pour inspirer confiance et convertir.

| On s'autorise | On s'interdit |
|---|---|
| Des noms et descriptions de produits drôles | Des blagues dans les libellés de boutons, de prix ou de paiement |
| Une palette vive, des formes arrondies, des ombres « cartoon » | Des animations permanentes qui distraient de la lecture |
| Un clin d'œil dans les états vides et les confirmations | Des sons, du plein écran, des effets déclenchés sans action de l'utilisateur |
| Un filtre signature (« niveau de fantaisie ») | Des filtres ou des mentions dont le sens n'est pas immédiatement clair |

## 1. Cibles

| Persona | Besoin | Réponse |
|---|---|---|
| **Léa, 29 ans, cherche un cadeau original** | Trouver vite une idée entre 5 et 30 € | Catégories, tri par prix, bouton « Idée cadeau au hasard » |
| **Julien, office manager** | Commander des goodies pour l'équipe, rassuré sur les délais | Bandeau de réassurance, lien « Commandes entreprises », frais de port clairs |
| **Monique, 68 ans, achète pour ses petits-enfants** | Un parcours simple et lisible | Gros boutons, contrastes forts, parcours linéaire, aucun piège |

## 2. Parcours principal

```
Accueil ──► Boutique (catégorie · fantaisie · tri) ──► Ajouter ──► Panier (tiroir) ──► Paiement
   │                     ▲                               │
   └─ Idée cadeau au hasard ┘                            └─ toast « Ajouté » + lien « Voir le panier »
```

- **Accès direct à la boutique** depuis le CTA principal, et un lien d'évitement pour la navigation au clavier.
- **Ajout sans rupture** : un toast confirme le produit et son prix, avec un raccourci vers le panier. Le panier ne s'ouvre pas de force.
- **Panier en tiroir** : quantité, suppression, code promo, frais de port et total TTC toujours visibles. Il se ferme avec ✕, Échap ou un clic sur le fond.
- **Seuil de livraison offerte (50 €)** annoncé dans le bandeau, puis suivi par une barre de progression dans le panier.

## 3. Composants

| Composant | Rôle | Touche de marque |
|---|---|---|
| Bandeau de réassurance | Délais, retours, paiement, emballage cadeau | Icônes emoji sobres |
| Chips de catégorie | Filtre principal (`aria-pressed`) | Style « pilule » à contour |
| Niveau de fantaisie (1 → 5) | Filtre signature, de « Subtil » à « Totalement décalé » | Dégradé aux couleurs de la marque |
| Tri | Popularité, prix, note | — |
| Carte produit | Catégorie, nom, bénéfice, note, prix, CTA | Fond coloré, badge, léger rebond au survol |
| État vide | Explique le problème et propose de réinitialiser | « Même nous, on n'a pas encore osé le fabriquer » |
| Toast d'ajout | Confirmation et raccourci vers le panier | Emoji du produit |
| Panier | Récapitulatif transparent, sans frais cachés | Canard dans l'état vide |

## 4. Design system

- **Couleurs** : fond crème `#fffaf0`, encre `#1b1036` et encre secondaire `#4a4166`. Le CTA utilise `#c9327a` (contraste AA avec du texte blanc). Accents : banane `#ffd23f`, bubblegum `#ff5fa2`, slime `#3ddc84`, ciel `#5bc0ff`, raisin `#6b3fe0`.
- **Typographie** : *Bagel Fat One* uniquement pour le logo et les titres de section ; *Nunito* 500/700/800 pour tout le reste, prix compris, pour la lisibilité.
- **Formes** : contours de 2 px et ombres dures de 4 px sur les éléments cliquables. Les éléments informatifs (réassurance, avis, filtres) ont des bordures fines, pour que la hiérarchie se lise d'un coup d'œil.
- **Mouvement** : transitions courtes (150 à 350 ms) déclenchées par une action. Seules deux animations tournent en continu, lentes et discrètes, dans les visuels décoratifs.

## 5. Accessibilité et confiance

- HTML sémantique, focus visible, panier en `role="dialog"` avec piège à focus et retour du focus à la fermeture.
- `aria-live` pour le nombre de résultats et les toasts. Les notes et les prix barrés ont un équivalent texte pour les lecteurs d'écran.
- Toutes les animations sont coupées sous `prefers-reduced-motion`.
- Pas de dark patterns : pas de faux compte à rebours, pas de fausse rareté, frais de port affichés avant le paiement, consentement newsletter explicite.
- Responsive : grilles fluides, hero et best-seller sur une colonne sous 860 px, filtres empilés et CTA pleine largeur sous 520 px.

## 6. Contenus de démonstration

Les produits, prix, avis, délais et moyens de paiement sont des **contenus fictifs** à remplacer par les vraies données avant la mise en ligne.

## 7. Pistes suivantes

- Fiche produit : galerie, choix de taille, démo sonore des Chaussettes Klaxon.
- Recherche avec suggestions.
- Tunnel de paiement (Stripe) : formulaires sobres, récapitulatif persistant.
- Quiz « Quel cadeau décalé pour qui ? » comme outil de recommandation.

## Lancer le site

Site statique sans build : ouvrez `index.html` ou lancez `python3 -m http.server`.
