

import json

# Expanded bounding box to cover all of Kent (including Canterbury)
min_lon, min_lat = 0.5, 51.0
max_lon, max_lat = 1.7, 51.6

def is_in_bbox(coords, geom_type):
    try:
        if geom_type == "Polygon":
            for ring in coords:
                for lon, lat in ring:
                    if min_lon <= lon <= max_lon and min_lat <= lat <= max_lat:
                        return True
        elif geom_type == "MultiPolygon":
            for polygon in coords:
                for ring in polygon:
                    for lon, lat in ring:
                        if min_lon <= lon <= max_lon and min_lat <= lat <= max_lat:
                            return True
    except Exception as e:
        pass
    return False

input_file = "/Users/aj/Downloads/flood-risk-zone.geojson"
output_file = "/Users/aj/Downloads/flood_risk_kent_filtered.geojson"

print("Loading GeoJSON...")
with open(input_file, "r", encoding="utf-8") as f:
    data = json.load(f)

print("Filtering features in Kent bounding box...")
filtered = []
for i, feature in enumerate(data["features"]):
    geom = feature.get("geometry", {})
    coords = geom.get("coordinates", [])
    geom_type = geom.get("type", "")

    if is_in_bbox(coords, geom_type):
        filtered.append(feature)

    if i % 1000 == 0:
        print(f"Processed {i} features...")

print(f"Total features retained: {len(filtered)}")

print("Saving to filtered file...")
with open(output_file, "w", encoding="utf-8") as f:
    json.dump({
        "type": "FeatureCollection",
        "name": "flood-risk-kent",
        "features": filtered
    }, f)

print(" File saved at:", output_file)
