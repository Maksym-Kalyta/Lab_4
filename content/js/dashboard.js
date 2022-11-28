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

    var data = {"OkPercent": 97.119140625, "KoPercent": 2.880859375};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9523350987000482, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, ""], "isController": true}, {"data": [1.0, 500, 1500, "-299"], "isController": false}, {"data": [1.0, 500, 1500, "-332"], "isController": false}, {"data": [1.0, 500, 1500, "-331"], "isController": false}, {"data": [1.0, 500, 1500, "-334"], "isController": false}, {"data": [1.0, 500, 1500, "-333"], "isController": false}, {"data": [1.0, 500, 1500, "-330"], "isController": false}, {"data": [1.0, 500, 1500, "-339"], "isController": false}, {"data": [1.0, 500, 1500, "-336"], "isController": false}, {"data": [1.0, 500, 1500, "-335"], "isController": false}, {"data": [1.0, 500, 1500, "-338"], "isController": false}, {"data": [1.0, 500, 1500, "-337"], "isController": false}, {"data": [0.0, 500, 1500, "-343"], "isController": false}, {"data": [1.0, 500, 1500, "-342"], "isController": false}, {"data": [1.0, 500, 1500, "-301"], "isController": false}, {"data": [1.0, 500, 1500, "-345"], "isController": false}, {"data": [1.0, 500, 1500, "-300"], "isController": false}, {"data": [1.0, 500, 1500, "-344"], "isController": false}, {"data": [1.0, 500, 1500, "-341"], "isController": false}, {"data": [0.9354838709677419, 500, 1500, "-340"], "isController": false}, {"data": [1.0, 500, 1500, "-307"], "isController": false}, {"data": [1.0, 500, 1500, "-306"], "isController": false}, {"data": [1.0, 500, 1500, "-309"], "isController": false}, {"data": [1.0, 500, 1500, "-308"], "isController": false}, {"data": [1.0, 500, 1500, "-303"], "isController": false}, {"data": [0.0, 500, 1500, "-347"], "isController": false}, {"data": [1.0, 500, 1500, "-302"], "isController": false}, {"data": [1.0, 500, 1500, "-346"], "isController": false}, {"data": [1.0, 500, 1500, "-305"], "isController": false}, {"data": [1.0, 500, 1500, "-349"], "isController": false}, {"data": [1.0, 500, 1500, "-304"], "isController": false}, {"data": [1.0, 500, 1500, "-348"], "isController": false}, {"data": [1.0, 500, 1500, "-310"], "isController": false}, {"data": [1.0, 500, 1500, "-354"], "isController": false}, {"data": [1.0, 500, 1500, "-353"], "isController": false}, {"data": [1.0, 500, 1500, "-312"], "isController": false}, {"data": [1.0, 500, 1500, "-311"], "isController": false}, {"data": [1.0, 500, 1500, "-350"], "isController": false}, {"data": [1.0, 500, 1500, "-352"], "isController": false}, {"data": [1.0, 500, 1500, "-351"], "isController": false}, {"data": [1.0, 500, 1500, "-318"], "isController": false}, {"data": [1.0, 500, 1500, "-317"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "-319"], "isController": false}, {"data": [1.0, 500, 1500, "-314"], "isController": false}, {"data": [1.0, 500, 1500, "-319-2"], "isController": false}, {"data": [0.8918918918918919, 500, 1500, "-313"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "-319-1"], "isController": false}, {"data": [1.0, 500, 1500, "-316"], "isController": false}, {"data": [1.0, 500, 1500, "-319-0"], "isController": false}, {"data": [1.0, 500, 1500, "-315"], "isController": false}, {"data": [1.0, 500, 1500, "-321"], "isController": false}, {"data": [1.0, 500, 1500, "-320"], "isController": false}, {"data": [1.0, 500, 1500, "-323"], "isController": false}, {"data": [1.0, 500, 1500, "-322"], "isController": false}, {"data": [1.0, 500, 1500, "-340-0"], "isController": false}, {"data": [1.0, 500, 1500, "-340-2"], "isController": false}, {"data": [0.9354838709677419, 500, 1500, "-340-1"], "isController": false}, {"data": [1.0, 500, 1500, "-329"], "isController": false}, {"data": [1.0, 500, 1500, "-328"], "isController": false}, {"data": [1.0, 500, 1500, "-325"], "isController": false}, {"data": [1.0, 500, 1500, "-324"], "isController": false}, {"data": [1.0, 500, 1500, "-327"], "isController": false}, {"data": [1.0, 500, 1500, "-326"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2048, 59, 2.880859375, 56.944335937500014, 14, 6138, 22.0, 121.0, 209.0999999999999, 395.08999999999946, 187.39134413029555, 358.5469457692835, 94.2357346280538], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["", 29, 29, 100.0, 2681.51724137931, 2076, 4333, 2525.0, 3317.0, 4269.5, 4333.0, 2.901450725362681, 190.99285971110558, 82.98915082541271], "isController": true}, {"data": ["-299", 39, 0, 0.0, 33.58974358974359, 16, 176, 23.0, 55.0, 95.0, 176.0, 3.923541247484909, 1.095832809356137, 1.8813073755030183], "isController": false}, {"data": ["-332", 31, 0, 0.0, 21.322580645161285, 16, 37, 21.0, 26.6, 35.8, 37.0, 3.9360081259522604, 1.1282049501650584, 1.9295664836211275], "isController": false}, {"data": ["-331", 31, 0, 0.0, 124.06451612903223, 114, 213, 121.0, 126.0, 161.39999999999986, 213.0, 3.8629283489096573, 1.8628309968847352, 1.8597887461059188], "isController": false}, {"data": ["-334", 31, 0, 0.0, 20.70967741935484, 16, 29, 20.0, 25.8, 28.4, 29.0, 3.934010152284264, 1.102350690038071, 1.88632713356599], "isController": false}, {"data": ["-333", 31, 0, 0.0, 25.387096774193548, 16, 83, 22.0, 42.8, 61.39999999999995, 83.0, 3.9101917255297676, 1.4815960835015136, 1.9474587695509586], "isController": false}, {"data": ["-330", 32, 0, 0.0, 161.56250000000003, 63, 277, 219.5, 239.4, 260.09999999999997, 277.0, 3.795066413662239, 1.0377134724857684, 1.8159985768500948], "isController": false}, {"data": ["-339", 31, 0, 0.0, 20.51612903225806, 16, 29, 21.0, 25.6, 27.799999999999997, 29.0, 3.934010152284264, 1.1104060913705585, 1.9055361675126903], "isController": false}, {"data": ["-336", 31, 0, 0.0, 21.09677419354839, 16, 50, 20.0, 24.8, 42.19999999999998, 50.0, 3.939509467530817, 1.1038916555470835, 1.8889640122633118], "isController": false}, {"data": ["-335", 31, 0, 0.0, 22.645161290322573, 17, 51, 20.0, 36.800000000000004, 43.19999999999998, 51.0, 3.9320142059868086, 1.1017914050608828, 1.8853700929096904], "isController": false}, {"data": ["-338", 31, 0, 0.0, 19.967741935483872, 16, 24, 20.0, 23.0, 24.0, 24.0, 3.934509455514659, 1.1107949136946313, 1.9057780175149133], "isController": false}, {"data": ["-337", 31, 0, 0.0, 21.129032258064516, 16, 50, 20.0, 26.6, 36.19999999999997, 50.0, 3.9350088855039353, 1.1109359133028687, 1.9060199289159685], "isController": false}, {"data": ["-343", 30, 30, 100.0, 81.86666666666667, 21, 1039, 32.5, 172.2000000000001, 572.5999999999995, 1039.0, 3.469010175763182, 0.7757845021970398, 1.6701386881359852], "isController": false}, {"data": ["-342", 29, 0, 0.0, 22.551724137931036, 16, 38, 21.0, 32.0, 37.5, 38.0, 4.048017867113344, 1.1326434690815188, 1.940992942141262], "isController": false}, {"data": ["-301", 38, 0, 0.0, 21.526315789473685, 16, 52, 20.5, 25.0, 41.54999999999997, 52.0, 3.8898556658818713, 1.0914228042788412, 1.8651554022929675], "isController": false}, {"data": ["-345", 29, 0, 0.0, 150.79310344827587, 65, 365, 87.0, 240.0, 335.5, 365.0, 4.025541365907829, 1.100733967240422, 1.9577339845918935], "isController": false}, {"data": ["-300", 38, 0, 0.0, 20.684210526315788, 16, 31, 20.5, 26.200000000000003, 28.14999999999999, 31.0, 3.8914490527393752, 1.091869879672299, 1.8659194188428059], "isController": false}, {"data": ["-344", 29, 0, 0.0, 32.93103448275861, 16, 148, 21.0, 59.0, 142.5, 148.0, 4.046323426817358, 1.1393910457653134, 1.9480834467001535], "isController": false}, {"data": ["-341", 30, 0, 0.0, 21.799999999999997, 17, 47, 20.0, 27.800000000000004, 40.39999999999999, 47.0, 3.9313327217926872, 1.1008243513301008, 1.8850433265627047], "isController": false}, {"data": ["-340", 31, 0, 0.0, 291.90322580645164, 168, 1210, 219.0, 694.8, 917.7999999999993, 1210.0, 3.8432928341185226, 79.66829806440614, 4.950491453322588], "isController": false}, {"data": ["-307", 37, 0, 0.0, 21.24324324324324, 16, 52, 20.0, 28.000000000000014, 37.60000000000002, 52.0, 4.081632653061225, 1.1536688154991728, 1.9770408163265307], "isController": false}, {"data": ["-306", 37, 0, 0.0, 21.89189189189189, 16, 55, 20.0, 30.00000000000003, 42.40000000000002, 55.0, 4.08028231142479, 1.1532871429752978, 1.976386744596383], "isController": false}, {"data": ["-309", 37, 0, 0.0, 20.162162162162158, 16, 37, 20.0, 25.0, 30.70000000000001, 37.0, 4.083885209713024, 1.154413286423841, 1.978131898454746], "isController": false}, {"data": ["-308", 37, 0, 0.0, 20.29729729729729, 16, 41, 20.0, 24.200000000000003, 26.600000000000023, 41.0, 4.081182439885286, 1.1533261292190602, 1.976822744319435], "isController": false}, {"data": ["-303", 37, 0, 0.0, 19.81081081081081, 16, 27, 20.0, 25.0, 26.1, 27.0, 4.076236642062355, 1.143106374628181, 1.9545236242701334], "isController": false}, {"data": ["-347", 29, 29, 100.0, 39.41379310344827, 22, 174, 31.0, 74.0, 127.0, 174.0, 4.046323426817358, 0.9048906882238036, 1.9480834467001535], "isController": false}, {"data": ["-302", 38, 0, 0.0, 20.894736842105264, 16, 32, 20.0, 29.1, 31.049999999999997, 32.0, 3.8870703764320784, 1.0906413026800328, 1.8638198777618658], "isController": false}, {"data": ["-346", 29, 0, 0.0, 23.655172413793107, 16, 48, 22.0, 36.0, 45.5, 48.0, 4.0491482826026255, 1.1416863742669645, 1.9613061993856464], "isController": false}, {"data": ["-305", 37, 0, 0.0, 20.918918918918916, 16, 32, 20.0, 27.0, 30.200000000000003, 32.0, 4.078033726441089, 1.152543949079687, 1.9752975862449025], "isController": false}, {"data": ["-349", 29, 0, 0.0, 21.62068965517241, 17, 42, 21.0, 27.0, 37.5, 42.0, 4.065040650406504, 1.1464411182366134, 1.9690040650406504], "isController": false}, {"data": ["-304", 37, 0, 0.0, 24.05405405405405, 16, 145, 20.0, 27.200000000000003, 49.60000000000015, 145.0, 4.077584306810667, 1.1492958934868855, 1.9750798986114173], "isController": false}, {"data": ["-348", 29, 0, 0.0, 21.03448275862069, 16, 43, 20.0, 26.0, 36.5, 43.0, 4.0661805945036456, 1.1577167607263041, 1.9576435870022435], "isController": false}, {"data": ["-310", 37, 0, 0.0, 32.97297297297296, 16, 204, 20.0, 70.80000000000027, 153.60000000000008, 204.0, 4.083434499503366, 1.1577347285067874, 1.9898767727072066], "isController": false}, {"data": ["-354", 29, 0, 0.0, 22.72413793103448, 16, 59, 20.0, 32.0, 47.0, 59.0, 4.048582995951417, 1.1328015932570152, 1.9412639170040484], "isController": false}, {"data": ["-353", 29, 0, 0.0, 22.79310344827586, 16, 58, 21.0, 30.0, 47.0, 58.0, 4.054242974975534, 1.1343852666713268, 1.943977832727527], "isController": false}, {"data": ["-312", 36, 0, 0.0, 133.86111111111114, 116, 207, 122.5, 167.10000000000002, 183.19999999999996, 207.0, 3.93141858687343, 1.9155854127989516, 1.892763050125587], "isController": false}, {"data": ["-311", 37, 0, 0.0, 22.10810810810811, 16, 50, 21.0, 30.80000000000001, 37.40000000000002, 50.0, 4.080732326017426, 1.1534143390867984, 1.9766047204146906], "isController": false}, {"data": ["-350", 29, 0, 0.0, 21.758620689655174, 16, 50, 20.0, 29.0, 42.5, 50.0, 4.063331932184391, 1.145959217808603, 1.9681764046518146], "isController": false}, {"data": ["-352", 29, 0, 0.0, 21.827586206896548, 16, 40, 21.0, 29.0, 34.5, 40.0, 4.056511400195832, 1.1350199765701496, 1.9450655248985873], "isController": false}, {"data": ["-351", 29, 0, 0.0, 21.241379310344826, 16, 37, 21.0, 26.0, 32.0, 37.0, 4.061624649859945, 1.1364506740196079, 1.9475172881652663], "isController": false}, {"data": ["-318", 36, 0, 0.0, 158.05555555555557, 65, 290, 160.0, 243.0, 261.09999999999997, 290.0, 4.083947816222349, 1.1167044809982984, 1.9542328417470223], "isController": false}, {"data": ["-317", 36, 0, 0.0, 31.138888888888893, 16, 60, 29.0, 47.300000000000004, 56.599999999999994, 60.0, 4.204625087596356, 1.5931587245970569, 2.0941003854239666], "isController": false}, {"data": ["-319", 36, 0, 0.0, 293.27777777777777, 160, 1121, 219.0, 514.3000000000013, 835.3999999999995, 1121.0, 3.902016041621504, 114.50666340369607, 4.955213188272274], "isController": false}, {"data": ["-314", 37, 0, 0.0, 25.729729729729726, 16, 149, 20.0, 39.40000000000002, 68.00000000000013, 149.0, 4.081632653061225, 1.132877137341423, 1.9690688775510206], "isController": false}, {"data": ["-319-2", 36, 0, 0.0, 115.02777777777777, 74, 181, 114.0, 130.60000000000002, 161.44999999999996, 181.0, 4.126547455295736, 113.58091274787941, 2.035064907152682], "isController": false}, {"data": ["-313", 37, 0, 0.0, 402.7567567567568, 50, 6138, 68.0, 2089.4, 2565.9000000000055, 6138.0, 3.833005283331607, 1.4074316274733243, 1.7892348881176836], "isController": false}, {"data": ["-319-1", 36, 0, 0.0, 153.63888888888889, 66, 956, 83.0, 311.5000000000017, 689.9499999999996, 956.0, 3.970880211780278, 5.796468260533862, 1.6108003116037943], "isController": false}, {"data": ["-316", 36, 0, 0.0, 25.638888888888882, 16, 147, 20.0, 42.400000000000034, 73.04999999999987, 147.0, 3.9765823483927982, 1.1364283593836297, 1.9494573622003755], "isController": false}, {"data": ["-319-0", 36, 0, 0.0, 24.111111111111104, 14, 60, 18.5, 41.00000000000004, 51.499999999999986, 60.0, 3.9858281665190436, 1.4401918179805138, 1.4791159211691762], "isController": false}, {"data": ["-315", 36, 0, 0.0, 25.611111111111114, 16, 147, 20.0, 39.50000000000002, 66.24999999999986, 147.0, 3.9906883937479214, 1.1381862459815983, 1.905709594280013], "isController": false}, {"data": ["-321", 32, 0, 0.0, 20.96875, 16, 43, 21.0, 26.4, 33.24999999999997, 43.0, 3.922049270743964, 1.0997249969358989, 1.8805919843118029], "isController": false}, {"data": ["-320", 33, 0, 0.0, 20.666666666666664, 16, 51, 20.0, 25.0, 32.799999999999926, 51.0, 3.8878416588124414, 1.0908092674952876, 1.8641897016376061], "isController": false}, {"data": ["-323", 32, 0, 0.0, 24.5, 16, 58, 21.5, 38.7, 48.89999999999997, 58.0, 3.9134156781215608, 1.1053058502507032, 1.895560719090131], "isController": false}, {"data": ["-322", 32, 0, 0.0, 22.468749999999993, 16, 47, 20.5, 33.0, 40.49999999999998, 47.0, 3.9186872397746755, 1.098782298554984, 1.878979916727896], "isController": false}, {"data": ["-340-0", 31, 0, 0.0, 17.93548387096774, 14, 28, 17.0, 23.8, 25.599999999999994, 28.0, 3.9335109757644973, 1.421288145539906, 1.4597013386626063], "isController": false}, {"data": ["-340-2", 31, 0, 0.0, 111.03225806451611, 69, 157, 111.0, 137.2, 155.2, 157.0, 3.8881224131443624, 73.66046931832435, 1.9364672174840085], "isController": false}, {"data": ["-340-1", 31, 0, 0.0, 162.70967741935482, 65, 1092, 80.0, 591.6, 793.1999999999994, 1092.0, 3.9087126465767246, 5.561517896545202, 1.6375368411927878], "isController": false}, {"data": ["-329", 32, 0, 0.0, 22.843750000000004, 16, 45, 20.5, 37.099999999999994, 42.39999999999999, 45.0, 3.8877414651925646, 1.1118171774389503, 1.8565484145304338], "isController": false}, {"data": ["-328", 32, 0, 0.0, 22.750000000000004, 16, 55, 20.0, 34.7, 43.29999999999996, 55.0, 3.8910505836575875, 1.0873519956833657, 1.8771279182879377], "isController": false}, {"data": ["-325", 32, 0, 0.0, 21.531249999999993, 16, 45, 20.0, 28.7, 35.89999999999997, 45.0, 3.909113119960909, 1.1039713382604446, 1.8934766674810652], "isController": false}, {"data": ["-324", 32, 0, 0.0, 21.25, 16, 57, 20.0, 24.7, 37.499999999999936, 57.0, 3.911502261337245, 1.1046460548832662, 1.8946339078352281], "isController": false}, {"data": ["-327", 32, 0, 0.0, 23.218750000000004, 16, 60, 21.0, 34.4, 46.99999999999996, 60.0, 3.898635477582846, 1.0931598745126705, 1.869365253411306], "isController": false}, {"data": ["-326", 32, 0, 0.0, 22.218750000000004, 17, 39, 20.5, 34.8, 37.699999999999996, 39.0, 3.9057732210423532, 1.1030281185158062, 1.8918589039423899], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 59, 100.0, 2.880859375], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2048, 59, "400/Bad Request", 59, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["-343", 30, 30, "400/Bad Request", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["-347", 29, 29, "400/Bad Request", 29, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
