# NEXORA v0.2.1 — Vérification technique

## Réalisé
- Archive v0.2 inspectée et extraite.
- Ajout de `npm run typecheck`.
- Webhook Stripe renforcé : refus des prix inconnus et des événements abonnement sans identifiant de workspace.
- Code Supabase, routes Checkout et portail Stripe inspectés statiquement.

## Non validé
- `npm install` a expiré dans cet environnement ; les dépendances ne sont pas installées.
- `npm run typecheck`, `npm run build` et tests de fonctionnement non exécutés.
- Aucun identifiant Supabase/Stripe fourni ; aucun paiement ni webhook réel testé.
- Pas de validation de sécurité ni de conformité pour une mise en production.

## À exécuter dans un environnement avec accès au registre npm
```sh
npm install
npm run typecheck
npm run build
npm run dev
```

Configurer les variables d'environnement décrites dans README.md et utiliser uniquement Stripe en mode test.
