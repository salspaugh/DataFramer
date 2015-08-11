import argparse
import csv

def print_column(csvfilename, column):
    with open(csvfilename, "U") as csvfile:
        reader = csv.DictReader(csvfile)
        column = set([r[column] for r in reader])
        for item in sorted(column):
            print item

if __name__ == "__main__":
    parser = argparse.ArgumentParser("Print out the unique values of a column.")
    parser.add_argument("-f", "--file",
        help="The name of the .csv file containing the data")
    parser.add_argument("-c", "--column",
        help="The column to print out")
    args = parser.parse_args()
    if args.file is None:
        parser.print_help()
        raise RuntimeError("You must provide a .csv file")
    if args.column is None:
        parser.print_help()
        raise RuntimeError("You must provide a column")
    print_column(args.file, args.column)
