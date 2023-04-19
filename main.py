#!/usr/bin/env python3.9
import pandas as pd
import glob
import psycopg2
import os
from datetime import datetime


def create_tables():
    database = os.getenv("tpcdsDatabase")
    host = os.getenv("tpcdsHost")
    username = os.getenv("tpcdsUsername")
    password = os.getenv("tpcdsPassword")

    conn = psycopg2.connect(database=database, host=host,
                            password=password, user=username)

    cursor = conn.cursor()
    df = pd.read_csv("create_table.csv")
    for index, row in df.iterrows():
        drop_table = f"drop table if exists {row['table']}"
        create_table = row['ddl'].strip('\"')

        print(f"re-creating table: {row['table']}")
        cursor.execute(drop_table)
        cursor.execute(create_table)
    cursor.close()
    conn.commit()


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


def create_indexes():

    database = os.getenv("tpcdsDatabase")
    host = os.getenv("tpcdsHost")
    username = os.getenv("tpcdsUsername")
    password = os.getenv("tpcdsPassword")

    conn = psycopg2.connect(database=database, host=host,
                            password=password, user=username)

    cursor = conn.cursor()

    with open("index.sql") as i:
        lines = i.readlines()
        for line in lines:
            sql = line.strip("\n")
            if sql and '--' not in sql:
                print(f"creating index: {sql}")
                cursor.execute(sql)

    conn.commit()
    conn.close()


def main():

    print(f"*** start - {datetime.now()} ***")
    
    print(f">>>>>> cleaning datafiles - {datetime.now()} <<<<<<")
    remove_trailing_delimiter()
    
    print(f">>>>>> creating tables - {datetime.now()} <<<<<<")
    create_tables()
    
    print(f">>>>>> creating indexes - {datetime.now()} <<<<<<")
    create_indexes()
    
    print(f">>>>>> loading data - {datetime.now()} <<<<<<")
    load_data()
    print(f"=== end - {datetime.now()} ===")


if __name__ == '__main__':
    main()
