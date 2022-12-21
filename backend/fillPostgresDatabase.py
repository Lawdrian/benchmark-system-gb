import psycopg2


def fill_measurements_table(cur):
    with open("backend/data/measurements.csv", 'r') as file:
        cur.copy_expert("""COPY backend_measurements FROM STDIN WITH (FORMAT CSV)""", file)

def fill_measurementunits_table(cur):
    with open("backend/data/measurementunits.csv", 'r') as file:
        cur.copy_expert("""COPY backend_measurementunits FROM STDIN WITH (FORMAT CSV)""", file)

def fill_optiongroups_table(cur):
    with open("backend/data/optiongroups.csv", 'r') as file:
        cur.copy_expert("""COPY backend_optiongroups FROM STDIN WITH (FORMAT CSV)""", file)


def fill_options_table(cur):
    with open("backend/data/options.csv", 'r') as file:
        cur.copy_expert("""COPY backend_options FROM STDIN WITH (FORMAT CSV)""", file)

def fill_optionunits_table(cur):
    with open("backend/data/optionunits.csv", 'r') as file:
        cur.copy_expert("""COPY backend_optionunits FROM STDIN WITH (FORMAT CSV)""", file)


def fill_calculations_table(cur):
    with open("backend/data/calculations.csv", 'r') as file:
        cur.copy_expert("""COPY backend_calculations FROM STDIN WITH (FORMAT CSV)""", file)


def fill_database():
    # Build a connection to the database
    conn = psycopg2.connect("host=localhost dbname=benchmarkDB user=postgres password=LN*CeZTeYB9tCj")
    cur = conn.cursor()
    # Fill all tables with the data from the .csv files

    fill_measurements_table(cur)
    fill_measurementunits_table(cur)
    fill_optiongroups_table(cur)
    fill_options_table(cur)
    fill_optionunits_table(cur)
    fill_calculations_table(cur)

    conn.commit()


# Execute the script
fill_database()
