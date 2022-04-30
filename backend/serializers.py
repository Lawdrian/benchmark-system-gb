from rest_framework import serializers
from .models import GreenhouseData

class CO2Serializer(serializers.ModelSerializer):
    class Meta:
        model = GreenhouseData
        fields = ('id', 'co2_footprint')
        
class CreateDataSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = GreenhouseData
        fields = ('heat_consumption', 
                  'fertilizer', 
                  'working_hours', 
                  'psm', 
                  'co2', 
                  'current', 
                  'co2_equivalent', 
                  'co2_footprint', 
                  'area',
                  'harvest', 
                  'global_radiation', 
                  'wind_movement', 
                  'session_key'
                  )