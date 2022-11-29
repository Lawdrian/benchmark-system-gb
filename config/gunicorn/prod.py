"""Gunicorn *production* config file"""


# import multiprocessing


# Django WSGI application path in pattern MODULE_NAME:VARIABLE_NAME

wsgi_app = "benchmarksystemgb.wsgi"

# The number of worker processes for handling requests

# workers = multiprocessing.cpu_count() * 2 + 1 # if you need more performance (also uncomment import!)

workers = 2

# The socket to bind

bind = "0.0.0.0:8000"

# Write access and error info to /var/log

accesslog = "/srv/www/benchmark/log/gunicorn/access.log"

errorlog = "/srv/www/benchmark/log/gunicorn/error.log"

# Redirect stdout/stderr to log file

capture_output = True

# PID file so you can easily fetch process ID

pidfile = "/srv/www/benchmark/log/gunicorn/prod.pid"

# Daemonize the Gunicorn process (detach & enter background)

daemon = True


