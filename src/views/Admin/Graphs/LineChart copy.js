import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';
import { getLocaleMessages } from 'redux/helper';
class ApexChart extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        series: [{
          name: getLocaleMessages("Completed"),
          type: 'column',
          data: [13, 15, 14, 110, 10, 17, 20]
        }, {
          name: getLocaleMessages('Pending'),
          type: 'column',
          data: [2, 6, 1, 4, 7, 6, 57]
        },{
          name: getLocaleMessages('Cancelled'),
          type: 'column',
          data: [5, 42, 45, 17, 43, 12, 7]
        }],
        options: {
          chart: {
            height: 350,
            type: 'line',
          },
          stroke: {
            width: [0, 4]
          },
          title: {
            text: getLocaleMessages('Total Booking')
          },
          dataLabels: {
            enabled: true,
            enabledOnSeries: [1]
          },
          labels: ['01 Aug 2021', '02 Aug 2021', '03 Aug 2021', '04 Aug 2021', '05 Aug 2021', '06 Aug 2021', '07 Aug 2021'],
          xaxis: {
            type: 'datetime'
          },
          yaxis: [{
            title: {
              text: getLocaleMessages('Net Revenue'),
            },          
          }, {
            opposite: true,
            title: {
              text: ''
            }
          }]
        },      
      };
    }  

    Chartfun = (values) => {
      values !== undefined &&
      values == 2 ? 
        this.setState({ series: [{
          name: getLocaleMessages('Completed'),
          type: 'column',
          data: [130, 150, 140, 110, 100, 180, 200]
          }, {
          name: getLocaleMessages('Pending'),
          type: 'column',
          data: [25, 36, 15, 34, 37, 26, 17]
          },{
          name: getLocaleMessages('Cancelled'),
          type: 'column',
          data: [25, 36, 15, 34, 37, 26, 17]
        }],
        labels: ['01 Aug 2021', '02 Aug 2021', '03 Aug 2021', '04 Aug 2021', '05 Aug 2021', '06 Aug 2021', '07 Aug 2021']
        })
      :
      this.setState({ series: [{
        name: getLocaleMessages('Completed'),
        type: 'column',
        data: [253]
        }, {
        name: getLocaleMessages('Pending'),
        type: 'column',
        data: [123]
        },{
        name: getLocaleMessages('Cancelled'),
        type: 'column',
        data: [12]
      }],
      labels: ['04 Aug 2021']
      })   
    } 

    componentDidMount(){
      this.Chartfun(this.props.chartdata);
    }
    componentWillReceiveProps(nextProps) {
     this.Chartfun(nextProps.chartdata);
    }
    render() {
      return (
        <div id="chart">
          <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={350} />
        </div>
      );
    }
  }

  export default ApexChart;

