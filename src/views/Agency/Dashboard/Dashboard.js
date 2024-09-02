import React, { useEffect, useState } from "react";
import {
  Statistic,
  Row,
  Col,
  Card,
  Button,
  Progress,
  Form,
  DatePicker,
} from "antd";
import {
  CalendarOutlined,
  FilterOutlined,
  CalendarTwoTone,
  UserOutlined,
  FileDoneOutlined,
  EyeOutlined,
  CarOutlined,
  CarFilled,
} from "@ant-design/icons";
import dashboardActions from "./../../../redux/admin/dashboard/actions";
import { getRequest } from "./../../../helpers/axiosClient";
import { getLocalDataType, getLocaleMessages } from "redux/helper";
import { useDispatch, useSelector } from "react-redux";
import "./../../../assets/css/adminStyle.css";
import { format, compareAsc } from "date-fns";
import settingsAction from "./../../../redux/admin/booking/actions";
import { history, store } from "redux/store";
import LoadingOverlay from "react-loading-overlay";
import LineChart from "./../../Admin/Graphs/LineChart";
import AreaChart from "./../../Admin/Graphs/AreaChart";
import PieChart from "./../../Admin/Graphs/PieChart";
import CarChart from "./../../Admin/Graphs/Cars";
import { FormattedMessage } from "react-intl";
import { cancelled } from "redux-saga/effects";
import { formProps } from "./../../../helpers/constant";
LoadingOverlay.propTypes = undefined;

