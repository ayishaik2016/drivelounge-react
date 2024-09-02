import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { getLocaleMessages } from "redux/helper";
import moment from "moment";
const ApexChart = (props) => {
  const [Days, setDays] = useState([]);
  const [series, setseries] = useState({
    series: [
      {
        name: "series1",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
      {
        name: "series2",
        data: [11, 32, 45, 32, 34, 52, 41],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "category",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z",
        ],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    },
  });
  const [numdays, setnumdays] = useState([]);
  useEffect(() => {
    const response = props?.booking;
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const days_ = [
      "Monday",
      "Tuesday",
      "Wednedday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    var today = new Date();
    var daysSorted = [];
    var day = [];
    for (var i = 0; i < 7; i++) {
      var newDate = new Date(today.setDate(today.getDate() - 1));
      daysSorted.push(days[newDate.getDay()]);
      day.push(days_[newDate.getDay()]);
    }
    // setDays(daysSorted.reverse());

    const reverseday = day.reverse();
    let total = [];
    let completed = [];
    let pending = [];
    let cancelled = [];
    reverseday.forEach((_day) => {
      let total_count = 0;
      let completed_count = 0;
      let pending_count = 0;
      let cancelled_count = 0;
      response?.map((item) => {
        if (item.dayname == _day) {
          total_count += 1;
          if (item.status == 1) {
            completed_count += 1;
          }
          if (item.status == 0) {
            cancelled_count += 1;
          }
          if (item.status == 3 || item.status == 2) {
            pending_count += 1;
          }
        }
      });
      total.push(total_count);
      completed.push(completed_count);
      pending.push(pending_count);
      cancelled.push(cancelled_count);
    });

    let data = {
      series: [
        {
          name: getLocaleMessages("Total Booking"),
          data: total.reverse(),
        },
        {
          name: getLocaleMessages("Completed"),
          data: completed.reverse(),
        },
        {
          name: getLocaleMessages("Pending"),
          data: pending.reverse(),
        },
        {
          name: getLocaleMessages("Cancelled"),
          data: cancelled.reverse(),
        },
      ],
      options: {
        chart: {
          height: 350,
          type: "area",
          toolbar: {
            show: true,
            offsetX:
              props.subLang !== undefined
                ? props.subLang === "en"
                  ? 0
                  : -400
                : 0,
            offsetY: 0,
          },
          zoom: {
            enabled: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        xaxis: {
          type: "category",
          categories: daysSorted.reverse(),
          title: {
            text: getLocaleMessages("Last week bookings"),
            align: "right",
          },
        },
        legend: {
          position: "top",
          offsetY: 2,
          horizontalAlign: "left",
        },
        tooltip: {
          x: {
            format: "dd/MM/yy HH:mm",
          },
        },
      },
    };
    setseries(data);
  }, [props]);

  return (
    <div id="chart">
      <ReactApexChart
        options={series.options}
        series={series.series}
        type="area"
        height={350}
      />
    </div>
  );
};

export default ApexChart;
