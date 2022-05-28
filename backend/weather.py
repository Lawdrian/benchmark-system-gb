from django.shortcuts import render
import pandas as pd
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import pgeocode
from wetterdienst.provider.dwd.observation import DwdObservationRequest
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
            parameter="climate_summary",
            resolution="monthly",
            start_date=start_date,  # if not given timezone defaulted to UTC
            end_date=end_date,  # if not given timezone defaulted to UTC
        ).filter_by_rank(latitude, longitude, 10)
        results = request.values.query()
        for result in request.values.query():
            current_result = result.df[
                [
                    'station_id',
                    'date',
                    'precipitation_height',
                    'temperature_air_mean_200',
                    'sunshine_duration'
                ]
            ].dropna()
            # print(result.stations)
            if current_result.empty:
                print("Empty dataset")
            else:
                break

        weather_data = current_result
        if weather_data.empty:
            return Response({'Bad Request': 'No weather data found!'}, status=status.HTTP_400_BAD_REQUEST)

        print(weather_data)

        precipitation_height = round(weather_data['precipitation_height'].mean(), 2)
        temperature_air_mean_200 = round(weather_data['temperature_air_mean_200'].mean(), 2)
        sunshine_duration = round(weather_data['sunshine_duration'].mean(), 2)

        data = {
            'precipitation_height': precipitation_height,
            'temperature_air_mean_200': temperature_air_mean_200,
            'sunshine_duration': sunshine_duration
        }

        print(precipitation_height + temperature_air_mean_200 + sunshine_duration)
        return Response(data, status=status.HTTP_200_OK)