const AgencyDashboard = () => {
  const localLang = localStorage.getItem("language");
  let bookingHeader = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (id, data, idx) => <span>{idx + 1}</span>,
    },
    {
      title: getLocaleMessages("Booking No"),
      dataIndex: "bookingcode",
      key: "bookingcode",
      render: (bookingcode) => (
        <span>
          {bookingcode.length > 8
            ? bookingcode.substr(bookingcode.length - 8)
            : bookingcode}
        </span>
      ),
    },

    {
      title: getLocaleMessages("Booking Date"),
      dataIndex: "bookingdate",
      key: "bookingdate",
      render: (bookingdate) => (
        <span>{format(new Date(bookingdate), "dd/MM/yyyy hh:mm:ss")}</span>
      ),
    },
    {
      title: getLocaleMessages("Deposit"),
      dataIndex: "deposit",
      key: "deposit",
    },
    {
      title: getLocaleMessages("Price per day"),
      dataIndex: "priceperday",
      key: "priceperday",
    },
    {
      title: getLocaleMessages("Total rental days"),
      dataIndex: "totalrentaldays",
      key: "totalrentaldays",
    },
    {
      title: getLocaleMessages("Total Amount"),
      dataIndex: "totalcost",
      key: "totalcost",
    },
    {
      title: getLocaleMessages("Status"),
      dataIndex: "status",
      key: "status",
      render: (id, status) => {
        if (status.status == 1)
          return <span>{getLocaleMessages("Confirmed")}</span>;
        else if (status.status == 2)
          return <span>{getLocaleMessages("Pending")}</span>;
        else if (status.status == 3)
          return <span>{getLocaleMessages("Completed")}</span>;
        else if (status.status == 0)
          return <span>{getLocaleMessages("Cancelled")}</span>;
      },
    },
    {
      title: getLocaleMessages("Action"),
      dataIndex: "id",
      key: "id",
      render: (id, record) => (
        <Button
          shape="circle"
          icon={<EyeOutlined />}
          onClick={() => viewBooking(record.id)}
          type="edit"
        />
      ),
    },
  ];

  let carHeader = [
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
      title: getLocaleMessages("Brand"),
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
      dataIndex: "availability",
      key: "availability",
      render: (availability, car) => (
        <span>{getLocaleMessages(car.availability)}</span>
      ),
    },
    {
      title: getLocaleMessages("Action"),
      dataIndex: "caraction",
      key: "caraction",
      render: (caraction, record) => (
        <span>
          <Button
            shape="circle"
            icon={<EyeOutlined />}
            onClick={() => handleEditCar(record.carid)}
            type="edit"
          />
        </span>
      ),
    },
  ];

  const dispatch = useDispatch();
  const { subLang, loader } = useSelector((state) => state.Auth);
  const {
    piechartcount,
    barchartcount,
    admin_dashboard_count,
    admin_dashboard_bookings,
    admin_dashboard_car,
    isLoading,
  } = useSelector((state) => state.Dashboard);
  const [CarData, setCarData] = useState([]);
  const [bookingBar, setBookingBar] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [usedForm] = Form.useForm();
  const { RangePicker } = DatePicker;

  const rangeConfig = {
    rules: [
      { type: "array", required: true, message: "Please select date range!" },
    ],
  };

  const handleEditCar = (carid) => {
    history.push({
      pathname: "cars/create",
      state: { carid: carid },
    });
  };

  const viewBooking = (id) => {
    history.push({
      pathname: "bookingdetails",
      state: id,
    });
  };

  const FilterCar = () => {
    if (getLocalDataType() === "agency") {
      let { id } = JSON.parse(localStorage.getItem("user_data"));
      let filter =
        admin_dashboard_car &&
        admin_dashboard_car.filter((car) => car.agentid == id);
      setCarData(filter);
    } else {
      setCarData(admin_dashboard_car);
    }
  };

  useEffect(() => {
    FilterCar();
  }, [admin_dashboard_car]);

  useEffect(() => {
    if (barchartcount?.length > 0) {
      let total = [];
      let completed = [];
      let pending = [];
      let cancelled = [];
      for (let i = 1; i <= 12; i++) {
        let total_count = 0;
        let completed_count = 0;
        let pending_count = 0;
        let cancelled_count = 0;
        barchartcount.map((item) => {
          if (item.month == i) {
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
      }

      let data = {
        series: [
          {
            name: getLocaleMessages("Total Booking"),
            data: total,
          },
          {
            name: getLocaleMessages("Completed"),
            data: completed,
          },
          {
            name: getLocaleMessages("Pending"),
            data: pending,
          },
          {
            name: getLocaleMessages("Cancelled"),
            data: cancelled,
          },
        ],
        options: {
          chart: {
            type: "bar",
            height: 350,
            stacked: true,
            toolbar: {
              show: true,
              offsetX:
                localLang !== undefined ? (localLang === "en" ? 0 : -500) : 0,
              offsetY: 0,
            },
            zoom: {
              enabled: true,
            },
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "50%",
              borderRadius: 1,
            },
          },
          xaxis: {
            type: "category",
            categories: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sept",
              "Oct",
              "Nov",
              "Dec",
            ],
            title: {
              text: getLocaleMessages("Bookings"),
              align: "right",
            },
          },
          legend: {
            position: "top",
            offsetY: 2,
            horizontalAlign: "left",
          },
          fill: {
            opacity: 1,
          },
        },
      };
      setBookingBar(data);
    }
  }, [barchartcount]);

  const onFormLayoutChange = () => {
    const { rangepicker } = usedForm.getFieldsValue();
    if (rangepicker !== null) {
      getDashboardResult(
        true,
        new Date(rangepicker[0]),
        new Date(rangepicker[1])
      );
    } else {
      getDashboardResult(false, new Date(), new Date());
    }
  };

  const getDashboardResult = (hasDate, from, to) => {
    const _fromdate = format(new Date(from), "yyyy-MM-dd");
    const _todate = format(new Date(to), "yyyy-MM-dd");

    dispatch({
      type: dashboardActions.GET_DASHBOARD_COUNTS,
      payload: { hasDate, _fromdate, _todate },
    });
    dispatch({
      type: dashboardActions.GET_DASHBOARD_PIE_COUNTS,
      payload: { type: 1, hasDate, _fromdate, _todate },
    });
    dispatch({
      type: dashboardActions.GET_DASHBOARD_BAR_COUNTS,
      payload: { type: 1, hasDate, _fromdate, _todate },
    });
  };

  const count = (card) => {
    let result =
      admin_dashboard_count &&
      admin_dashboard_count.filter((data) => data.name == card);
    const { count } = result.length > 0 && result[0];
    return count;
  };

  const percentage = (value) => {
    let totalCars = admin_dashboard_count?.filter((ite) => ite.name === "car");
    if (admin_dashboard_count[8] !== undefined) {
      return (value / totalCars[0]?.count) * 100;
    } else return 0;
  };

  const handleFilterShow = () => {
    setShowFilter(!showFilter);
  };

  useEffect(() => {
    const _fromdate = new Date();
    const _todate = new Date();
    getDashboardResult(false, _fromdate, _todate);
    // dispatch({
    //   type: dashboardActions.GET_DASHBOARD_COUNTS,
    //   payload: false,
    // });
    // dispatch({
    //   type: dashboardActions.GET_DASHBOARD_PIE_COUNTS,
    //   payload: {type:1},
    // });
    // dispatch({
    //   type: dashboardActions.GET_DASHBOARD_BAR_COUNTS,
    //   payload: {type:1},
    // });
    // let initialValue = {
    //   id:  getLocalDataType() == 'agency' ? JSON.parse(localStorage.getItem('user_data'))['id'] : 0,
    //   bookingno: "",
    //   status: "",
    // };
    // dispatch({
    //   type: dashboardActions.GET_DASHBOARD_BOOKINGS,
    //   payload: initialValue,
    // });
    // dispatch({
    //   type: dashboardActions.GET_DASHBOARD_CARLIST,
    //   payload: false,
    // });
  }, []);
  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text={getLocaleMessages("Loading your content...")}
    >
      <div className="page-container">
        <Row className="head-filter">
          <Col span={12} />
          <Col span={12}>
          <div className="head-filter-flxend">
            <Button
              onClick={handleFilterShow}
              type="primary"
              icon={<FilterOutlined />}
            >
              {getLocaleMessages("Filter")}
            </Button>
            </div>
          </Col>
        </Row>

        {showFilter && (
          <Row className="head-filter">
            <Col span={16} />
            <Col span={8}>
              <Form
                {...formProps}
                form={usedForm}
                onValuesChange={onFormLayoutChange}
              >
                <Form.Item name="rangepicker" {...rangeConfig}>
                  <RangePicker
                    placeholder={[
                      getLocaleMessages("Start Date"),
                      getLocaleMessages("End Date"),
                    ]}
                  />
                </Form.Item>
              </Form>
            </Col>
          </Row>
        )}
        <div className="dashboard-boxes">
          <Row className="" gutter={24}>
            <Col span={6}>
              <div className="base">
                <div className="img">
                  <CarOutlined />
                </div>
                <span className="text">{getLocaleMessages("Total Cars")}</span>
                <Progress
                  className="progress"
                  strokeColor={{
                    from: "#108ee9",
                    to: "#87d068",
                  }}
                  percent={percentage(count("car"))}
                  showInfo={false}
                />
                <span className="value">
                  {count("car") !== undefined && count("car") !== null
                    ? count("car")
                    : 0}
                </span>
              </div>
            </Col>

            <Col span={6}>
              <div className="base">
                <div className="img">
                  <CarOutlined />
                </div>
                <span className="text">
                  {getLocaleMessages("Cars available")}
                </span>
                <Progress
                  className="progress"
                  strokeColor={{
                    from: "#108ee9",
                    to: "#87d068",
                  }}
                  percent={percentage(count("available"))}
                  showInfo={false}
                />
                <span className="value">
                  {count("available") !== undefined &&
                  count("available") !== null
                    ? count("available")
                    : 0}
                </span>
              </div>
            </Col>
            <Col span={6}>
              <div className="base">
                <div className="img">
                  <CarFilled />
                </div>
                <span className="text">
                  {getLocaleMessages("Cars not available")}
                </span>
                <Progress
                  className="progress"
                  strokeColor={{
                    from: "#108ee9",
                    to: "#87d068",
                  }}
                  percent={percentage(count("car") - count("available"))}
                  showInfo={false}
                />
                <span className="value">
                  {count("car") !== undefined &&
                  count("available") !== undefined
                    ? count("car") - count("available") < 0
                      ? 0
                      : count("car") - count("available")
                    : 0}
                </span>
              </div>
            </Col>
            {/* <Col span={6}>
          <div className="base">          
            <div className="img"><CalendarFilled /></div>            
              <span className="text">{("Total Bookings")}</span>
              <Progress className="progress" strokeColor={{
                from: '#108ee9',
                to: '#87d068',
              }} percent={50} showInfo={false}/>
              <span className="value">{piechartcount[0] !== undefined && piechartcount[0].total}</span>           
          </div>          
        </Col>    */}

            <Col span={6}>
              <div className="base">
                <div className="img">
                  <CalendarOutlined />
                </div>
                <span className="text">
                  {getLocaleMessages("New Bookings")}
                </span>
                <Progress
                  className="progress"
                  strokeColor={{
                    from: "#108ee9",
                    to: "#87d068",
                  }}
                  percent={percentage(
                    admin_dashboard_count[7] !== undefined &&
                      admin_dashboard_count[7].count
                  )}
                  showInfo={false}
                />
                <span className="value">
                  {admin_dashboard_count[7] !== undefined &&
                    admin_dashboard_count[7].count}
                </span>
              </div>
            </Col>
            <Col span={6}>
              <div className="base">
                <div className="img">
                  <FileDoneOutlined />
                </div>
                <span className="text">
                  {getLocaleMessages("Booking Confirmed")}
                </span>
                <Progress
                  className="progress"
                  strokeColor={{
                    from: "#108ee9",
                    to: "#87d068",
                  }}
                  percent={percentage(
                    admin_dashboard_count[6] !== undefined &&
                      admin_dashboard_count[6].count
                  )}
                  showInfo={false}
                />
                <span className="value">
                  {admin_dashboard_count[6] !== undefined &&
                    admin_dashboard_count[6].count}
                </span>
              </div>
            </Col>

            <Col span={6}>
              <div className="base">
                <div className="img">
                  <CalendarTwoTone />
                </div>
                <span className="text">
                  {getLocaleMessages("Cancellation")}
                </span>
                <Progress
                  className="progress"
                  strokeColor={"red"}
                  percent={percentage(
                    admin_dashboard_count[5] !== undefined &&
                      admin_dashboard_count[5].count
                  )}
                  showInfo={false}
                />
                <span className="value">
                  {admin_dashboard_count[5] !== undefined &&
                    admin_dashboard_count[5].count}
                </span>
              </div>
            </Col>

            {/*<Col span={6}>
          <div className="base">          
            <div className="img"><UserOutlined /></div>            
              <span className="text">{("Users")}</span>
              <Progress className="progress" strokeColor={{
                from: '#108ee9',
                to: '#87d068',
              }} percent={50} showInfo={false}/>
              <span className="value">{count("users")}</span>           
          </div>          
            </Col>*/}
            {/* <Col span={4}>
            <Card className="color-three">
              <Statistic title={getLocaleMessages("Bookings")} value={count("booking")} />
              <CalendarOutlined />
            </Card>
          </Col>
          <Col span={4}>
            <Card className="color-four">
              <Statistic title={getLocaleMessages("Total Cars")} value={count("car")} />
              <FileDoneOutlined />
            </Card>
          </Col>
          <Col span={4}>
            <Card className="color-four">
              <Statistic title={("Booked Cars")} value={count("car")-count("available")} />
              <FileDoneOutlined />
            </Card>
          </Col>
          <Col span={5}>
            <Card className="color-four">
              <Statistic title={("Available Cars")} value={count("available")} />
              <FileDoneOutlined />
            </Card>
          </Col>
          <Col span={5}>
            <Card className="color-five">
              <Statistic title={getLocaleMessages("Total Income")} value={`${count("income")} SAR`} />
              <FileDoneOutlined />
            </Card>
          </Col> */}
            {/* <Col span={6}>
            <Card className="color-six">
              <Statistic title="Website " value={35} />
              <FileDoneOutlined />
            </Card>
          </Col> */}
            {/* <Col span={6}>
            <Card className="customer-count">
              <div className="right">
                  <p className="text">{count("total-users")}</p>
              </div>
              <Statistic title={<FormattedMessage id="dashboard.usercount" defaultMessage={"Users"}></FormattedMessage>} value={count("users")} />
            
            </Card>
          </Col> */}
            {/* <Col span={6}>
            <Card className="color-two">
              <div className="right">
                  <p className="text">{count("total-agency")}</p>
              </div>
              <Statistic title={<FormattedMessage id="Agencies" defaultMessage={"Agencies"}></FormattedMessage>} value={count("agency")} />
              
            // </Card>
          </Col> */}
            {/* <Col span={6}>
            <Card className="color-two">
              <div className="right">
                  <p className="text">{count("car")}</p>
              </div>
              <Statistic title={<FormattedMessage id="Cars" defaultMessage={"Cars"}></FormattedMessage>} value={count("available")} />
              
            </Card>
          </Col>
          <Col span={6}>
            <Card className="color-five">
              <Statistic title={<FormattedMessage id="Total Income" defaultMessage={"Total Income"}></FormattedMessage>} value={`${count("income")} ${getLocaleMessages("SAR")}`} />
              <FileDoneOutlined />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="color-two">
              <div className="right">
                  <p className="text">{piechartcount[0] !== undefined && piechartcount[0].total}</p>
              </div>
              <Statistic title={<FormattedMessage id="Upcoming" defaultMessage={"Upcoming"}></FormattedMessage>} value={piechartcount[0] !== undefined && piechartcount[0].upcoming} />
             
            </Card>
          </Col>
          <Col span={6}>
            <Card className="color-two">
              <div className="right">
                  <p className="text">{piechartcount[0] !== undefined && piechartcount[0].total}</p>
              </div>
              <Statistic title={<FormattedMessage id="Booking" defaultMessage={"Booking"}></FormattedMessage>} value={piechartcount[0] !== undefined && piechartcount[0].booking} />
              
            </Card>
          </Col>
          <Col span={6}>
            <Card className="color-two">
              <div className="right">
                  <p className="text">{piechartcount[0] !== undefined && piechartcount[0].total}</p>
              </div>
              <Statistic title={<FormattedMessage id="Cancelled" defaultMessage={"Cancelled"}></FormattedMessage>} value={piechartcount[0] !== undefined && piechartcount[0].cancel} />
              
            </Card>
          </Col> */}
          </Row>
        </div>

        {/* <Card className="dashboard-table" title={getLocaleMessages("Bookings")}>       
            <Row gutter={20}>           
              <Col span={8}>              
                <PieChart pietype={1} />             
              </Col>
              <Col span={8}>             
                <PieChart pietype={2} />             
              </Col>
              <Col span={8}>             
                <PieChart pietype={3} />              
              </Col>            
            </Row>
          </Card> */}

        <div>
          <Row gutter={20}>
            {/* <Col span={12}>
              <a href="bingmaps:?cp=18.551464~73.951399">
                <a href="http://maps.apple.com/maps?q=18.551464, 73.951399">
                  Open Maps
                </a>
              </a>
            </Col> */}
            <Col span={12}>
              {" "}
              {bookingBar.hasOwnProperty("series") && (
                <Card className="dashboard-table">
                  <LineChart pietype={1} booking={bookingBar} />
                </Card>
              )}
            </Col>
            <Col span={12}>
              <Card>
                {" "}
                <AreaChart
                  pietype={2}
                  booking={piechartcount}
                  subLang={localLang}
                />{" "}
              </Card>
            </Col>
          </Row>
        </div>

        {/* <Card className="dashboard-table" title={getLocaleMessages("Bookings")}>
          <Table
            columns={bookingHeader}
            dataSource={admin_dashboard_bookings}
          />
        </Card> */}

        {/* <Card className="dashboard-table" title={getLocaleMessages("Cars")}>
          <Table
            columns={carHeader}
            dataSource={CarData}
          />
        </Card> */}
      </div>
    </LoadingOverlay>
  );
};

export default AgencyDashboard;
