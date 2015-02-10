import csv
import random
import re

ORIGINAL = "data/faa-on-time-performance-original.csv"
SAMPLE = "data/faa-on-time-performance-sample.csv"
SAMPLE_SIZE = 15000
TARGET_WEEK = re.compile("2010-01-0[3-9]")
COLUMNS_TO_KEEP = [
    # Time
    "Year",
    "Quarter",
    "Month",
    "DayofMonth",
    "DayOfWeek",
    "FlightDate",
    # Flight
    "UniqueCarrier",
    "TailNum",
    "FlightNum",
    # Origin
    "OriginCityMarketID",
    "Origin",
    "OriginCityName",
    "OriginState",
    # Destination
    "DestCityMarketID",
    "Dest",
    "DestCityName",
    "DestState",
    # Departure
    "CRSDepTime", # Customer Reservation System
    "DepTime",
    "DepDelay",
    "DepDel15",
    "DepTimeBlk",
    # In flight
    "TaxiOut",
    "WheelsOff",
    "WheelsOn",
    "TaxiIn",
    # Arrival
    "CRSArrTime",
    "ArrTime",
    "ArrDelay",
    "ArrDel15",
    "ArrTimeBlk",
    # Cancellation
    "Cancelled",
    # Diversion
    "Diverted",
    # Elapsed time
    "CRSElapsedTime",
    "ActualElapsedTime",
    "AirTime",
    "Distance",
    # Delay 
    "CarrierDelay",
    "WeatherDelay",
    "NASDelay",
    "SecurityDelay",
    "LateAircraftDelay"
]

def filter_by_date(row):
    date = row["FlightDate"]
    return TARGET_WEEK.match(date) is not None

def filter_columns(row):
    return { k:v for (k,v) in row.iteritems() if k in COLUMNS_TO_KEEP }

def clean():
    keepers = []
    with open(ORIGINAL) as original, open(SAMPLE, "w") as sample:
        first = True
        reader = csv.DictReader(original)
        writer = None

        for row in reader:
            row = filter_columns(row)
            if first:
                writer = csv.DictWriter(sample, row.keys())
                writer.writeheader()
                first = False
            if filter_by_date(row):
                keepers.append(row)

        sample = random.sample(keepers, SAMPLE_SIZE)
        for row in sample:
            new = {}
            for (column, value) in row.iteritems():
                new_value = value.decode("iso8859").encode("utf8")
                if column == "Cancelled":
                    new_value = "Yes" if float(new_value) == 1 else "No"
                if column == "Diverted":
                    new_value = "Yes" if float(new_value) == 1 else "No"
                if column in ["ArrTimeBlk", "DepTimeBlk"] and value != "":
                    new_value = value.split("-")[0]
                    new_value = "%s:%s" % (new_value[:2], new_value[2:])
                new[column] = new_value
            writer.writerow(new)

if __name__ == "__main__":
    clean()
