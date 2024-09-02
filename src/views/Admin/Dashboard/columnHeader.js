// import { useDispatch, useSelector } from 'react-redux';
// import { history, store } from 'redux/store';
// import { Row, Col, Input, Button, Table, Space, Card, Select, Switch, Form, Typography } from 'antd';
// import { SearchOutlined, FilterOutlined,DeleteOutlined, EyeOutlined } from '@ant-design/icons';


// const viewBooking = id => {
//   history.push({
//     pathname: 'bookingdetails',
//     state: id
//   })
// }

// const handleChangeStatus = (id, event) => {
//   dispatch({
//     type: settingsAction.CHANGE_BOOKING_STATUS,
//     payload: {id: id, status: event},
//   });
// }
// const tableHeader = {
//      bookingHeader: [
//         {
//           title: '#',
//           dataIndex: 'id',
//           key: 'id',   
//           render: (id, data, idx) => <span>{idx+1}</span>   
//         },
//         {
//           title: 'Booking No',
//           dataIndex: 'bookingno',
//           key: 'bookingno',      
//         },
//         {
//           title: 'Booking Date',
//           dataIndex: 'bookingdate',
//           key: 'bookingdate',
//           render: bookingdate => <span>{format(new Date(bookingdate), 'dd/MM/yyyy hh:mm:ss')}</span>
//         },
//         {
//           title: 'Deposit',
//           dataIndex: 'deposit',
//           key: 'deposit',      
//         }, 
//         {
//           title: 'Price per day',
//           dataIndex: 'priceperday',
//           key: 'priceperday',
          
//         },
//         {
//           title: 'Total rental days (SAR)',
//           dataIndex: 'totalrentaldays',
//           key: 'totalrentaldays',      
//         },  
//         {
//           title: 'Total Amount (SAR)',
//           dataIndex: 'totalcost',
//           key: 'totalcost',      
//         },
       
       
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',   
//       render: (id, status) => status.status == 0 ? <span>Cancelled</span> :
//    <Select
//       showSearch
//       onChange={(e)=>handleChangeStatus(status.id, e)}
//       defaultValue={[status.status]}
//       allowClear
//       optionFilterProp="children"
//       filterOption={(input, option) =>
//         option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//       }
//       autoComplete={'off'}
//       placeholder={'Status'}
//       dropdownStyle={{ minWidth: '200px' }}
//     >
//       <Option key={2} value={2}>Pending</Option>
//       <Option key={1} value={1}>Booked</Option>
//       <Option key={3} value={3}>Completed</Option>
//       <Option key={0} value={0}>Cancel</Option>     

//     </Select> 
//   },
//   {
//     title: "Action",
//     dataIndex: "id",
//     key: "id",
//     render: (id, record) => 
        
//         <Button
//           shape="circle"
//           icon={<EyeOutlined />}
//           onClick={() => viewBooking(record.id)}
//           type="edit"
//         />
//   },
//       ],

//       carHeader: [
//         {
//           title: '#',
//           dataIndex: 'id',
//           key: 'id',  
//           render: (id, data, idx) => <span>{idx+1}</span>      
//         },
//         {
//           title: 'Car No',
//           dataIndex: 'carno',
//           key: 'carno',      
//         },
       
//         {
//           title: 'Brand',
//           dataIndex: 'carbrand',
//           key: 'carbrand',      
//         }, 
//         {
//           title: 'Model',
//           dataIndex: 'carmodel',
//           key: 'carmodel',
          
//         },
//         {
//           title: 'Year',
//           dataIndex: 'caryear',
//           key: 'caryear',      
//         },  
//         {
//           title: 'Price Per Day (SAR)',
//           dataIndex: 'carpriceperday',
//           key: 'carpriceperday',      
//         },
//         {
//           title: 'Deposit (SAR)',
//           dataIndex: 'cardeposite',
//           key: 'cardeposite',      
//         }, 
//         // {
//         //   title: 'Action',
//         //   dataIndex: 'caraction',
//         //   key: 'caraction',   
//         //   render: (caraction, record) => (<span><Button shape="circle" icon={<EditOutlined />} onClick={()=>handleEditCar(record.carid)} type="edit"></Button> <Button shape="circle" icon={<DeleteOutlined />} onClick={()=>handleDeleteCar(record.carid)} type="remove"></Button></span>)  
//         // }, 
//       ]
//     }

//     export default tableHeader;