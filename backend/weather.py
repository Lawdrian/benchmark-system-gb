"""
    This module handles all requests and responses about getting weather-data
    of a location.
    
    This module is currently not in use. It will be used at a later point
    inside the calculation algorithms if an owner cannot provide weather-data.
    
    Exported functions:
        postal_to_latlon(postal_code, country)
        GetWeatherData(APIView)
    
"""


from django.shortcuts import render
import pandas as pd
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import pgeocode
from wetterdienst.provider.dwd.observation import DwdObservationRequest, DwdObservationResolution, \
    DwdObservationDataset, DwdObservationPeriod
from wetterdienst import Settings
from datetime import datetime

def postal_to_latlon(postal_code, country):
    """Function, that returns the latitude and longitude of a postal code for a specified country

        Args:
            postal_code: Location of the greenhouse
            country: Country where the greenhouse is located

        Returns:
            The latitude and longitude of the postal code location
    """

    nomi = pgeocode.Nominatim(country)
    location = nomi.query_postal_code(postal_code)
    return location.latitude, location.longitude


class GetWeatherData(APIView):
    """API endpoint for retrieving weather data for a specific postal code
    """

    def get(self, request, format=None):
        """Get request that returns the weather data for a location in germany.

        Args:
            request :
                postalCode: Location of the greenhouse
                startDate: Time from when on the weather data is needed
                endDate: Time till when the weather data is needed
        Returns:
            json: The weather data requested
        """

        # Read Url query parameters
        postal_code = request.GET.get('postalCode', None)
        start_date = request.GET.get('startDate', None)
        end_date = request.GET.get('endDate', None)

        # Validate date query parameters
        date_format = "%Y-%m-%d"
        try:
            start_date = datetime.strptime(start_date, date_format).strftime(date_format)
            end_date = datetime.strptime(end_date, date_format).strftime(date_format)
        except ValueError:
            return Response({'Bad Request': 'Date query parameters invalid'}, status=status.HTTP_400_BAD_REQUEST)

        # Transform postal code to latitude/longitude location data
        latitude, longitude = postal_to_latlon(postal_code, 'de')

        Settings.tidy = False  # default, tidy data
        Settings.humanize = True  # default, humanized parameters
        Settings.si_units = False  # default, convert values to SI units
        pd.set_option('display.max_columns', None)

        request = DwdObservationRequest(
            parameter=[("precipitation_height", "precipitation"), ("temperature_air_mean_200", "temperature_air"), ("radiation_global", "solar")],
            resolution=DwdObservationResolution.MINUTE_10,
            period=DwdObservationPeriod.RECENT,
            start_date=start_date,  # if not given timezone defaulted to UTC
            end_date=end_date,  # if not given timezone defaulted to UTC
        ).filter_by_rank(latitude, longitude, 2)
        results = request.values.query()
        for result in request.values.query():
            weather_data = result.df
            precipitation_height = weather_data[weather_data['parameter'] == 'precipitation_height'].filter(
                items=['value']).reset_index(drop=True)
            temperature_air_mean_200 = weather_data[weather_data['parameter'] == 'temperature_air_mean_200'].filter(
                items=['value']).reset_index(drop=True)
            radiation_global = weather_data[weather_data['parameter'] == 'radiation_global'].filter(items=['value']).reset_index(drop=True)

            date = weather_data['date'].drop_duplicates()

            # Rename colums of dataframes containing weather data
            radiation_global.columns = ['radiation_global']
            temperature_air_mean_200.columns = ['temperature_air_mean_200']
            precipitation_height.columns = ['precipitation_height']


            # Concat all dataframes into a single one
            data = pd.concat([date, precipitation_height, temperature_air_mean_200, radiation_global], axis=1)

            data.dropna(axis=0, how="any", inplace=True)
            #print(data.isna().sum())
            #print("Final data without NaN:")
            #print(len(data))

            if data.empty:
                print("Empty dataset")
            else:
                #print("Station Name + Distance")
                #print(result.stations.df.filter(items=[current_result['station_id'][0]]))
                #print(result.stations.df[result.stations.df['station_id'] == weather_data['station_id'][0]].filter(items=['name', 'distance']))
                break

        best_weather_data = data
        if best_weather_data.empty:
            return Response({'Bad Request': 'No weather data found!'}, status=status.HTTP_400_BAD_REQUEST)

        #print("Selected Dataset:")
        #print(best_weather_data)




        location = result.stations.df[result.stations.df['station_id'] == weather_data['station_id'][0]].filter(items=['name', 'distance'])

        data = {
            'location': location,
            'weatherData': best_weather_data

        }

        return Response(data, status=status.HTTP_200_OK)

