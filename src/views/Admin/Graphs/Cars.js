import React, { useState, useEffect } from "react";
import "./../../../assets/css/adminStyle.css";
import ReactApexChart from "react-apexcharts";
import { getLocaleMessages } from "redux/helper";
const PieChart = (props) => {
  const { chartdata, carcount, pietype } = props;
  const [seriesdata, setSeriesdata] = useState([]);
  const [options, setoptions] = useState({
    colors: ["#3e3e3e", "#b7a57b"],
    legend: {
      position: "bottom",
    },
    labels: [
      getLocaleMessages("Total Cars"),
      getLocaleMessages("Booked Cars"),
      getLocaleMessages("Available Cars"),
    ],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 400,
          },
        },
      },
    ],
  });

  const count = (card) => {
    let result = carcount && carcount.filter((data) => data.name == card);
    const { count } = result.length > 0 && result[0];
    return count ? count : 0;
  };

  useEffect(() => {
    if (carcount) {
      var data = [];
      if (pietype == 1) {
        data.push(count("car"));
        data.push(count("car") - count("available"));
        setoptions({
          ...options,
          labels: [
            getLocaleMessages("Total Cars"),
            getLocaleMessages("Booked Cars"),
          ],
        });
      }
      if (pietype == 2) {
        data.push(count("car"));
        data.push(count("car") - count("available"));
        setoptions({
          ...options,
          labels: [
            getLocaleMessages("Total Cars"),
            getLocaleMessages("Available Cars"),
          ],
        });
      }
      setSeriesdata(data);
    }
  }, [carcount]);

  return (
    <div>
      {seriesdata && (
        <ReactApexChart
          options={options}
          series={seriesdata}
          type="donut"
          width={400}
          height={300}
        />
      )}
    </div>
  );
};

export default PieChart;
