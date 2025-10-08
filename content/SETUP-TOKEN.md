# GitHub Personal Access Token Setup

## Schritt 1: Token erstellen

1. Gehe zu GitHub Settings → Developer settings → Personal access tokens → **Tokens (classic)**
   - Direkt-Link: https://github.com/settings/tokens

2. Klicke auf **"Generate new token"** → **"Generate new token (classic)"**

3. Token-Einstellungen:
   - **Note**: `Quartz Content Sync Token`
   - **Expiration**: `No expiration` (oder nach Wunsch)
   - **Scopes**: Wähle folgende aus:
     - ✅ `repo` (Full control of private repositories)
       - Wichtig: Alle Sub-Scopes werden automatisch ausgewählt

4. Klicke auf **"Generate token"**

5. **WICHTIG**: Kopiere den Token sofort! Er wird nur einmal angezeigt.

## Schritt 2: Token in GitHub Secrets speichern

1. Gehe zum Content-Repository:
   https://github.com/alemsabic/Dein-Kopf.-Dein-Projekt.-Deine-KI.

2. Gehe zu **Settings** → **Secrets and variables** → **Actions**

3. Klicke auf **"New repository secret"**

4. Secret erstellen:
   - **Name**: `QUARTZ_REPO_TOKEN`
   - **Value**: [Dein kopierter Token]

5. Klicke auf **"Add secret"**

## Schritt 3: Workflow pushen und testen

```bash
cd /Users/alemsabic/Desktop/ale.ms/content-repo
git add .github/workflows/sync-to-quartz.yml
git commit -m "ci: add GitHub Action for content sync"
git push
```

## Fertig!

Ab jetzt wird bei jedem Push zum Content-Repository automatisch das Quartz-Repository aktualisiert und die Seite auf ale.ms neu deployed.

## Test durchführen

```bash
# Ändere irgendeine Markdown-Datei
echo "\n## Test Update" >> index.md
git add index.md
git commit -m "test: verify auto-sync"
git push

# Warte 1-2 Minuten und prüfe:
# 1. GitHub Actions Tab im Content-Repo
# 2. Commits im Quartz-Repo
# 3. Cloudflare Pages Deployment
# 4. Live-Seite: https://ale.ms
```
