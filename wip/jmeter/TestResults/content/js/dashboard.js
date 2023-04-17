/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.505, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "query-049"], "isController": false}, {"data": [0.0, 500, 1500, "query-043"], "isController": false}, {"data": [0.0, 500, 1500, "query-044"], "isController": false}, {"data": [1.0, 500, 1500, "query-041"], "isController": false}, {"data": [0.0, 500, 1500, "query-042"], "isController": false}, {"data": [0.0, 500, 1500, "query-047"], "isController": false}, {"data": [0.5, 500, 1500, "query-048"], "isController": false}, {"data": [1.0, 500, 1500, "query-045"], "isController": false}, {"data": [1.0, 500, 1500, "query-046"], "isController": false}, {"data": [0.5, 500, 1500, "query-040"], "isController": false}, {"data": [0.0, 500, 1500, "query-068-b"], "isController": false}, {"data": [0.0, 500, 1500, "query-038"], "isController": false}, {"data": [0.0, 500, 1500, "query-039"], "isController": false}, {"data": [1.0, 500, 1500, "query-032"], "isController": false}, {"data": [0.5, 500, 1500, "query-033"], "isController": false}, {"data": [0.5, 500, 1500, "query-030"], "isController": false}, {"data": [0.0, 500, 1500, "query-031"], "isController": false}, {"data": [0.0, 500, 1500, "query-036"], "isController": false}, {"data": [0.0, 500, 1500, "query-037"], "isController": false}, {"data": [1.0, 500, 1500, "query-034"], "isController": false}, {"data": [0.0, 500, 1500, "query-035"], "isController": false}, {"data": [1.0, 500, 1500, "query-065"], "isController": false}, {"data": [1.0, 500, 1500, "query-066"], "isController": false}, {"data": [1.0, 500, 1500, "query-063"], "isController": false}, {"data": [0.0, 500, 1500, "query-064"], "isController": false}, {"data": [1.0, 500, 1500, "query-069"], "isController": false}, {"data": [0.0, 500, 1500, "query-102"], "isController": false}, {"data": [0.5, 500, 1500, "query-103"], "isController": false}, {"data": [1.0, 500, 1500, "query-067"], "isController": false}, {"data": [1.0, 500, 1500, "query-100"], "isController": false}, {"data": [0.0, 500, 1500, "query-068"], "isController": false}, {"data": [1.0, 500, 1500, "query-101"], "isController": false}, {"data": [1.0, 500, 1500, "query-061"], "isController": false}, {"data": [1.0, 500, 1500, "query-062"], "isController": false}, {"data": [0.0, 500, 1500, "query-060"], "isController": false}, {"data": [0.5, 500, 1500, "query-054"], "isController": false}, {"data": [0.0, 500, 1500, "query-055"], "isController": false}, {"data": [1.0, 500, 1500, "query-053"], "isController": false}, {"data": [1.0, 500, 1500, "query-059"], "isController": false}, {"data": [0.0, 500, 1500, "query-056"], "isController": false}, {"data": [0.5, 500, 1500, "query-057"], "isController": false}, {"data": [0.0, 500, 1500, "query-050"], "isController": false}, {"data": [0.0, 500, 1500, "query-051"], "isController": false}, {"data": [0.5, 500, 1500, "query-007"], "isController": false}, {"data": [1.0, 500, 1500, "query-008"], "isController": false}, {"data": [0.0, 500, 1500, "query-005"], "isController": false}, {"data": [0.0, 500, 1500, "query-006"], "isController": false}, {"data": [1.0, 500, 1500, "query-009"], "isController": false}, {"data": [1.0, 500, 1500, "query-087"], "isController": false}, {"data": [0.0, 500, 1500, "query-088"], "isController": false}, {"data": [0.0, 500, 1500, "query-085"], "isController": false}, {"data": [1.0, 500, 1500, "query-086"], "isController": false}, {"data": [0.0, 500, 1500, "query-003"], "isController": false}, {"data": [1.0, 500, 1500, "query-004"], "isController": false}, {"data": [0.5, 500, 1500, "query-001"], "isController": false}, {"data": [0.5, 500, 1500, "query-089"], "isController": false}, {"data": [0.0, 500, 1500, "query-002"], "isController": false}, {"data": [1.0, 500, 1500, "query-083"], "isController": false}, {"data": [1.0, 500, 1500, "query-084"], "isController": false}, {"data": [0.0, 500, 1500, "query-081"], "isController": false}, {"data": [0.5, 500, 1500, "query-082"], "isController": false}, {"data": [0.5, 500, 1500, "query-076"], "isController": false}, {"data": [1.0, 500, 1500, "query-077"], "isController": false}, {"data": [0.0, 500, 1500, "query-074"], "isController": false}, {"data": [0.0, 500, 1500, "query-075"], "isController": false}, {"data": [0.5, 500, 1500, "query-078"], "isController": false}, {"data": [0.0, 500, 1500, "query-079"], "isController": false}, {"data": [0.0, 500, 1500, "query-072"], "isController": false}, {"data": [0.0, 500, 1500, "query-073"], "isController": false}, {"data": [0.0, 500, 1500, "query-070"], "isController": false}, {"data": [0.0, 500, 1500, "query-071"], "isController": false}, {"data": [0.0, 500, 1500, "query-029"], "isController": false}, {"data": [0.0, 500, 1500, "query-027"], "isController": false}, {"data": [1.0, 500, 1500, "query-028"], "isController": false}, {"data": [0.5, 500, 1500, "query-021"], "isController": false}, {"data": [0.0, 500, 1500, "query-022"], "isController": false}, {"data": [0.5, 500, 1500, "query-020"], "isController": false}, {"data": [1.0, 500, 1500, "query-025"], "isController": false}, {"data": [1.0, 500, 1500, "query-026"], "isController": false}, {"data": [0.5, 500, 1500, "query-023"], "isController": false}, {"data": [1.0, 500, 1500, "query-024"], "isController": false}, {"data": [1.0, 500, 1500, "query-018"], "isController": false}, {"data": [0.5, 500, 1500, "query-019"], "isController": false}, {"data": [0.0, 500, 1500, "query-016"], "isController": false}, {"data": [1.0, 500, 1500, "query-017"], "isController": false}, {"data": [0.5, 500, 1500, "query-010"], "isController": false}, {"data": [0.5, 500, 1500, "query-098"], "isController": false}, {"data": [0.0, 500, 1500, "query-011"], "isController": false}, {"data": [1.0, 500, 1500, "query-099"], "isController": false}, {"data": [1.0, 500, 1500, "query-096"], "isController": false}, {"data": [1.0, 500, 1500, "query-014"], "isController": false}, {"data": [1.0, 500, 1500, "query-015"], "isController": false}, {"data": [0.5, 500, 1500, "query-012"], "isController": false}, {"data": [1.0, 500, 1500, "query-013"], "isController": false}, {"data": [1.0, 500, 1500, "query-090"], "isController": false}, {"data": [0.5, 500, 1500, "query-091"], "isController": false}, {"data": [0.5, 500, 1500, "query-094"], "isController": false}, {"data": [1.0, 500, 1500, "query-095"], "isController": false}, {"data": [1.0, 500, 1500, "query-092"], "isController": false}, {"data": [0.5, 500, 1500, "query-093"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 100, 0, 0.0, 8638.829999999996, 15, 208419, 828.5, 17123.4, 44848.69999999979, 208195.5699999999, 0.1157514584683767, 1.4328097599459442, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["query-049", 1, 0, 0.0, 135.0, 135, 135, 135.0, 135.0, 135.0, 135.0, 7.407407407407407, 9.071180555555555, 0.0], "isController": false}, {"data": ["query-043", 1, 0, 0.0, 5019.0, 5019, 5019, 5019.0, 5019.0, 5019.0, 5019.0, 0.19924287706714486, 1.1431170925483163, 0.0], "isController": false}, {"data": ["query-044", 1, 0, 0.0, 186076.0, 186076, 186076, 186076.0, 186076.0, 186076.0, 186076.0, 0.005374148197510695, 3.673734119392077E-4, 0.0], "isController": false}, {"data": ["query-041", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.08356891809290955, 0.0], "isController": false}, {"data": ["query-042", 1, 0, 0.0, 1536.0, 1536, 1536, 1536.0, 1536.0, 1536.0, 1536.0, 0.6510416666666666, 0.3789265950520833, 0.0], "isController": false}, {"data": ["query-047", 1, 0, 0.0, 2869.0, 2869, 2869, 2869.0, 2869.0, 2869.0, 2869.0, 0.34855350296270476, 1.350644823980481, 0.0], "isController": false}, {"data": ["query-048", 1, 0, 0.0, 1070.0, 1070, 1070, 1070.0, 1070.0, 1070.0, 1070.0, 0.9345794392523364, 3.5083235981308407, 0.0], "isController": false}, {"data": ["query-045", 1, 0, 0.0, 139.0, 139, 139, 139.0, 139.0, 139.0, 139.0, 7.194244604316547, 0.19671762589928055, 0.0], "isController": false}, {"data": ["query-046", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 39.0881990131579, 0.0], "isController": false}, {"data": ["query-040", 1, 0, 0.0, 653.0, 653, 653, 653.0, 653.0, 653.0, 653.0, 1.5313935681470139, 5.183408307810107, 0.0], "isController": false}, {"data": ["query-068-b", 1, 0, 0.0, 3381.0, 3381, 3381, 3381.0, 3381.0, 3381.0, 3381.0, 0.2957704821058858, 0.04014853223898255, 0.0], "isController": false}, {"data": ["query-038", 1, 0, 0.0, 111313.0, 111313, 111313, 111313.0, 111313.0, 111313.0, 111313.0, 0.00898367665950967, 0.18699031671952063, 0.0], "isController": false}, {"data": ["query-039", 1, 0, 0.0, 1586.0, 1586, 1586, 1586.0, 1586.0, 1586.0, 1586.0, 0.6305170239596469, 0.03694435687263556, 0.0], "isController": false}, {"data": ["query-032", 1, 0, 0.0, 24.0, 24, 24, 24.0, 24.0, 24.0, 24.0, 41.666666666666664, 1.5462239583333333, 0.0], "isController": false}, {"data": ["query-033", 1, 0, 0.0, 787.0, 787, 787, 787.0, 787.0, 787.0, 787.0, 1.2706480304955527, 836.5864735546378, 0.0], "isController": false}, {"data": ["query-030", 1, 0, 0.0, 921.0, 921, 921, 921.0, 921.0, 921.0, 921.0, 1.0857763300760044, 2.679449986427796, 0.0], "isController": false}, {"data": ["query-031", 1, 0, 0.0, 2287.0, 2287, 2287, 2287.0, 2287.0, 2287.0, 2287.0, 0.4372540445999126, 7.303935969610844, 0.0], "isController": false}, {"data": ["query-036", 1, 0, 0.0, 16443.0, 16443, 16443, 16443.0, 16443.0, 16443.0, 16443.0, 0.060816152770175755, 1.0926714635407164, 0.0], "isController": false}, {"data": ["query-037", 1, 0, 0.0, 3227.0, 3227, 3227, 3227.0, 3227.0, 3227.0, 3227.0, 0.3098853424233034, 0.09472081267431051, 0.0], "isController": false}, {"data": ["query-034", 1, 0, 0.0, 148.0, 148, 148, 148.0, 148.0, 148.0, 148.0, 6.756756756756757, 0.14516469594594594, 0.0], "isController": false}, {"data": ["query-035", 1, 0, 0.0, 2187.0, 2187, 2187, 2187.0, 2187.0, 2187.0, 2187.0, 0.45724737082761774, 0.06787265660722451, 0.0], "isController": false}, {"data": ["query-065", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 0.0830078125, 0.0], "isController": false}, {"data": ["query-066", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 130.8748759920635, 0.0], "isController": false}, {"data": ["query-063", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 7.694453983516484, 0.0], "isController": false}, {"data": ["query-064", 1, 0, 0.0, 3009.0, 3009, 3009, 3009.0, 3009.0, 3009.0, 3009.0, 0.33233632436025257, 0.021420114656031906, 0.0], "isController": false}, {"data": ["query-069", 1, 0, 0.0, 26.0, 26, 26, 26.0, 26.0, 26.0, 26.0, 38.46153846153847, 1.427283653846154, 0.0], "isController": false}, {"data": ["query-102", 1, 0, 0.0, 1804.0, 1804, 1804, 1804.0, 1804.0, 1804.0, 1804.0, 0.5543237250554324, 3.61338951635255, 0.0], "isController": false}, {"data": ["query-103", 1, 0, 0.0, 691.0, 691, 691, 691.0, 691.0, 691.0, 691.0, 1.447178002894356, 13.722752351664255, 0.0], "isController": false}, {"data": ["query-067", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 92.31387867647058, 0.0], "isController": false}, {"data": ["query-100", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1.6360592532467533, 0.0], "isController": false}, {"data": ["query-068", 1, 0, 0.0, 3377.0, 3377, 3377, 3377.0, 3377.0, 3377.0, 3377.0, 0.2961208172934557, 0.04019608750370151, 0.0], "isController": false}, {"data": ["query-101", 1, 0, 0.0, 34.0, 34, 34, 34.0, 34.0, 34.0, 34.0, 29.41176470588235, 1.1776194852941175, 0.0], "isController": false}, {"data": ["query-061", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 77.1484375, 0.0], "isController": false}, {"data": ["query-062", 1, 0, 0.0, 98.0, 98, 98, 98.0, 98.0, 98.0, 98.0, 10.204081632653061, 7.63313137755102, 0.0], "isController": false}, {"data": ["query-060", 1, 0, 0.0, 208419.0, 208419, 208419, 208419.0, 208419.0, 208419.0, 208419.0, 0.004798027051276515, 0.0013588162547560443, 0.0], "isController": false}, {"data": ["query-054", 1, 0, 0.0, 836.0, 836, 836, 836.0, 836.0, 836.0, 836.0, 1.1961722488038278, 0.24297248803827753, 0.0], "isController": false}, {"data": ["query-055", 1, 0, 0.0, 5077.0, 5077, 5077, 5077.0, 5077.0, 5077.0, 5077.0, 0.19696671262556628, 0.0019235030529840458, 0.0], "isController": false}, {"data": ["query-053", 1, 0, 0.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 99.0, 10.101010101010102, 10.7421875, 0.0], "isController": false}, {"data": ["query-059", 1, 0, 0.0, 348.0, 348, 348, 348.0, 348.0, 348.0, 348.0, 2.8735632183908044, 5.1718525502873565, 0.0], "isController": false}, {"data": ["query-056", 1, 0, 0.0, 14990.0, 14990, 14990, 14990.0, 14990.0, 14990.0, 14990.0, 0.066711140760507, 1.0192993245496997, 0.0], "isController": false}, {"data": ["query-057", 1, 0, 0.0, 760.0, 760, 760, 760.0, 760.0, 760.0, 760.0, 1.3157894736842104, 25.55895353618421, 0.0], "isController": false}, {"data": ["query-050", 1, 0, 0.0, 4333.0, 4333, 4333, 4333.0, 4333.0, 4333.0, 4333.0, 0.23078698361412417, 0.03358130913916455, 0.0], "isController": false}, {"data": ["query-051", 1, 0, 0.0, 17001.0, 17001, 17001, 17001.0, 17001.0, 17001.0, 17001.0, 0.058820069407681905, 0.24969808761249337, 0.0], "isController": false}, {"data": ["query-007", 1, 0, 0.0, 894.0, 894, 894, 894.0, 894.0, 894.0, 894.0, 1.1185682326621924, 7.194228887024608, 0.0], "isController": false}, {"data": ["query-008", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 0.09648671407185629, 0.0], "isController": false}, {"data": ["query-005", 1, 0, 0.0, 8210.0, 8210, 8210, 8210.0, 8210.0, 8210.0, 8210.0, 0.1218026796589525, 2.866882993300852, 0.0], "isController": false}, {"data": ["query-006", 1, 0, 0.0, 7762.0, 7762, 7762, 7762.0, 7762.0, 7762.0, 7762.0, 0.12883277505797475, 0.18293247552177275, 0.0], "isController": false}, {"data": ["query-009", 1, 0, 0.0, 113.0, 113, 113, 113.0, 113.0, 113.0, 113.0, 8.849557522123893, 106.71321902654867, 0.0], "isController": false}, {"data": ["query-087", 1, 0, 0.0, 347.0, 347, 347, 347.0, 347.0, 347.0, 347.0, 2.881844380403458, 6.751508465417868, 0.0], "isController": false}, {"data": ["query-088", 1, 0, 0.0, 1547.0, 1547, 1547, 1547.0, 1547.0, 1547.0, 1547.0, 0.6464124111182935, 63.48855648028442, 0.0], "isController": false}, {"data": ["query-085", 1, 0, 0.0, 50163.0, 50163, 50163, 50163.0, 50163.0, 50163.0, 50163.0, 0.019935011861332057, 6.813724757291231E-4, 0.0], "isController": false}, {"data": ["query-086", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 35.64453125, 0.0], "isController": false}, {"data": ["query-003", 1, 0, 0.0, 3031.0, 3031, 3031, 3031.0, 3031.0, 3031.0, 3031.0, 0.32992411745298583, 1.6924720595513032, 0.0], "isController": false}, {"data": ["query-004", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.08921682098765432, 0.0], "isController": false}, {"data": ["query-001", 1, 0, 0.0, 1237.0, 1237, 1237, 1237.0, 1237.0, 1237.0, 1237.0, 0.8084074373484236, 0.007894603880355698, 0.0], "isController": false}, {"data": ["query-089", 1, 0, 0.0, 821.0, 821, 821, 821.0, 821.0, 821.0, 821.0, 1.2180267965895248, 10.415080694275275, 0.0], "isController": false}, {"data": ["query-002", 1, 0, 0.0, 1982.0, 1982, 1982, 1982.0, 1982.0, 1982.0, 1982.0, 0.5045408678102926, 4.320623896316851, 0.0], "isController": false}, {"data": ["query-083", 1, 0, 0.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 27.0, 37.03703703703704, 2.9296875, 0.0], "isController": false}, {"data": ["query-084", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 5.8489860372340425, 0.0], "isController": false}, {"data": ["query-081", 1, 0, 0.0, 4696.0, 4696, 4696, 4696.0, 4696.0, 4696.0, 4696.0, 0.21294718909710392, 0.0024954748722316867, 0.0], "isController": false}, {"data": ["query-082", 1, 0, 0.0, 820.0, 820, 820, 820.0, 820.0, 820.0, 820.0, 1.2195121951219512, 2.224657012195122, 0.0], "isController": false}, {"data": ["query-076", 1, 0, 0.0, 674.0, 674, 674, 674.0, 674.0, 674.0, 674.0, 1.483679525222552, 108.92583920623144, 0.0], "isController": false}, {"data": ["query-077", 1, 0, 0.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 27.0, 37.03703703703704, 2.9296875, 0.0], "isController": false}, {"data": ["query-074", 1, 0, 0.0, 2420.0, 2420, 2420, 2420.0, 2420.0, 2420.0, 2420.0, 0.4132231404958678, 2.6274373708677685, 0.0], "isController": false}, {"data": ["query-075", 1, 0, 0.0, 2554.0, 2554, 2554, 2554.0, 2554.0, 2554.0, 2554.0, 0.39154267815191857, 6.706315461041504, 0.0], "isController": false}, {"data": ["query-078", 1, 0, 0.0, 1445.0, 1445, 1445, 1445.0, 1445.0, 1445.0, 1445.0, 0.6920415224913494, 0.006758217993079584, 0.0], "isController": false}, {"data": ["query-079", 1, 0, 0.0, 27344.0, 27344, 27344, 27344.0, 27344.0, 27344.0, 27344.0, 0.03657109420713868, 0.6214586038070509, 0.0], "isController": false}, {"data": ["query-072", 1, 0, 0.0, 21765.0, 21765, 21765, 21765.0, 21765.0, 21765.0, 21765.0, 0.04594532506317482, 0.15143112508614748, 0.0], "isController": false}, {"data": ["query-073", 1, 0, 0.0, 45770.0, 45770, 45770, 45770.0, 45770.0, 45770.0, 45770.0, 0.021848372296263928, 0.13418399743281625, 0.0], "isController": false}, {"data": ["query-070", 1, 0, 0.0, 17591.0, 17591, 17591, 17591.0, 17591.0, 17591.0, 17591.0, 0.056847251435393105, 4.996340458188846E-4, 0.0], "isController": false}, {"data": ["query-071", 1, 0, 0.0, 17707.0, 17707, 17707, 17707.0, 17707.0, 17707.0, 17707.0, 0.056474840458575704, 0.0017096875529451628, 0.0], "isController": false}, {"data": ["query-029", 1, 0, 0.0, 1779.0, 1779, 1779, 1779.0, 1779.0, 1779.0, 1779.0, 0.5621135469364812, 2.634907251264756, 0.0], "isController": false}, {"data": ["query-027", 1, 0, 0.0, 17137.0, 17137, 17137, 17137.0, 17137.0, 17137.0, 17137.0, 0.05835327070082278, 0.04006088799089689, 0.0], "isController": false}, {"data": ["query-028", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 15.571019158291456, 0.0], "isController": false}, {"data": ["query-021", 1, 0, 0.0, 1004.0, 1004, 1004, 1004.0, 1004.0, 1004.0, 1004.0, 0.9960159362549801, 1.3510411479083666, 0.0], "isController": false}, {"data": ["query-022", 1, 0, 0.0, 2319.0, 2319, 2319, 2319.0, 2319.0, 2319.0, 2319.0, 0.43122035360068994, 5.146429630228547, 0.0], "isController": false}, {"data": ["query-020", 1, 0, 0.0, 1026.0, 1026, 1026, 1026.0, 1026.0, 1026.0, 1026.0, 0.9746588693957114, 0.06948251705653022, 0.0], "isController": false}, {"data": ["query-025", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 15.05919780927835, 0.0], "isController": false}, {"data": ["query-026", 1, 0, 0.0, 26.0, 26, 26, 26.0, 26.0, 26.0, 26.0, 38.46153846153847, 2.2911658653846154, 0.0], "isController": false}, {"data": ["query-023", 1, 0, 0.0, 875.0, 875, 875, 875.0, 875.0, 875.0, 875.0, 1.142857142857143, 1.3861607142857142, 0.0], "isController": false}, {"data": ["query-024", 1, 0, 0.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 27.0, 37.03703703703704, 2.6403356481481484, 0.0], "isController": false}, {"data": ["query-018", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.155518149882904, 0.0], "isController": false}, {"data": ["query-019", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.5599467954990215, 0.0], "isController": false}, {"data": ["query-016", 1, 0, 0.0, 1794.0, 1794, 1794, 1794.0, 1794.0, 1794.0, 1794.0, 0.5574136008918618, 0.35164959587513933, 0.0], "isController": false}, {"data": ["query-017", 1, 0, 0.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 28.0, 35.714285714285715, 2.720424107142857, 0.0], "isController": false}, {"data": ["query-010", 1, 0, 0.0, 1218.0, 1218, 1218, 1218.0, 1218.0, 1218.0, 1218.0, 0.8210180623973727, 0.08418642241379311, 0.0], "isController": false}, {"data": ["query-098", 1, 0, 0.0, 843.0, 843, 843, 843.0, 843.0, 843.0, 843.0, 1.1862396204033216, 8.007117437722421, 0.0], "isController": false}, {"data": ["query-011", 1, 0, 0.0, 7682.0, 7682, 7682, 7682.0, 7682.0, 7682.0, 7682.0, 0.13017443374121324, 0.5306133656599844, 0.0], "isController": false}, {"data": ["query-099", 1, 0, 0.0, 32.0, 32, 32, 32.0, 32.0, 32.0, 32.0, 31.25, 3.082275390625, 0.0], "isController": false}, {"data": ["query-096", 1, 0, 0.0, 113.0, 113, 113, 113.0, 113.0, 113.0, 113.0, 8.849557522123893, 0.37161227876106195, 0.0], "isController": false}, {"data": ["query-014", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 4.662298387096774, 0.0], "isController": false}, {"data": ["query-015", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 10.908698156682028, 0.0], "isController": false}, {"data": ["query-012", 1, 0, 0.0, 716.0, 716, 716, 716.0, 716.0, 716.0, 716.0, 1.3966480446927374, 14.764370199022347, 0.0], "isController": false}, {"data": ["query-013", 1, 0, 0.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 15.0, 66.66666666666667, 0.9114583333333334, 0.0], "isController": false}, {"data": ["query-090", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 3.9928417487684724, 0.0], "isController": false}, {"data": ["query-091", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 20.083928944073456, 0.0], "isController": false}, {"data": ["query-094", 1, 0, 0.0, 1217.0, 1217, 1217, 1217.0, 1217.0, 1217.0, 1217.0, 0.8216926869350862, 0.07061421528348397, 0.0], "isController": false}, {"data": ["query-095", 1, 0, 0.0, 107.0, 107, 107, 107.0, 107.0, 107.0, 107.0, 9.345794392523365, 0.3924503504672897, 0.0], "isController": false}, {"data": ["query-092", 1, 0, 0.0, 170.0, 170, 170, 170.0, 170.0, 170.0, 170.0, 5.88235294117647, 2.83203125, 0.0], "isController": false}, {"data": ["query-093", 1, 0, 0.0, 791.0, 791, 791, 791.0, 791.0, 791.0, 791.0, 1.2642225031605563, 22.374516039823007, 0.0], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 100, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
