#!/bin/bash
echo "running jmeter tests"
jmeter -n -t jmeter/tpcds-scale-001.jmx -l jmeter/tpcds-scale-001.jtl -j jmeter/jmeter.log -e -o jmeter TestResults
echo "done running jmeter tests"
