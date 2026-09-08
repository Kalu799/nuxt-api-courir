# Je cours pour ma forme — CMS et API

Cette application Nuxt 4 regroupe le CMS destiné aux administrateurs et l’API Nitro utilisée par le CMS et l’App User Vue/Vite.

```text
CMS Admin → API Nitro → MySQL ← API Nitro ← App User
```

## Démarrer le projet

```bash
npm install
npm run dev
```

Le CMS est disponible sur `http://localhost:3000`.

```bash
npm test       # tests unitaires de validation métier
npm run build  # vérification du build Nuxt/Nitro
npm run preview
```

## Variables d’environnement

Créer un fichier `.env` local, jamais commité :

```env
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
```

`DB_PASSWORD` et `JWT_SECRET` restent exclusivement côté serveur. Ils ne doivent jamais être ajoutés au code client, à un README ou à un commit.

## Arborescence

```text
app/
  app.vue                         coque commune du CMS
  pages/                          connexion, tableau de bord, programmes et coureurs
  components/admin/programmes/    cartes et formulaires saison/semaine/séance/exercice
  composables/useAdminAuth.js     token, session et déconnexion CMS
  composables/usePrograms.js      appels CRUD et état de sauvegarde commun
  middleware/admin.js             protection des pages CMS

server/
  api/auth/                       inscription, connexion et utilisateur connecté
  api/admin/                      routes protégées du CMS
  api/saisons/                    lecture publique des programmes MySQL
  api/users/me/progress.patch.js  mise à jour de current_session_id
  middleware/cors.js              accès App User ↔ API sur deux origines
  utils/auth.js                   vérification du token et rôle admin
  utils/program-validation.js     types d’exercice et règles d’ordre

test/
  program-validation.test.js      tests de validation des données
```

## Modèle de données et intégrité

```text
LU_saisons
  └── LU_semaines
        └── LU_sessions
              └── LU_exercices
```

Les routes d’administration vérifient l’unicité avant écriture :

- un numéro de semaine est unique dans une saison ;
- un ordre de séance est unique dans une semaine ;
- un ordre d’exercice est unique dans une séance.

La base MySQL porte aussi ces contraintes et les clés étrangères en cascade. Les types d’exercice admis sont : `echauffement`, `trotte`, `marche`, `etirement`, `sprint`, `deboule` et `cours`.

## API principale

| Route | Usage |
| --- | --- |
| `POST /api/auth/register` | Créer un compte coureur |
| `POST /api/auth/login` | Récupérer un token JWT |
| `GET /api/auth/me` | Récupérer le compte associé au token |
| `GET /api/saisons` | Lire tous les programmes depuis MySQL |
| `GET /api/saisons/:id` | Lire un programme complet depuis MySQL |
| `PATCH /api/users/me/progress` | Enregistrer la prochaine séance du coureur |
| `/api/admin/*` | CRUD CMS, réservé aux tokens `admin` |

Les routes `/api/**` répondent aux prévalidations CORS afin que l’App User puisse envoyer ses requêtes JSON avec l’en-tête `Authorization` depuis un autre port ou domaine.

## Règles CMS

- Les IDs techniques sont générés, jamais saisis par l’administrateur.
- Une écriture affiche `Enregistrement...` et bloque les doubles clics.
- En cas d’erreur API, le formulaire reste ouvert avec ses valeurs.
- Les suppressions demandent une confirmation navigateur.
- Utiliser la saison `test` pour les manipulations de vérification ; ne pas modifier `5 kms` pendant les tests.

## Préparation Vercel

Avant un déploiement, renseigner les variables ci-dessus dans les paramètres du projet Vercel, puis lancer `npm run build` localement. L’App User devra recevoir l’URL publique de cette API dans sa variable `VITE_API_URL`.

Le déploiement n’est pas lancé automatiquement par ce projet.
