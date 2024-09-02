import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { history, store } from 'redux/store';
import { Row, Col, Input, Button, Table, Space, Card, Select, Switch, Form } from 'antd';
import { SearchOutlined, FilterOutlined,DeleteOutlined, EditOutlined, DownloadOutlined } from '@ant-design/icons';
import { formProps } from '../../../helpers/constant';
import settingsAction from '../../../redux/admin/application/actions';
// import './../../../assets/css/dashboard.scss';
import "./../../../assets/css/adminStyle.css";
import format from 'date-fns/format';
const { Option } = Select;
const { Column, ColumnGroup } = Table;

const ApplicationManagement = () => {
  
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { applications } = useSelector((state) => state.Applications);
  const [showFilter, setshowFilter] = useState(false);
  const columns = [
    {
      title: '#',
      dataIndex: 'row',
      key: 'row',      
    },
    {
      title: 'Application No',
      dataIndex: 'applicationno',
      key: 'applicationno',      
    },
    {
      title: 'Date',
      dataIndex: 'applicationdate',
      key: 'applicationdate',
      render: applicationdate => <span>{format(new Date(applicationdate), 'dd/MM/yyyy hh:mm:ss')}</span>
    },
    {
      title: 'Name',
      dataIndex: 'applicantname',
      key: 'applicantname',      
    }, 
    {
      title: 'Email',
      dataIndex: 'applicantemail',
      key: 'applicantemail',
      
    },   
   
    {
      title: 'Status',
      dataIndex: 'applicationstatus',
      key: 'applicationstatus',   
      render: applicationstatus => <a>{applicationstatus == 1 ? 'Completed' : (applicationstatus == 2 ? 'Booked' : 'Cancelled')}</a>
    }, 
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',   
      render: (id, record) => (<span><Button shape="circle" icon={<EditOutlined />} onClick={()=>handleEditApplication(record)} type="edit"></Button> <Button shape="circle" icon={<DeleteOutlined />} onClick={()=>handleDeleteApplication(record.id)} type="remove"></Button></span>)  
    }, 
  ];  
 
  const handleDeleteApplication = request_id => {
    dispatch({
      type: settingsAction.REMOVE_APPLICATION_DETAILS,
      payload: { "id": request_id},
    }); 
  }

  const handleEditApplication = edit => {
    history.push("applicationedit", {state: { id: edit.id}})
    // dispatch({
    //   type: settingsAction.GET_APPLICATION_INFO,
    //   payload: {
    //     "id": edit.id,
    //     "applicationstatus": 3
    //   },
    // }); 
  }
  const onFormLayoutChange = (values) => {
    // setComponentSize(size);
    const { applicationno, applicationstatus} = usedForm.getFieldsValue();
    const payload = {
      applicationno: applicationno !== undefined ? applicationno : "",
      applicationstatus: applicationstatus !== undefined ? applicationstatus : ""
    }    
    dispatch({
      type: settingsAction.GET_APPLICATION_INFO,
      payload: payload,
    });
  };

  const handleFilterShow = () => {
    setshowFilter(!showFilter)
  }
 
  useEffect(() => {   
    let initialValue = {
      applicationid: "",
      applicationno: "",
      applicantname: "",
      applicantemail:"",
      applicationstatus:0
    } 
    dispatch({
        type: settingsAction.GET_APPLICATION_INFO,
        payload: initialValue,
    });    
  }, []);

  return (
    <div className={"page-container"}>
      <Row>
        <Col offset={3} xs={22} md={22} lg={22} className="dashboard-content mg-auto">
          <Row>
            <Col span={8}> <Space>
              <h2>Applications Detail</h2>
            </Space></Col>
            <Col span={8} offset={8}>
              <Space style={{ marginBottom: 16 }}>               
              <Button onClick={handleFilterShow} type="primary" icon={<DownloadOutlined />}>Export</Button>
                <Button onClick={handleFilterShow} type="primary" icon={<FilterOutlined />}>Filter</Button>
               
              </Space>
            </Col>
          </Row>
         {showFilter &&  <Row>
            <Col offset={20} className="dashboard-content mg-auto">
            <div className="dashboard-form">
              <Form
                {...formProps}
                layout="horizontal"
                form={usedForm}
                onValuesChange={()=> onFormLayoutChange()}
              >

                <Row gutter={20}>
                  <Col span={6} className="inner-content">
                    <Form.Item
                      label={'Application No'}
                      name="applicationno"
                      rules={
                        [
                          {
                            required: true,
                            message: 'Fields are requireds',
                          },
                        ]
                      }
                    >
                      <Input placeholder="" />
                    </Form.Item>
                  </Col>
                  <Col span={6} className="inner-content">
                    <Form.Item
                      label={'Status'}
                      name={'applicationstatus'}
                    >
                      <Select
                        showSearch
                        allowClear
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder={''}
                        dropdownStyle={{ minWidth: '200px' }}
                      >
                        <Option value={1}>Approved</Option>
                        <Option value={2}>Pending</Option>
                        <Option value={3}>Rejected</Option>
                        {/* {carinformation.brand && carinformation.brand.map(value => {
                          return (
                            <Option key={value.id} value={value.id}>
                              {value.carbrandname}
                            </Option>
                          );
                        })} */}
                      </Select>
                    </Form.Item>
                  </Col>                  
                </Row>
              </Form>
            </div>
            </Col>
          </Row>}

          <Table columns={columns} dataSource={applications} />
        </Col>
      </Row>
    </div>

  );
}


export default ApplicationManagement;