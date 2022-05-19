import pandas as pd
pd.options.display.max_columns = 8
from wetterdienst.provider.dwd.observation import DwdObservationRequest
from wetterdienst import Settings

Settings.tidy = False  # default, tidy data
Settings.humanize = True  # default, humanized parameters
Settings.si_units = False  # default, convert values to SI units
request = DwdObservationRequest(
    parameter=["climate_summary"],
    resolution="monthly",
    start_date="2021-04-01",  # if not given timezone defaulted to UTC
    end_date="2022-04-01",  # if not given timezone defaulted to UTC
).filter_by_station_id(station_id=(1048, 4411))
request.df.head()  # station list
for result in request.values.query():
    print(result.df.dropna().head())
    print(result.df[['station_id', 'date', 'precipitation_height', 'temperature_air_mean_200', 'sunshine_duration']].dropna())
