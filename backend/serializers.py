from rest_framework import serializers
from .models import GreenhouseData

class CO2Serializer(serializers.ModelSerializer):
    class Meta:
        model = GreenhouseData
        fields = ('id', 
                  'electric_power_co2', 
                  'heat_consumption_co2', 
                  'psm_co2', 
                  'fertilizer_co2'
                  )
        
class CreateGreenhouseDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = GreenhouseData
        fields = ('greenhouse_operator', 
                  'greenhouse_name', 
                  'construction_type', 
                  'production_type', 
                  'cultivation_type', 
                  'fruit_weight', 
                  'energysource_type', 
                  'roofing_material', 
                  'energy_screen_brand', 
                  'powerusage_lighting_type', 
                  'powermix_type', 
                  'fertilizer_type', 
                  'pesticide_type', 
                  'used_materials_substrate_type', 
                  'used_materials_cord_type', 
                  'used_materials_clip_type', 
                  'post_harvest_packaging_type',
                  'datetime', 
                  'session_key', 
                  'location', 
                  'greenhouse_age', 
                  'standing_wall_height', 
                  'total_area', 
                  'closing_time_begin', 
                  'closing_time_end', 
                  'drop_per_bag', 
                  'greenhouse_area', 
                  'plantation_begin', 
                  'plantation_duration', 
                  'planting_density', 
                  'harvest', 
                  'energy_usage', 
                  'lighting_power', 
                  'lighting_runtime_per_day', 
                  'powerusage_total_without_lighting', 
                  'co2_consumption', 
                  'fertilizer_amount', 
                  'pesticide_amount', 
                  'used_materials_substrate_plantsperbag', 
                  'used_materials_substrate_bagpersqm', 
                  'used_materials_gutter_count', 
                  'used_materials_gutter_length', 
                  'used_materials_foils_area', 
                  'youngplants_travelling_distance', 
                  'post_harvest_packaging_amount', 
                  'post_harvest_transport_distance'
                  )
        def create(self, validated_data):
            return GreenhouseData.objects.create(**validated_data)
