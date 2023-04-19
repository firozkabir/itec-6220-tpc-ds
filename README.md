## About This Repository
This repository was created to host all the code written for a class project for ITEC-6220. 

## What is in this repository
* a python script to create tables, load / reload genereated data from tpc-ds toolkit
* a jmeter test to run the tpc-ds benchmark
* test results from our expeirments run as part of course project

## How to run locally 

* Environment variable setup 
    - both the python script and the jmeter tests depend on a few environment variables
    - these environment variables area used to provide these scripts the database credentials they need to do their work
    - set `tpcdsHost` to the database host
    - set `tpcdsUsername` to the database username
    - set `tpcdsPassword` to the database password
    - set `tpcdsDatabase` to the name of the database on the server you'd like to use
    - don't forget to source the .bashrc file after setting up these variables

* Python virtual environment setup 
    - run `virtualenv -p /usr/bin/python3 .venv` to create a virtual environment
    - activate the environment by runnig `source .venv/bin/activate`
    - now, install the dependencies by running `pip3 install -r requirements.txt`

* Test data setup
    - expects data to be present in a directory tables/
    - we zipped all the data along with the tables/ directory in tables.zip file and added large-file-storage in github.com
    - to work with this data, please unzip the file before you run the python script
    - please note, that this was randomy generated 1GB scale data created using `dsdgen`
    - see below for more about `dsdgen` and `dsqgen`


## What is not in this repository
* TPC-DS toolkits are not in this repository
* To get TPC-DS toolkit, go to [tpc.org](https://www.tpc.org/tpc_documents_current_versions/current_specifications5.asp)

## Additional Instructions

### Compile TPC-DS toolkit (assumes you are running ubuntu)
* install compiler: `sudo apt-get install gcc make flex bison byacc`
* download the tpc-ds toolkit from tpc.org
* unzip the downloaded files. Assuming it is sitting in `~/tpcds-kit`:

```bash
cd tpcds-kit/tools
make OS=LINUX
```
* generate queries: 

```bash
dsqgen \
-DIRECTORY ../query_templates \
-INPUT ../query_templates/templates.lst \
-VERBOSE Y \
-QUALIFY Y \
-SCALE 1 \
-OUTPUT_DIR ~/queries
```

* generate data: 

```bash
dsdgen -scale 1 -dir ~/tables
```
