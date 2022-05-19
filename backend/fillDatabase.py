"""
This is just a temporary script to fill the database with some dummy data
in order to be able to test some functionality.
"""
import random
import string
from .models import *
from django.db import IntegrityError


def fill_database(op_name, greenhouse_name, construction_type, energy_source,
                  irrigation_system, heat_consumption, fertilizer,
                  working_hours, psm, co2, current, co2_equivalent,
                  co2_footprint, area, harvest, global_radiation,
                  wind_movement):

    go, gn, ct, es, irs = None, None, None, None, None

    try:
        go = add_greenhouse_operator(op_name, op_name + "@gmail.com")
    except IntegrityError as e:
        go = GreenhouseOperator.objects.filter(name=op_name)[0]

    try:
        gn = add_greenhouse_name(greenhouse_name)
    except IntegrityError as e:
        gn = GreenhouseName.objects.filter(greenhouse_name=greenhouse_name)[0]

    try:
        ct = add_construction_type(construction_type)
    except IntegrityError as e:
        ct = ConstructionType.objects.filter(construction_type=
                                             construction_type)[0]

    try:
        es = add_energy_source(energy_source)
    except IntegrityError as e:
        es = EnergySource.objects.filter(energy_source=energy_source)[0]

    try:
        irs = add_irrigation_system(irrigation_system)
    except IntegrityError as e:
        irs = IrrigationSystem.objects.filter(irrigation_system=
                                              irrigation_system)[0]

    add_greenhouse_data(go, gn, ct,
                        es, irs, heat_consumption,
                        fertilizer, working_hours, psm, co2, current,
                        co2_equivalent, co2_footprint, area, harvest,
                        global_radiation, wind_movement,
                        ''.join(random.choices(string.ascii_letters, k=10)))


def add_greenhouse_operator(name, mail):
    go = GreenhouseOperator(name=name, mail=mail)
    go.save()
    return go


def add_greenhouse_name(greenhouse_name):
    gn = GreenhouseName(greenhouse_name=greenhouse_name)
    gn.save()
    return gn


def add_construction_type(construction_type):
    ct = ConstructionType(construction_type=construction_type)
    ct.save()
    return ct


def add_energy_source(energy_source):
    es = EnergySource(energy_source=energy_source)
    es.save()
    return es


def add_irrigation_system(irrigation_system):
    irs = IrrigationSystem(irrigation_system=irrigation_system)
    irs.save()
    return irs


def add_greenhouse_data(greenhouse_operator, greenhouse_name, construction_type,
                        energy_source, irrigation_system, heat_consumption,
                        fertilizer, working_hours, psm, co2, current,
                        co2_equivalent, co2_footprint, area, harvest,
                        global_radiation, wind_movement, session_key):
    GreenhouseData(greenhouse_operator=greenhouse_operator,
                   greenhouse_name=greenhouse_name,
                   construction_type=construction_type,
                   energy_source=energy_source,
                   irrigation_system=irrigation_system,
                   heat_consumption=heat_consumption,
                   fertilizer=fertilizer, working_hours=working_hours, psm=psm,
                   co2=co2, current=current, co2_equivalent=co2_equivalent,
                   co2_footprint=co2_footprint, area=area, harvest=harvest,
                   global_radiation=global_radiation,
                   wind_movement=wind_movement, session_key=session_key).save()
