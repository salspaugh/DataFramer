import argparse
import collections
import csv
import json

def json_to_csv(jsonfilename, csvfilename):
    rows = collections.defaultdict(dict)
    with open(jsonfilename) as jsonfile:
        data = json.load(jsonfile)
        for item in data:
            for idx, value in enumerate(item["values"]):
                name = item["name"]
                rows[idx][name] = value.encode("utf8") if type(value) is unicode else value
    with open(csvfilename, "w") as csvfile:
        writer = csv.DictWriter(csvfile, rows.items()[0][1].keys())
        writer.writeheader()
        for row in sorted(rows.iteritems(), key=lambda x: x[0]):
            writer.writerow(row[1])

if __name__ == "__main__":
    parser = argparse.ArgumentParser("Convert json file to csv.")
    parser.add_argument("jsonfilename", help="The json file")
    parser.add_argument("csvfilename", help="The csv file")
    args = parser.parse_args()
    json_to_csv(args.jsonfilename, args.csvfilename)
