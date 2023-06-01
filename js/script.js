//Retrieving data from API
let USERNAME = "api-test-user-5@tectio.com";
let PASSWORD = "4FmfMGqPO9b4";

$.ajax({
  type: "GET",
  url: "https://dev.app.tectio.net/rest/0.1/unit/e661640843792f2d/sensor/3,50,60/history?start=2023-05-28T17%3A53%3A44.344Z&end=2023-05-28T18%3A53%3A44.344Z",
  dataType: "json",
  headers: {
    Authorization: "Basic " + btoa(USERNAME + ":" + PASSWORD),
  },
  success: function (data) {
    var chartData = getChartData();

    // ... Chart configuration ...
    var chart = AmCharts.makeChart("chartdiv", {
      type: "serial",
      theme: "light",
      marginRight: 80,
      autoMarginOffset: 20,
      marginTop: 150,
      dataProvider: chartData,
      valueAxes: [
        {
          axisAlpha: 0.2,
          dashLength: 1,
          position: "left",
        },
      ],
      mouseWheelZoomEnabled: true,
      // Define graphs and their properties
      graphs: [
        {
          id: "g1",
          balloonFunction: (graphDataItem) =>
            getTrimmedValue(graphDataItem, "C"),
          title: "Blue Line",
          valueField: "temp",
          bullet: "round",
          bulletBorderAlpha: 1,
          bulletColor: "#FFFFFF",
          hideBulletsCount: 50,
          useLineColorForBulletBorder: true,
        },
        {
          id: "g2",
          balloonFunction: (graphDataItem) =>
            getTrimmedValue(graphDataItem, "A"),
          title: "Yellow line",
          valueField: "unit",
          bullet: "round",
          bulletBorderAlpha: 1,
          bulletColor: "#FFFFFF",
          hideBulletsCount: 50,
          useLineColorForBulletBorder: true,
        },
        {
          id: "g3",
          balloonFunction: (graphDataItem) =>
            getTrimmedValue(graphDataItem, "V"),
          title: "Green line",
          valueField: "volt",
          bullet: "round",
          bulletBorderAlpha: 1,
          bulletColor: "#FFFFFF",
          hideBulletsCount: 50,
          useLineColorForBulletBorder: true,
        },
      ],

      chartScrollbar: {
        autoGridCount: true,
        graph: "g1",
        scrollbarHeight: 40,
      },
      chartCursor: {
        limitToGraph: "g3",
      },
      categoryField: "date",
      categoryAxis: {
        parseDates: true,
        axisColor: "#DADADA",
        dashLength: 1,
        minorGridEnabled: true,
        gridCount: 10,
        minPeriod: "ss",
        fontSize: 10,
      },
    });

    chart.addListener("rendered", zoomChart);
    zoomChart();

    function zoomChart() {
      chart.zoomToIndexes(chartData.length - 40, chartData.length - 1);
    }

    // Function to retrieve chart data from the fetched JSON data
    function getChartData() {
      var chartData = [];
      const dates = data.data[0];
      const tempratures = data.data[1];
      const units = data.data[2];
      const voltages = data.data[3];

      for (let i = 0; i < dates.length; i++) {
        chartData.push({
          date: dates[i],
          temp: tempratures[i],
          unit: units[i],
          volt: voltages[i],
        });
      }

      return chartData;
    }

    // Function to get the trimmed value for balloon tooltip
    function getTrimmedValue(graphDataItem, unit) {
      var value = graphDataItem.values.value;
      var trimmedValue = value.toFixed(3);
      return trimmedValue + " " + unit;
    }
  },
  error: function (xhr, status, error) {
    console.log("An error occurred: " + error);
  },
});
