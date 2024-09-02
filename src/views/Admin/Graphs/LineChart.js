import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = (props) => {
  const {booking} = props;
  return (
    <div id="chart">
      <ReactApexChart options={booking.options} series={booking.series} type="bar" height={350} />
    </div>
  );
}

export default ApexChart;


