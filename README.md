# Kana Garden

An installable, offline-friendly Japanese kana practice web app.

The quiz runs entirely in the browser. Progress is stored on each device, and
the app continues working offline after its first successful load.

Study modes include hiragana, katakana, mixed kana, and a practical deck of 50
common beginner kanji. Kanji questions ask for an English meaning and reveal a
common Japanese reading after each answer.

## Run locally

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Open `http://127.0.0.1:5000`.

## Deploy free with GitHub Pages

1. Create a GitHub repository and push this project to its default branch.
2. In the repository, open **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the default branch and the root (`/`) folder, then save.
5. GitHub will provide an HTTPS address such as
   `https://YOUR-NAME.github.io/kana-garden/`.

All asset paths are relative, so the app works from a GitHub project URL.

## Install on iPhone

1. Open the GitHub Pages address in Safari.
2. Tap **Share**.
3. Choose **Add to Home Screen**, then **Add**.
4. Launch Kana Garden once while online so its offline cache is populated.

Afterward, practice works without internet access. New installations and app
updates still require an internet connection.

## Test

```powershell
python -m unittest discover -s tests
```
