import format from 'date-fns/format';
const tableHeader = {
     bookingHeader: [
        {
          title: '#',
          dataIndex: 'id',
          key: 'id',   
          render: (id, data, idx) => <span>{idx+1}</span>   
        },
        {
          title: 'Booking No',
          dataIndex: 'bookingno',
          key: 'bookingno',      
        },
        {
          title: 'Booking Date',
          dataIndex: 'bookingdate',
          key: 'bookingdate',
          render: bookingdate => <span>{format(new Date(bookingdate), 'dd/MM/yyyy hh:mm:ss')}</span>
        },
        {
          title: 'Deposit',
          dataIndex: 'deposit',
          key: 'deposit',      
        }, 
        {
          title: 'Price per day (SAR)',
          dataIndex: 'priceperday',
          key: 'priceperday',
          
        },
        {
          title: 'Total rental days',
          dataIndex: 'totalrentaldays',
          key: 'totalrentaldays',      
        },  
        {
          title: 'Total Amount (SAR)',
          dataIndex: 'totalcost',
          key: 'totalcost',      
        },
       
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',   
          render: status => <a>{status == 3 ? 'Delivered' : (status == 1 ? 'Accepted' : 'Pending')}</a>
        }, 
      ],

      carHeader: [
        {
          title: '#',
          dataIndex: 'id',
          key: 'id',  
          render: (id, data, idx) => <span>{idx+1}</span>      
        },
        {
          title: 'Car No',
          dataIndex: 'carno',
          key: 'carno',      
        },
       
        {
          title: 'Brand',
          dataIndex: 'carbrand',
          key: 'carbrand',      
        }, 
        {
          title: 'Model',
          dataIndex: 'carmodel',
          key: 'carmodel',
          
        },
        {
          title: 'Year',
          dataIndex: 'caryear',
          key: 'caryear',      
        },  
        {
          title: 'Price Per Day',
          dataIndex: 'carpriceperday',
          key: 'carpriceperday',      
        },
        {
          title: 'Deposit',
          dataIndex: 'cardeposite',
          key: 'cardeposite',      
        }, 
        // {
        //   title: 'Action',
        //   dataIndex: 'caraction',
        //   key: 'caraction',   
        //   render: (caraction, record) => (<span><Button shape="circle" icon={<EditOutlined />} onClick={()=>handleEditCar(record.carid)} type="edit"></Button> <Button shape="circle" icon={<DeleteOutlined />} onClick={()=>handleDeleteCar(record.carid)} type="remove"></Button></span>)  
        // }, 
      ]
    }

    export default tableHeader;