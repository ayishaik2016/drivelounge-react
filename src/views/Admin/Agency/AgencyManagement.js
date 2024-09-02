import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { history, store } from 'redux/store';
import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Space,
  Card,
  Select,
  Switch,
  Form,
  Typography,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { formProps } from '../../../helpers/constant';
import settingsAction from '../../../redux/admin/agency/actions';
import './../../../assets/css/adminStyle.css';
import format from 'date-fns/format';
const { Option } = Select;
const { Column, ColumnGroup } = Table;
const { Title } = Typography;
const AgentManagement = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const { agency_data } = useSelector((state) => state.Agency);
  const [agentStatus, setagentStatus] = useState(0);
  const [cardata, setcardata] = useState([]);
  const [showFilter, setshowFilter] = useState(false);
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (id, data, idx) => <span>{idx + 1}</span>,
    },
    {
      title: 'Name',
      dataIndex: 'username',
      key: 'username',
    },

    {
      title: 'Email ',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Contact',
      dataIndex: 'contactnumber',
      key: 'contactnumber',
    },
    {
      title: 'Status',
      dataIndex: 'agentstatus',
      key: 'agentstatus',
      render: (id, status) => (
        <Select
          showSearch
          onChange={(e) => handleChangeStatus(status.id, e)}
          defaultValue={[status.agentstatus]}
          allowClear
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          autoComplete={'off'}
          placeholder={'Status'}
          dropdownStyle={{ minWidth: '200px' }}
        >
          <Option key={1} value={1}>
            Approved
          </Option>
          <Option key={2} value={2}>
            Rejected
          </Option>
          <Option key={3} value={3}>
            Pending
          </Option>
        </Select>
      ),
    },
    {
      title: 'Created Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (created_at) => (
        <span>{format(new Date(created_at), 'dd/MM/yyyy hh:mm')}</span>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'status',
      key: 'status',
      render: (status, data, idx) => (
        <span>
          <Button
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => handleAgentEdit(data.id)}
            type="edit"
          ></Button>{' '}
          <Button
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => handleAgentDelete(data.id)}
            type="remove"
          ></Button>
        </span>
      ),
    },
  ];

  const handleAgentEdit = (id) => {
    history.push({
      pathname: 'agency/create',
      state: { agentid: id },
    });
  };

  const handleAgentDelete = (agentid) => {
    dispatch({
      type: settingsAction.REMOVE_AGENCY_DETAILS,
      payload: { id: agentid },
    });
  };

  const handleChangeStatus = (value, agentid) => {
    dispatch({
      type: settingsAction.CHANGE_AGENCY_STATUS,
      payload: { agentstatus: value, id: agentid },
    });
  };

  const handleFilterStatus = (status) => {
    dispatch({
      type: settingsAction.GET_AGENCY_INFO,
      payload: { status: status },
    });
  };

  const onFormLayoutChange = (values) => {
    // setComponentSize(size);
    const {
      carno,
      carbrandid,
      carmodelid,
      caryearid,
    } = usedForm.getFieldsValue();
    const payload = {
      carno: carno !== undefined ? carno : '',
      carbrand: carbrandid !== undefined ? carbrandid : -1,
      carmodel: carmodelid !== undefined ? carmodelid : -1,
      caryear: caryearid !== undefined ? caryearid : 0,
      // carstatus: carStatus
    };
    // dispatch({
    //   type: settingsAction.GET_CAR_FILTER_MANAGEMENT_INFO,
    //   payload: payload,
    // });
  };

  const handleFilterShow = () => {
    setshowFilter(!showFilter);
  };

  const handleSearchInput = () => {
    // setcardata(carmanagement_data.filter)
  };
  const handleCreateNewCar = () => {
    history.push('agency/create');
  };

  // useEffect(() => {
  //   dispatch({
  //       type: settingsAction.GET_AGENCY_INFO,
  //       payload: {'agentstatus': agentStatus},
  //   });
  // }, [agentStatus]);

  useEffect(() => {
    dispatch({
      type: settingsAction.GET_AGENCY_INFO,
      payload: { status: 0 },
    });
  }, []);
  return (
    <div className="page-container">
      <Row className="head-filter" justify="space-between" align="middle">
        <Col>
          <Title level={2}>Management</Title>
        </Col>
        <Col>
          <Space>
            <Button
              onClick={handleFilterShow}
              type="primary"
              icon={<FilterOutlined />}
            >
              Filter
            </Button>
            <Button onClick={handleCreateNewCar}>Create New</Button>
          </Space>
        </Col>
      </Row>
      {showFilter && (
        <Form
          {...formProps}
          layout="horizontal"
          form={usedForm}
          onValuesChange={() => onFormLayoutChange()}
        >
          <Row gutter={20}>
            <Col span={6} className="inner-content">
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Fields are required',
                  },
                ]}
              >
                <Input placeholder="Name" />
              </Form.Item>
            </Col>
            <Col span={6} className="inner-content">
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Fields are required',
                  },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>
            </Col>
            <Col span={6} className="inner-content">
              <Form.Item
                name="contactnumber"
                rules={[
                  {
                    required: true,
                    message: "Contact number is required",
                  },
                  {
                    min: 10,
                    message: getLocaleMessages('Contact number should be minimum 6 digits.'),
                  },
                  {
                    max: 10,
                    message: getLocaleMessages('Contact number should be maximum 15 digits.'),
                  },
                ]}
              >
                <Input placeholder="Contact Number" />
              </Form.Item>
            </Col>
            <Col span={6} className="inner-content">
              <Form.Item
                name={'agentstatus'}
                rules={[
                  { required: true, message: 'Please select the status' },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  defaultValue={[agentStatus]}
                  onChange={handleFilterStatus}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  autoComplete={'off'}
                  placeholder={'Status'}
                  dropdownStyle={{ minWidth: '200px' }}
                >
                  <Option key={0} value={0}>
                    All
                  </Option>
                  <Option key={1} value={1}>
                    Active
                  </Option>
                  <Option key={2} value={2}>
                    InActive
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}

      <Table columns={columns} dataSource={agency_data} />
    </div>
  );
};

export default AgentManagement;
