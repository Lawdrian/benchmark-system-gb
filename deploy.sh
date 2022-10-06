###############################################################################
# prepares the project on the server, so that all necessary software (python  #
# scripts) is installed and all necessary folders exist.                      #
# therefore sftp the project tar.gz to the directory specified here under     #
# USER_DIR. In addition sftp this script in the same folder and run it.       #
###############################################################################
USER_DIR=/srv/www/benchmark
PROJECT_DIR="$USER_DIR/benchmark-system-gb"
cd $USER_DIR || exit

PROJECT_TAR="$USER_DIR/benchmark-system-gb.tar.gz"
if test -f "$PROJECT_TAR"; then
  # check if old project exists -> delete
  [ -d "$PROJECT_DIR" ] && rm -R "$PROJECT_DIR"
  # export project data
  tar -xf "$PROJECT_TAR"
else
  echo "no project tar found"
  exit 1
fi

pip install --upgrade pip
pip install -r "$PROJECT_DIR/requirements.txt"
pip install cffi
pip install gunicorn

mkdir -p "$USER_DIR/log/gunicorn/"

cd benchmark-system-gb || exit

echo "now you can start the app by running 'gunicorn -c config/gunicorn/prod.py'"
