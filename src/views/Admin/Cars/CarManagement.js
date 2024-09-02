import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { history, store } from "redux/store";
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
  Modal,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Formatcurrency, formProps } from "../../../helpers/constant";
import settingsAction from "../../../redux/admin/car/actions";
import { getRequest, postRequest } from "./../../../helpers/axiosClient";
import "./../../../assets/css/adminStyle.css";
import { getLocaleMessages, getLocalDataType } from "redux/helper";
import compareAsc from "date-fns/compareAsc";
import { ShowForPermission } from "redux/userPermissions";
import LoadingOverlay from "react-loading-overlay";

const { Option } = Select;
const { Title } = Typography;
const CarManagement = () => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const {
    carinformation,
    carmanagement_data,
    isLoading,
    isDeleted,
  } = useSelector((state) => state.CarInfo);

  const [carStatus, setcarStatus] = useState(true);
  const [CarData, setCarData] = useState([]);
  const [carAgencyData, setCarAgencyData] = useState([]);
  const [showFilter, setshowFilter] = useState(false);
  useEffect(() => {
    if (carmanagement_data?.length > 0) {
      const result = carmanagement_data
        .filter((item) => item?.status === 1)
        ?.map((item, index) => ({
          agencyname: item.agencyname,
          agentid: item.agentid,
        }));
      const temp = result.filter(
        (ele, ind) =>
          ind === result.findIndex((elem) => elem.agentid === ele.agentid)
      );
      setCarAgencyData(temp);
    }
  }, [carmanagement_data]);

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (id, data, idx) => <span>{idx + 1}</span>,
    },
    {
      title: getLocaleMessages("Car No"),
      dataIndex: "carno",
      key: "carno",
    },
    {
      title: getLocaleMessages("Image"),
      dataIndex: "carpreviewurl",
      key: "carpreviewurl",
      render: (carpreviewurl) => (
        <img
          height="40px"
          width="60px"
          src={`https://api.drivelounge.com/${carpreviewurl}`}
          alt=""
        />
      ),
    },

    {
      title: getLocaleMessages("Make"),
      dataIndex: "carbrand",
      key: "carbrand",
    },
    {
      title: getLocaleMessages("Model"),
      dataIndex: "carmodel",
      key: "carmodel",
    },
    {
      title: getLocaleMessages("Year"),
      dataIndex: "caryear",
      key: "caryear",
    },
    {
      title: getLocaleMessages("Price per day"),
      dataIndex: "carpriceperday",
      key: "carpriceperday",
    },
    {
      title: getLocaleMessages("Deposit"),
      dataIndex: "cardeposite",
      key: "cardeposite",
    },
    {
      title: getLocaleMessages("Status"),
      dataIndex: "carstatus",
      key: "carstatus",
      render: (showdashboard, car) => (
        <>
          <Switch
            checked={car.carstatus}
            onChange={(e) => handleCarStatus(e, car.carid)}
          />{" "}
          <Space />
          {/* <span>{getLocaleMessages(car.availability)}</span> */}
        </>
      ),
    },
    // {
    //   title: getLocaleMessages(""),
    //   dataIndex: "status",
    //   key: "status",
    //   render: (showdashboard, row) => {
    //     return (
    //       <Switch
    //         checked={row.showdashboard}
    //         onChange={(e) => handleCarStatus(e, row.carid)}
    //       />
    //     );
    //   },
    // },
    // {
    //   title: 'Status',
    //   dataIndex: 'showdashboard',
    //   key: 'showdashboard',
    //   render: (showdashboard, car) => (
    //     <div>
    //       {car.showdashboard == false
    //         ? 'UNPUBLISHED'
    //         : chekcIsCarBooked(car.carid) == true
    //         ? 'BOOKED'
    //         : 'PUBLISHED'}
    //     </div>
    //   ),
    // },
    {
      title: getLocaleMessages("Action"),
      dataIndex: "caraction",
      key: "caraction",
      render: (caraction, record) => (
        <span>
          <ShowForPermission permission="update" module="carmgt">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEditCar(record.carid)}
              type="edit"
            />
          </ShowForPermission>
          <ShowForPermission permission="remove" module="carmgt">
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteCar(record.carid)}
              type="remove"
            />
          </ShowForPermission>
        </span>
      ),
    },
  ];

  const columnsAdmin = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (id, data, idx) => <span>{idx + 1}</span>,
    },
    {
      title: getLocaleMessages("Car No"),
      dataIndex: "carno",
      key: "carno",
    },
    {
      title: getLocaleMessages("Image"),
      dataIndex: "carpreviewurl",
      key: "carpreviewurl",
      render: (carpreviewurl) => (
        <img
          height="40px"
          width="60px"
          src={`https://api.drivelounge.com/${carpreviewurl}`}
        />
      ),
    },

    {
      title: getLocaleMessages("Agency Name"),
      dataIndex: "agencyname",
      key: "agencyname",
    },

    {
      title: getLocaleMessages("Make"),
      dataIndex: "carbrand",
      key: "carbrand",
    },
    {
      title: getLocaleMessages("Model"),
      dataIndex: "carmodel",
      key: "carmodel",
    },
    {
      title: getLocaleMessages("Year"),
      dataIndex: "caryear",
      key: "caryear",
    },
    {
      title: getLocaleMessages("Price per day"),
      dataIndex: "carpriceperday",
      key: "carpriceperday",
      render: (carpriceperday) => <span>{Formatcurrency(carpriceperday)}</span>,
    },
    {
      title: getLocaleMessages("Deposit"),
      dataIndex: "cardeposite",
      key: "cardeposite",
      render: (cardeposite) => <span>{Formatcurrency(cardeposite)}</span>,
    },
    {
      title: getLocaleMessages("Status"),
      dataIndex: "availability",
      key: "availability",
      render: (showdashboard, car) => (
        <>
          <Switch
            checked={car.carstatus}
            onChange={(e) => handleCarStatus(e, car.carid)}
          />{" "}
          <Space />
          {/* <span>{getLocaleMessages(car.availability)}</span> */}
        </>
      ),
    },
    // {
    //   title: getLocaleMessages(""),
    //   dataIndex: "status",
    //   key: "status",
    //   render: (showdashboard, row) => {
    //     return (
    //       <Switch
    //         checked={row.showdashboard}
    //         onChange={(e) => handleCarStatus(e, row.carid)}
    //       />
    //     );
    //   },
    // },
    // {
    //   title: 'Status',
    //   dataIndex: 'showdashboard',
    //   key: 'showdashboard',
    //   render: (showdashboard, car) => (
    //     <div>
    //       {car.showdashboard == false
    //         ? 'UNPUBLISHED'
    //         : chekcIsCarBooked(car.carid) == true
    //         ? 'BOOKED'
    //         : 'PUBLISHED'}
    //     </div>
    //   ),
    // },
    {
      title: "Action",
      dataIndex: "caraction",
      key: "caraction",
      render: (caraction, record) => (
        <span>
          <ShowForPermission permission="update" module="carmgt">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEditCar(record.carid)}
              type="edit"
            />
          </ShowForPermission>
          <ShowForPermission permission="remove" module="carmgt">
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteCar(record.carid)}
              type="remove"
            />
          </ShowForPermission>
        </span>
      ),
    },
  ];

  const handleCarStatus = (e, carid) => {
    dispatch({
      type: settingsAction.SET_PUBLISH_STATUS,
      payload: { id: carid, carstatus: e },
    });
  };

  const handleEditCar = (carid) => {
    history.push({
      pathname: "cars/update",
      state: { carid: carid },
    });
  };

  const handleDeleteCar = (carid) => {
    Modal.confirm({
      title: getLocaleMessages("Warning"),
      icon: <DeleteOutlined />,
      content: getLocaleMessages("Are you sure you want to delete"),
      okText: getLocaleMessages("Ok"),
      cancelText: getLocaleMessages("Cancel"),
      maskClosable: true,
      mask: true,
      onOk: () => {
        dispatch({
          type: settingsAction.REMOVE_CAR_BYID,
          payload: carid,
        });
      },
    });
  };

  useEffect(() => {
    if (isDeleted) {
      dispatch({
        type: settingsAction.GET_CAR_MANAGEMENT_INFO,
        payload: carStatus,
      });
      dispatch({
        type: settingsAction.GET_CAR_INFO,
        payload: false,
      });
    }
  }, [isDeleted]);

  const onFormLayoutChange = () => {
    const {
      carno,
      carbrandid,
      caryearid,
      carmodelid,
      status,
      agentid,
    } = usedForm.getFieldsValue();

    const filter = {};
    if (carno !== undefined && carno !== "") {
      filter["carno"] = carno;
    }
    if (carbrandid !== undefined && carbrandid !== "") {
      filter["carbrand"] = carbrandid;
    }
    if (carmodelid !== undefined && carmodelid !== "") {
      filter["carmodel"] = carmodelid;
    }
    if (caryearid !== undefined && caryearid !== "") {
      filter["caryear"] = Number(caryearid);
    }
    if (status !== undefined && status !== "") {
      filter["availability"] = status;
    }
    if (agentid !== undefined && agentid !== "") {
      filter["agentid"] = agentid;
    }
    // dispatch({
    //   type: settingsAction.GET_CAR_FILTER_MANAGEMENT_INFO,
    //   payload: filter,
    // });

    const temp = carmanagement_data.filter((props) =>
      Object.entries(filter).every(
        ([key, val]) =>
          !val.length ||
          props[key].toLowerCase()?.trim().includes(val.toLowerCase()?.trim())
      )
    );

    let raw_filter = carmanagement_data.filter(function (item) {
      for (var key in filter) {
        if (
          item[key] === undefined ||
          String(item[key]).toLocaleLowerCase() !=
            String(filter[key]).toLocaleLowerCase()
        )
          return false;
      }
      return true;
    });

    // carmanagement_data.filter(function (item) {
    //   for (var key in filter) {
    //     if (
    //       item[key] !== undefined &&
    //       item[key] !== null &&
    //       JSON.stringify(item[key]).includes(filter[key])
    //     )
    //       return item;
    //   }
    // });

    let filters = [];
    if (raw_filter.length > 0) {
      filters = raw_filter;
    }

    if (raw_filter.length == 0) {
      filters = [];
    }
    if (
      filter &&
      Object.keys(filter).length === 0 &&
      filter.constructor === Object
    ) {
      filters = carmanagement_data;
    }

    if (getLocalDataType() === "agency") {
      let { id } = JSON.parse(localStorage.getItem("user_data"));
      const status = carStatus ? 1 : 2;
      let userfilter =
        filters &&
        filters.filter((car) => car.status === status && car.agentid == id);
      setCarData(userfilter);
    } else {
      const status = carStatus ? 1 : 2;
      let userfilter =
        filters && filters.filter((car) => car.status === status);
      setCarData(userfilter);
    }
  };

  const onCarStatusChange = (status) => {
    setcarStatus(status);
  };

  const handleFilterShow = () => {
    setshowFilter(!showFilter);
  };

  const chekcIsCarBooked = async (carid) => {
    await getRequest(`public/booking/getdates?id=${carid}`).then((res) => {
      let result = res.data;
      let data = result.data[0];
      let rest = false;
      if (data.length && data[0].dropoffdate !== null && data[0].pickupdate) {
        let today = new Date();
        let pickup = new Date(data[0].pickupdate);
        let dropoff = new Date(data[0].dropoffdate);
        // dropoff date gr or eq to today show booked
        if (data[0].carid == 2 && compareAsc(dropoff, today) >= 0) {
          rest = true;
        }
        // if(compareAsc(today,pickup) == 1 && compareAsc(today,dropoff) < 0){
        //   // drop off less than today - not booked
        //   return true
        // }else if("pickup "){
        //   // pickup up gr than today and different b/w days (add with today and check )
        // }
        return rest;
      } else {
        return rest;
      }
    });
  };
  const handleCreateNewCar = () => {
    history.push({
      pathname: "cars/create",
    });
  };

  const FilterCar = () => {
    if (getLocalDataType() === "agency") {
      let { id } = JSON.parse(localStorage.getItem("user_data"));
      const status = carStatus ? 1 : 2;
      let filter =
        carmanagement_data &&
        carmanagement_data.filter(
          (car) => car.status === status && car.agentid == id
        );
      setCarData(filter);
    } else {
      const status = carStatus ? 1 : 2;
      let filter =
        carmanagement_data &&
        carmanagement_data.filter((car) => car.status === status);
      setCarData(filter);
    }
  };
  useEffect(() => {
    FilterCar();
  }, [carStatus]);

  useEffect(() => {
    FilterCar();
  }, [carmanagement_data]);

  useEffect(() => {
    dispatch({
      type: settingsAction.GET_CAR_MANAGEMENT_INFO,
      payload: carStatus,
    });
    dispatch({
      type: settingsAction.GET_CAR_INFO,
      payload: false,
    });
  }, []);
  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text={getLocaleMessages("Loading your content...")}
    >
      <div className="page-container">
        <Row justify="space-between" align="middle" className="head-filter">
          <Col span={12}>
            <Title level={2}> {getLocaleMessages("Car Management")} </Title>
          </Col>
          {/* <Col>
            <Input
              size="small"
              onChange={handleSearchInput}
              name={"searchInput"}
              placeholder="search"
              prefix={<SearchOutlined />}
            />
          </Col> */}
          <Col span={12}>
            <div className="head-filter-flxend">
              {/* <Col>
                <Row justify="space-between" align="middle" gutter={30}>
                  <Col>{getLocaleMessages("Status")}</Col>
                  <Col>
                    <Switch defaultChecked onChange={onCarStatusChange} />
                  </Col>
                </Row>
              </Col> */}
                    <Button
                      onClick={handleFilterShow}
                      type="primary"
                      icon={<FilterOutlined />}
                    >
                      {getLocaleMessages("Filter")}
                    </Button>
                    <ShowForPermission permission="create" module="carmgt">
                      <Button onClick={handleCreateNewCar}>
                        {" "}
                        {getLocaleMessages("Create New")}{" "}
                      </Button>
                      </ShowForPermission>
                      </div>
           
           </Col>
        </Row>

        {showFilter && (
          <Form
            {...formProps}
            layout="horizontal"
            form={usedForm}
            onValuesChange={onFormLayoutChange}
          >
            <Row gutter={20}>
              <Col span={4} className="inner-content">
                <Form.Item label={getLocaleMessages("Car No")} name="carno">
                  <Input
                    placeholder=""
                    name="carno"
                    min={0}
                    onChange={(e) => {
                      usedForm.setFieldsValue({
                        carno: e.target.value.replace(/[^0-9]/g, ""),
                      });
                    }}
                    allowClear
                  />
                </Form.Item>
              </Col>
              {getLocalDataType() === "admin" && (
                <Col span={4} className="inner-content">
                  <Form.Item
                    label={getLocaleMessages("Agency")}
                    name={"agentid"}
                  >
                    <Select
                      showSearch
                      allowClear
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      autoComplete={"off"}
                      placeholder={""}
                      dropdownStyle={{ minWidth: "200px" }}
                    >
                      {carAgencyData?.length > 0 &&
                        carAgencyData.map((value) => {
                          return (
                            <Option key={value.agentid} value={value.agentid}>
                              {value.agencyname}
                            </Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                </Col>
              )}
              <Col span={4} className="inner-content">
                <Form.Item
                  label={getLocaleMessages("Brand")}
                  name={"carbrandid"}
                >
                  <Select
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder={""}
                    dropdownStyle={{ minWidth: "200px" }}
                  >
                    {carinformation.brand &&
                      carinformation.brand.map((value) => {
                        return (
                          <Option
                            key={value.carbrandname}
                            value={value.carbrandname}
                          >
                            {value.carbrandname}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4} className="inner-content">
                <Form.Item
                  label={getLocaleMessages("Model")}
                  name={"carmodelid"}
                >
                  <Select
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    autoComplete={"off"}
                    placeholder={""}
                    dropdownStyle={{ minWidth: "200px" }}
                  >
                    {carinformation.model &&
                      carinformation.model.map((value) => {
                        return (
                          <Option key={value.id} value={value.carmodelname}>
                            {value.carmodelname}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4} className="inner-content">
                <Form.Item label={getLocaleMessages("Year")} name={"caryearid"}>
                  <Select
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    autoComplete={"off"}
                    placeholder={""}
                    dropdownStyle={{ minWidth: "200px" }}
                  >
                    {carinformation.year &&
                      carinformation.year.map((value) => {
                        return (
                          <Option key={value.id} value={value.caryearname}>
                            {value.caryearname}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4} className="inner-content">
                <Form.Item label={getLocaleMessages("Status")} name={"status"}>
                  <Select
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    autoComplete={"off"}
                    placeholder={""}
                    dropdownStyle={{ minWidth: "200px" }}
                  >
                    <Option value={"Published"}>
                      {getLocaleMessages("Published")}
                    </Option>
                    <Option value={"Unpublished"}>
                      {getLocaleMessages("Unpublished")}
                    </Option>
                    <Option value={"Booked"}>
                      {getLocaleMessages("Booked")}
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
        <Table
          rowKey="carid"
          columns={getLocalDataType() == "admin" ? columnsAdmin : columns}
          dataSource={CarData}
        />
      </div>
    </LoadingOverlay>
  );
};

export default CarManagement;
