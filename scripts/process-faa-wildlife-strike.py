import csv

ORIGINAL = "data/faa-wildlife-strike-original.csv"
CLEANED = "data/faa-wildlife-strike-clean.csv"

COLUMNS_TO_DELETE = [
    # Columns added by Jock in Tableau
    "Number of Records",
    "Cost: Other - lodging, lost revenue, ... (infl adj) (copy)",
    "Cost: Repairs (adj)",
    "Cost: Total $",
    "Number Damaged"
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
        "A": "airplane",
        "B": "helicopter",
    },
    "TYP_ENG": {
        "A": "reciprocating (piston)",
        "B": "turbojet",
        "C": "turboprop",
        "D": "turbofan",
        "E": "none (glider)",
        "F": "turboshaft (helicopter)",
        "B/D": "turbojet / turbofan",
        "A/C": "reciprocating (piston) / turboprop"
    } ,   
    "BIRDS_SEEN": {
        "10-Feb": "2-10"
    },
    "BIRDS_STRUCK": {
        "10-Feb": "2-10"
    },
    "DAMAGE": {
        "N": "none (civilian)",
        "M": "minor (civilian)",
        "M?": "uncertain (civilian)",
        "S": "substantial (civilian)",
        "D": "destroyed (civilian)",
        "A": "over $2M (military)",
        "B": "$500K-2M (military)",
        "C": "$50-500K (military)",
        "N": "none (military)",
        "E": "<$50K (military)"
    }
}

def filter_columns(row):
    return { k:v for (k,v) in row.iteritems() if k not in COLUMNS_TO_DELETE }

def decode_values(row):
    for (header, val) in row.iteritems():
        if header in COLUMN_ENCODINGS:
            row[header] = COLUMN_ENCODINGS[header].get(val, val)

def clean():
    with open(ORIGINAL) as original, open(CLEANED, "w") as cleaned:
        first = True
        reader = csv.DictReader(original)
        writer = None

        for row in reader:
            row = filter_columns(row)
            decode_values(row)
            if first:
                writer = csv.DictWriter(cleaned, row.keys())
                writer.writeheader()
                first = False
            writer.writerow(row)

if __name__ == "__main__":
    clean()
