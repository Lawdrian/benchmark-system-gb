from django.db import IntegrityError

from .models import *


def insertLookupValues(
		greenhouse_operator,
		greenhouse_name,
		construction_type,
		production_type,
		cultivation_type,
		fruit_weight,
		energysource_type,
		roofing_material,
		energy_screen_brand,
		powerusage_lighting_type,
		powermix_type,
		fertilizer_type,
		pesticide_type,
		used_materials_substrate_type,
		used_materials_cord_type,
		used_materials_clip_type,
		post_harvest_packaging_type
):
	mocking_successful = True

	try:
		GreenhouseOperator(
			name=greenhouse_operator, mail=greenhouse_operator + '@gmail.com'
		).save()
	except IntegrityError as e:
		mocking_successful = False
		print('IntegrityError: Mocking GreehouseOperator failed')
		pass

	try:
		GreenhouseName(greenhouse_name=greenhouse_name).save()
	except IntegrityError as e:
		mocking_successful = False
		print('IntegrityError: Mocking GreehouseName failed')
		pass

	try:
		ConstructionType(construction_type=construction_type).save()
	except IntegrityError as e:
		mocking_successful = False
		print('IntegrityError: Mocking ConstructionType failed')
		pass

	try:
		ProductionType(production_type=production_type).save()
	except IntegrityError as e:
		mocking_successful = False
		print('IntegrityError: Mocking ProductionType failed')
		pass

	try:
		CultivationType(cultivation_type=cultivation_type).save()
	except IntegrityError as e:
		mocking_successful = False
		print('IntegrityError: Mocking CultivationType failed')
		pass

	try:
		FruitWeight(fruit_weight=fruit_weight).save()
	except IntegrityError as e:
		mocking_successful = False
		print('Mocking FruitWeight failed')
		pass

	try:
		RoofingMaterial(roofing_material=roofing_material).save()
	except IntegrityError as e:
		mocking_successful = False
		print('Mocking RoofingMaterial failed')
		pass

	try:
		EnergySourceType(energysource_type=energysource_type).save()
	except IntegrityError as e:
		mocking_successful = False
		print('Mocking EnergySourceType failed')
		pass

	try:
		LightingType(lighting_type=powerusage_lighting_type).save()
	except IntegrityError as e:
		mocking_successful = False
		print('Mocking LightingType failed')
		pass

	try:
		PowerMixType(powermix_type=powermix_type).save()
	except IntegrityError as e:
		mocking_successful = False
		print('Mocking PowerMixType failed')
		pass

	try:
		FertilizerType(fertilizer_type=fertilizer_type).save()
	except IntegrityError as e:
		mocking_successful = False
		print('Mocking FertilizerType failed')
		pass

	try:
		PesticideType(pesticide_type=pesticide_type).save()
	except IntegrityError as e:
		mocking_successful = False
		print('Mocking PesticideType failed')
		pass

	try:
		SubstrateType(substrate_type=used_materials_substrate_type).save()
	except IntegrityError as e:
		mocking_successful = False
		print('Mocking SubstrateType failed')
		pass

	try:
		CordType(cord_type=used_materials_cord_type).save()
	except IntegrityError as e:
		mocking_successful = False
		print('Mocking CordType failed')
		pass

	try:
		ClipType(clip_type=used_materials_clip_type).save()
	except IntegrityError as e:
		mocking_successful = False
		print('Mocking ClipType failed')
		pass

	try:
		PackagingType(packaging_type=post_harvest_packaging_type).save()
	except IntegrityError as e:
		mocking_successful = False
		print('Mocking PackagingType failed')
		pass

	try:
		EnergyScreenBrand(energy_screen_brand=energy_screen_brand).save()
	except IntegrityError as e:
		mocking_successful = False
		print('Mocking EnergyScreenBrand failed')
		pass

	return mocking_successful


def mockLookupValues():
	return insertLookupValues(
		"GOP Mock",
		"GName Mock",
		"ConstructionType Mock",
		"ProductionType Mock",
		"CultivationType Mock",
		"FruitWeight Mock",
		"RoofingMaterial Mock",
		"EnergySourceType Mock",
		"Lighting Type Mock",
		"PowerMixType Mock",
		"FertilizerType Mock",
		"PesticideType Mock",
		"SubstrateType Mock",
		"CordType Mock",
		"ClipType Mock",
		"PackagingType Mock",
		"EnergyScreenBrand Mock"
	)
