###############################################################################
# kind of messy script that creates a deployable tarball from source          #
# copies the entire sourcecode into a build folder, the removes unneccessary  #
# files and folders and compresses everything into a tarball.                 #
# In the tarball there are all files/folders except the following folders/    #
# files:                                                                      #
# - ./build/ (if it already exists)                                           #
# - ./db.sqlite3                                                              #
# - ./environment.yml (the requirements.txt is used)                          #
# - */__pycache__/                                                            #
# - */node_modules/                                                           #
# - ./frontend/src/                                                           #
# - ./frontend/static/ (gets collected by Django int ./static/)               #
# - ./frontend/*.json                                                         #
# - ./frontend/*.ts                                                           #
###############################################################################

# run deployment preparations:
python manage.py check --deploy
cd ./frontend && npm run build
cd .. && python manage.py collectstatic

# renew the build folder
if [ -d "./build" ]; then
  rm -r ./build
fi

mkdir -p build/benchmark-system-gb

# copy all necessary folders and files to build
cp -R ./accounts ./backend ./benchmarksystemgb ./frontend ./static ./config ./build/benchmark-system-gb
cp requirements.txt manage.py LICENSE .env ./build/benchmark-system-gb

# remove unnecessary folders and files (caches from python and npm)
cd ./build/benchmark-system-gb || exit
find . -regex ".*\__pycache__" -exec rm -r {} \;
find . -regex ".*\node_modules" -exec rm -r {} \;
echo "##### the errors here (find: <some file>: No such file or directory) are normal ;)"

# remove unnecessary ("webpack-ed") files in ./frontend
cd ./frontend || exit
rm -r ./src ./static
# deletes all files ('-type f') that aren't .py ('! -iregex ".*/*.py"') or
# .html (index.html) ('! -iregex ".*/*.html"')
find . -type f -and ! -iregex ".*/*.py" -and ! -iregex ".*/*.html" -exec rm {} \;

cd ../..
tar -czf benchmark-system-gb.tar.gz benchmark-system-gb

rm -R benchmark-system-gb

echo "##### finished packing all together"
