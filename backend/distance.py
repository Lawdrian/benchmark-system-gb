import pgeocode


def measure_distance(postal1, postal2):
    dist = pgeocode.GeoDistance('de')
    return dist.query_postal_code(postal1, postal2)


