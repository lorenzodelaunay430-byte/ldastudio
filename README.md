# LDA Site — version HTML, CSS et JavaScript

Site indépendant, utilisable sans installation ni compilation. Le dossier contient le design LDA Site, les animations au défilement, les trois offres, la présentation de Lorenzo, une FAQ et le contact.

## Voir le site sur ton PC

Ouvre `index.html` dans ton navigateur. Garde `styles.css`, `app.js` et le dossier `assets` à côté. Les chemins sont relatifs : le site fonctionne aussi dans un sous-dossier GitHub Pages.

## Mettre en ligne avec GitHub Pages

1. Crée un dépôt GitHub, par exemple `lda-site`. Avec GitHub Free, utilise un dépôt public pour GitHub Pages.
2. Décompresse le ZIP. Charge **le contenu du dossier**, avec `index.html` directement à la racine du dépôt. Ne charge pas le ZIP lui-même.
3. Conserve les images dans le dossier `assets` : tu peux glisser le dossier avec les autres fichiers dans l'écran d'ajout de fichiers GitHub.
4. Enregistre les fichiers sur la branche `main`.
5. Ouvre **Settings → Pages** dans le dépôt.
6. Dans **Source**, choisis **Deploy from a branch**, puis **main** et **/(root)**. Clique sur **Save**.
7. GitHub affiche l'adresse du site dans ce même écran une fois le déploiement terminé.

[Instructions officielles GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

Le fichier `.nojekyll` évite le traitement du site comme un projet Jekyll. Aucun framework, abonnement Squarespace de création de site ou commande de compilation n'est nécessaire pour ces fichiers.

## Connecter ldasite.com

Le domaine peut rester enregistré chez Squarespace et pointer vers GitHub Pages. Sa connexion actuelle pointe vers le site Squarespace : elle n'a pas été modifiée lors de la préparation de ces fichiers.

Commence par mettre le site en ligne à l'adresse GitHub Pages. Ensuite, configure `ldasite.com` dans **Settings → Pages → Custom domain**, puis ajuste les enregistrements du domaine selon les instructions de GitHub. Les réglages exacts dépendent de ton compte GitHub. Conserve les enregistrements Google Workspace nécessaires à `ldacontact@ldasite.com`.

[Instructions officielles pour un domaine personnalisé](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

## Contact : fonctionnement réel

Le formulaire prépare un message localement. Il affiche un aperçu et un bouton pour ouvrir la messagerie du visiteur avec l'adresse `ldacontact@ldasite.com`, l'objet et le texte préremplis. Le visiteur doit envoyer le message dans sa messagerie. Le bouton **Copier le message** permet de le récupérer si nécessaire.

Le site n'a pas de serveur de traitement des formulaires. Il n'enregistre pas les demandes et ne les envoie pas automatiquement. Un envoi direct depuis le site nécessiterait un service de formulaires ou un serveur supplémentaire.

## Modifier le contenu

- `index.html` : textes, prix, contenu des offres, e-mail et téléphone.
- `styles.css` : couleurs, mise en page, adaptation mobile et animations.
- `app.js` : menu, animations au défilement, préparation des e-mails, informations légales et confidentialité.
- `assets/` : logo, monogramme et icône du navigateur.

Les informations administratives de l'activité et le traitement de la TVA restent à finaliser avant le lancement commercial. Les textes du site ne prétendent pas que cette étape est terminée.

## Vérifications effectuées

Affichage ordinateur et téléphone, chargement des images, absence de débordement sur mobile, ouverture et fermeture du menu, sélection d'une offre, préparation et aperçu d'une demande, lien e-mail prérempli, fenêtre d'informations et réduction des animations. Aucun e-mail de test n'a été envoyé.

Le dépôt GitHub et le déploiement GitHub Pages restent à créer par toi : ce dossier livre les fichiers prêts à charger.
