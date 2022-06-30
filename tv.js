<
!DOCTYPE html >
    <
    html lang = "en" >

    <
    head >

    <
    meta charset = "UTF-8" >

    <
    link rel = "apple-touch-icon"
type = "image/png"
href = "https://cpwebassets.codepen.io/assets/favicon/apple-touch-icon-5ae1a0698dcc2402e9712f7d01ed509a57814f994c660df9f7a952f3060705ee.png" / >
    <
    meta name = "apple-mobile-web-app-title"
content = "CodePen" >

    <
    link rel = "shortcut icon"
type = "image/x-icon"
href = "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico" / >

    <
    link rel = "mask-icon"
type = "image/x-icon"
href = "https://cpwebassets.codepen.io/assets/favicon/logo-pin-8f3771b1072e3c38bd662872f6b673a722f4b3ca2421637d5596661b4e2132cc.svg"
color = "#111" / >


    <
    title > CodePen - Stock Price Widget < /title>


<
link rel = 'stylesheet'
href = 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css' >

    <
    style >
    @import url('https://fonts.googleapis.com/css?family=Mina|Open+Sans');

.page - header {
    font - family: 'Mina', sans - serif;
    width: 600 px;
}

#
dateButtonGroup {
    position: relative;
    left: 100 px;
}

h1, h2, h3, h4 {
    display: inline;
}

.loss {
    color: red;
}

.gain {
    color: green;
} <
/style>

<
script >
    window.console = window.console || function(t) {}; <
/script>



<
script >
    if (document.location.search.match(/type=embed/gi)) {
        window.parent.postMessage("resize", "*");
    } <
    /script>


    <
    /head>

    <
body translate = "no" >
    <
    div ng - app = "stockPriceWidget"
ng - controller = "MainCtrl as c" >
    <
    div class = "container"
ng - show = "c.dataSet" >
    <
    div class = "row" >
    <
    div class = "col-md-12" >
    <
    div class = "page-header" >
    <
    h1 > < strong ng - bind = "c.symbol" > < /strong> <
h2 ng - bind = "c.currentClosingPrice + ' '" >
    <
    h3 ng - bind = "'USD '" > < /h3> <
h3 ng - class = "{loss : c.gainLoss < 0, gain : c.gainLoss > 0}"
ng - bind = "c.gainLoss > 0 ? '+' + c.gainLoss : c.gainLoss" > < /h3> < /
    h2 > <
    /h1> <
div class = "btn-group btn-group-xs"
role = "group"
id = "dateButtonGroup"
aria - label = "..." >
    <
    button type = "button"
class = "btn btn-default"
ng - click = "c.setDataRange(10)" > 10 Days < /button> <
button type = "button"
class = "btn btn-default"
ng - click = "c.setDataRange(30)" > 1 Month < /button> <
button type = "button"
class = "btn btn-default"
ng - click = "c.setDataRange(90)" > 3 Months < /button> < /
    div > <
    /div> < /
    div > <
    div class = "col-md-12" >
    <
    canvas id = "myChart"
width = "600px"
height = "440px" > < /canvas> < /
    div > <
    /div> < /
    div > <
    /div> <
script src = "https://cpwebassets.codepen.io/assets/common/stopExecutionOnTimeout-1b93190375e9ccc259df3a57c1abc0e64599724ae30d7ea4c6877eb615f89387.js" > < /script>

