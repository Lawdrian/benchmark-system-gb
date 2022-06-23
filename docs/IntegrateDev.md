## Aktuellen Dev-Stand in eigenen Branch einbinden

Annahme: Aktuelles Arbeitsverzeichnis = pfad/zu/benchmark-system-gb

### 1. Dev aktualisieren
```
git fetch --all
git checkout dev
git pull
```
Status prüfen:
```
git status
```
Sollte liefern: 
```
Your branch is up to date with 'origin/dev'
```

### 2. Dev-Stand einbinden
```
git checkout <<eigener-branch>>
git merge dev
```
Eventuell treten Merge-Konflikte auf. Diese müssen z.B. in Pycharm zunächst gelöst werden.

### 3. Python Environment aktualisieren
Dieser Schritt wird in der Anaconda-Konsole ausgeführt:
```
cd pfad\zu\benchmark-system-gb
conda env update --file environment.yml
```

### 4. Node.js Dependencies aktualisieren
```
cd .\frontend\
npm install
```

### 5. Datenbank und Django-Migrations aktualisieren
Wieder zurück ins Projektverzeichnis:
```
cd ..
```
Im Falle von Fehlschlägen einfach die Datei ``db.sqlite3`` und alle Python-Files
in den ``migrations``-Ordnern (abgesehen vom ``__init__.py``) löschen.
```
python manage.py makemigrations
python manage.py migrate
```

### 6. Lookup-Values in die Datenbank einfügen
```
python manage.py shell
exec(open(r"pfad\zu\benchmark-system-gb\backend\fillDatabase.py").read())
quit()
```

### 7. Development Umgebung starten
Im ersten Terminal:
```
cd pfad\zu\benchmark-system-gb
python manage.py runserver
```

Im zweiten Terminal:
```
cd pfad\zu\benchmark-system-gb\frontend
npm run dev
```

### 8. Endpoint Test durchführen (optional)
Im Browser zu folgender URL navigieren:
```
localhost:8000/ep-test/
```

Auf "Run-Tests"-Button klicken ==> Alle Tests sollten auf "Ja" 
