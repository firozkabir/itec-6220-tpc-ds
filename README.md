## About This Repository
This repository was created to host all the code written for a class project for ITEC-6220. 

## What is in this repository
* 

## data model

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


