import React, { useState, useEffect } from 'react';
import "./../../../assets/css/adminStyle.css";
import ReactApexChart from 'react-apexcharts';
import dashboardActions from "./../../../redux/admin/dashboard/actions";
import { useDispatch, useSelector } from "react-redux";
import { getLocaleMessages } from 'redux/helper';
const PieChart = (props) => {
    const { chartdata } = props;
    const [seriesdata,setSeriesdata] = useState([1, 15, 100]);
    const dispatch = useDispatch();
    const { subLang, loader } = useSelector((state) => state.Auth);
    const {piechartcount } = useSelector((state) => state.Dashboard);
    const [options, setoptions] = useState({
      colors : ['#58ffff', '#b7a57b'],
      legend: {
        position: 'bottom'
      },
      labels: [getLocaleMessages('Total Booking'), getLocaleMessages('Booked')],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 400
          },
          legend: {
            position: 'top'
          }
        }
      }]
    })
     

    useEffect(() => {
      chartdata !== undefined && chartdata == 1 ? setSeriesdata([150, 100]) : setSeriesdata([250, 80])      
        dispatch({
          type: dashboardActions.GET_DASHBOARD_PIE_COUNTS,
          payload: {type: chartdata == undefined ? 1 : chartdata},
        });   
    },[chartdata]); 

    useEffect(() => {
      
    }, [])

    useEffect(() => {
      var data = []
      if(piechartcount.length){
        if(props.pietype == 1){
          data.push(piechartcount[0].total)
          data.push(piechartcount[0].upcoming);
          setoptions({...options,labels: [getLocaleMessages('Total Booking'), getLocaleMessages('Upcoming')]}) 
        }
        if(props.pietype == 2){
          data.push(piechartcount[0].total)
          data.push(piechartcount[0].booking);
          setoptions({...options,labels: [getLocaleMessages('Total Booking'), getLocaleMessages('Booked')]})
        }
        if(props.pietype == 3){
          data.push(piechartcount[0].total)
          data.push(piechartcount[0].cancel);
          setoptions({...options,labels: [getLocaleMessages('Total Booking'), getLocaleMessages('Cancelled')]})
        }  
      }
      setSeriesdata(data)
    }, [piechartcount])

  return (
   <div>
        <ReactApexChart options={options} series={seriesdata} type="pie" width={400} height={300} />
   </div>

  );
}


export default PieChart;