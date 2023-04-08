#!/usr/bin/env python3.9
import pandas as pd
import glob
import psycopg2
import os


def remove_trailing_delimiter():
    files = glob.glob("./tables/*.dat")
    sep = "|"
    for file in files:
        df = pd.read_csv(file, sep=sep, header=None,
                         dtype='str', keep_default_na=False)
        print(
            f"file: {file} has {len(df.columns)} columns. Removing final column.")
        df.drop(df.columns[len(df.columns)-1], axis=1, inplace=True)
        print(
            f"file: {file}.new will have {len(df.columns)} columns and {len(df.index)} rows.")
        df.to_csv(file+".new", sep='|', header=None, index=None)


def load_data():
    database = os.getenv("tpcdsDatabase")
    host = os.getenv("tpcdsHost")
    username = os.getenv("tpcdsUsername")
    password = os.getenv("tpcdsPassword")

    conn = psycopg2.connect(database=database, host=host,
                            password=password, user=username)
    cursor = conn.cursor()
    files = glob.glob("./tables/*.dat.new")
    for file in files:

        table = file.split("/")[-1].split(".")[0]
        print(f"working on {table}")
        print(f">> truncating table")
        sql = f"truncate table {table}"
        cursor.execute(sql)
        with open(file) as f:
            print(">> loading table")
            cursor.copy_from(f, table, '|', null='')
        cursor.execute(f"select count(*) from {table}")
        result = cursor.fetchone()
        print(f">> table {table} has {result[0]} rows")
        print("")

    conn.commit()
    conn.close()


def main():
    remove_trailing_delimiter()
    load_data()


if __name__ == '__main__':
    main()