<
script src = 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.21.0/moment.js' > < /script> <
script src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.js' > < /script> <
script src = 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.9/angular.js' > < /script> <
script src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js' > < /script> <
script src = 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js' > < /script> <
script id = "rendered-js" >
    (function() {
        angular.
        module("stockPriceWidget", []).
        controller("MainCtrl", ["$http", "alphavantage", "chart",
            function($http, alphavantage, chart) {
                var vm = this;
                vm.symbol = "TSLA";
                vm.timeInterval = "days";
                vm.timeIntervalValue = 90;

                vm.setDataRange = function(numberOfDays) {
                    chart.update(vm.dataSet, vm.timeInterval, numberOfDays);
                };


                function getData() {
                    alphavantage.getDailyDataSet(vm.symbol).
                    then(response => {
                        vm.dataSet = response;
                        chart.renderChart(vm.dataSet, vm.timeInterval, vm.timeIntervalValue);
                        vm.currentClosingPrice = parseFloat(alphavantage.getCurrentClosingPrice(vm.dataSet, "Daily")).toFixed(2);
                        vm.gainLoss = alphavantage.calculateGainLoss(vm.dataSet, "Daily");
                    });
                }

                getData();

            }
        ]).

        constant("APIKEY", "9V66ST5SY883CWI1").
        factory("alphavantage", ["$http", "APIKEY", function($http, APIKEY) {

            var _latestDate;
            var _currentClosingPrice;

            function getDailyDataSet(symbol) {
                return $http.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + symbol + "&apikey=" + APIKEY).
                then(response => {
                    return response.data;
                });
            }

            function getInterDayDataSet(symbol) {
                return $http.get("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + symbol + "&interval=1min&apikey=" + APIKEY).
                then(response => {
                    return response.data;
                });
            }

            function getLatestDate(dataSet, timeInterval) {
                _latestDate = moment();
                var dates = Object.keys(dataSet["Time Series (" + timeInterval + ")"]).map(d => moment(d));
                dates.forEach((date, i, a) => {
                    _latestDate = i === 0 || date.isAfter(_latestDate) ? date : _latestDate;
                });
                return _latestDate;
            }

            function getCurrentClosingPrice(dataSet, timeInterval) {
                var latest = getLatestDate(dataSet, timeInterval);
                _currentClosingPrice = dataSet["Time Series (" + timeInterval + ")"][latest.format("YYYY-MM-DD")]["4. close"];
                return _currentClosingPrice;
            }

            function calculateGainLoss(dataSet, timeInterval) {
                //var currentClosingPrice = getCurrentClosingPrice(dataSet, timeInterval);
                var previousClosingPrice =
                    dataSet["Time Series (" + timeInterval + ")"][_latestDate.subtract(1, "days").format("YYYY-MM-DD")]["4. close"];
                return parseFloat(_currentClosingPrice - previousClosingPrice).toFixed(2);
            }

            return {
                getDailyDataSet: getDailyDataSet,
                getInterDayDataSet: getInterDayDataSet,
                getCurrentClosingPrice: getCurrentClosingPrice,
                calculateGainLoss: calculateGainLoss
            };

        }]).
        factory("dataSetFormatter", [function() {
            function format(dataSet, dayMonthYear, value) {
                var formattedDataSet = {};
                formattedDataSet.closingValues = [];
                formattedDataSet.openingValues = [];
                formattedDataSet.highValues = [];
                formattedDataSet.lowValues = [];

                //get an array of all the dataSet date keys
                var dates = Object.keys(dataSet).map(d => moment(d));
                for (var i = dates.length - 1; i >= 0; i--) {
                    if (window.CP.shouldStopExecution(0)) break;
                    if (!dates[i].isSameOrAfter(moment().subtract(value, dayMonthYear))) {
                        dates.splice(i, 1);
                    }
                }

                //now that we have a set of dates to target, we can iterate
                //over the new date set grabbing the corresponding objects in dataSet
                //and populating formattedDataSet
                window.CP.exitedLoop(0);
                dates.forEach(d => {
                    var closingObj = {};
                    closingObj.x = d;
                    closingObj.y = dataSet[d.format("YYYY-MM-DD")]["4. close"];
                    formattedDataSet.closingValues.push(closingObj);
                    var openingObj = {};
                    openingObj.x = d;
                    openingObj.y = dataSet[d.format("YYYY-MM-DD")]["1. open"];
                    formattedDataSet.openingValues.push(openingObj);
                    var highObj = {};
                    highObj.x = d;
                    highObj.y = dataSet[d.format("YYYY-MM-DD")]["2. high"];
                    formattedDataSet.highValues.push(highObj);
                    var lowObj = {};
                    lowObj.x = d;
                    lowObj.y = dataSet[d.format("YYYY-MM-DD")]["3. low"];
                    formattedDataSet.lowValues.push(lowObj);
                });
                return formattedDataSet;
            }

            return {
                format: format
            };

        }]).
        factory("chart", ["dataSetFormatter", function(dataSetFormatter) {
            var priceChart;

            function update(dataSet, timeInterval, timeIntervalValue) {
                var formattedDataSet = dataSetFormatter.format(dataSet["Time Series (Daily)"], timeInterval, timeIntervalValue);
                priceChart.data.datasets[0].data = formattedDataSet.closingValues;
                priceChart.data.datasets[1].data = formattedDataSet.openingValues;
                priceChart.data.datasets[2].data = formattedDataSet.highValues;
                priceChart.data.datasets[3].data = formattedDataSet.lowValues;
                priceChart.update();
            }

            function renderChart(dataSet, timeInterval, timeIntervalValue) {
                var formattedDataSet = dataSetFormatter.format(dataSet["Time Series (Daily)"], timeInterval, timeIntervalValue);
                //var formattedDataSet = getChartData(vm.dataSet["Time Series (Daily)"]);
                Chart.defaults.global.defaultFontFamily = "'Open Sans', sans-serif";
                var ctx = document.getElementById("myChart").getContext("2d");
                priceChart = new Chart(ctx, {
                    type: "line",
                    data: {
                        datasets: [{
                                label: "Closing Value",
                                data: formattedDataSet.closingValues,
                                borderColor: ["blue"],
                                borderWidth: 1,
                                fill: false
                            },

                            {
                                label: "Opening Value",
                                data: formattedDataSet.openingValues,
                                borderColor: ["red"],
                                borderWidth: 1,
                                fill: false
                            },

                            {
                                label: "High",
                                data: formattedDataSet.highValues,
                                borderColor: ["green"],
                                borderWidth: 1,
                                fill: false
                            },

                            {
                                label: "Low",
                                data: formattedDataSet.lowValues,
                                borderColor: ["orange"],
                                borderWidth: 1,
                                fill: false
                            }
                        ]
                    },



                    options: {
                        responsive: false,
                        scales: {
                            xAxes: [{
                                type: "time",
                                time: {
                                    displayFormats: {
                                        month: "MMM YYYY"
                                    }
                                }
                            }]
                        }
                    }
                });


            }
            return {
                renderChart: renderChart,
                update: update
            };

        }]);
    })();
//# sourceURL=pen.js
<
/script>



<
/body>

<
/html>