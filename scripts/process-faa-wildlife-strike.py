import csv

ORIGINAL = "data/faa-wildlife-strike-original.csv"
CLEANED = "data/faa-wildlife-strike-clean.csv"

COLUMNS_TO_DELETE = [
    # Columns added by Jock in Tableau
    "Number of Records",
    "Cost: Other - lodging, lost revenue, ... (infl adj) (copy)",
    "Cost: Repairs (adj)",
    "Cost: Total $",
    "Number Damaged",
    # Not very meaningful columns
    "SPECIES_ID",
    "AIRPORT_ID",
    "REG",
    "OPID",
    "REPORTED_TITLE",
    "INDEX_NR",
]

COLUMN_ENCODINGS = {
    "AC_CLASS" : { 
        "A": "Airplane",
        "B": "Helicopter",
    },
    "TYPE_ENG": {
        "A": "Reciprocating (Piston)",
        "B": "Turbojet",
        "C": "Turboprop",
        "D": "Turbofan",
        "E": "None (Glider)",
        "F": "Turboshaft (Helicopter)",
        "B/D": "Turbojet / Turbofan",
        "A/C": "Reciprocating (Piston) / Turboprop"
    } ,   
    "BIRDS_SEEN": {
        "10-Feb": "2-10"
    },
    "BIRDS_STRUCK": {
        "10-Feb": "2-10"
    },
    "DAMAGE": {
        "N": "None (Civilian)",
        "M": "Minor (Civilian)",
        "M?": "Uncertain (Civilian)",
        "S": "Substantial (Civilian)",
        "D": "Destroyed (Civilian)",
        "A": "Over $2M (Military)",
        "B": "$500K-2M (Military)",
        "C": "$50-500K (Military)",
        "N": "None (Military)",
        "E": "<$50K (Military)"
    }
}

def filter_columns(row):
    return { k:v for (k,v) in row.iteritems() if k.strip() not in COLUMNS_TO_DELETE }

def decode_values(row):
    for (header, val) in row.iteritems():
        if header in COLUMN_ENCODINGS:
            row[header] = COLUMN_ENCODINGS[header].get(val, val)

def clean_time_columns(row):
    val = row["TIME"]
    if val != "":
        val = "%04d" % int(val.replace(",", ""))
        row["TIME"] = "%s:%s" % (val[:2], val[2:])
    val = row["REPORTED_DATE"]
    row["REPORTED_DATE"] = val.split()[0] if val != "" else ""

def clean():
    with open(ORIGINAL) as original, open(CLEANED, "w") as cleaned:
        first = True
        reader = csv.DictReader(original)
        writer = None

        for row in reader:
            row = filter_columns(row)
            decode_values(row)
            clean_time_columns(row)
            if first:
                writer = csv.DictWriter(cleaned, row.keys())
                writer.writeheader()
                first = False
            writer.writerow(row)

if __name__ == "__main__":
    clean()
