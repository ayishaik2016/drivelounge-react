import React, { useEffect, useState } from "react";
import {
  Statistic,
  Row,
  Col,
  Card,
  Button,
  Form,
  Radio,
  Progress,
  DatePicker,
} from "antd";
import { FormattedMessage } from "react-intl";
import {
  CalendarOutlined,
  CalendarFilled,
  CalendarTwoTone,
  UserOutlined,
  FileDoneOutlined,
  EyeOutlined,
  CarOutlined,
  CarFilled,
  MoneyCollectOutlined,
  UsergroupAddOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { history } from "redux/store";
import dashboardActions from "./../../../redux/admin/dashboard/actions";
import { getRequest } from "./../../../helpers/axiosClient";
import { getLocalDataType } from "redux/helper";
import { useDispatch, useSelector } from "react-redux";
import "./../../../assets/css/adminStyle.css";
import LineChart from "./../Graphs/LineChart";
import AreaChart from "./../../Admin/Graphs/AreaChart";
import PieChart from "./../Graphs/PieChart";
import CarChart from "./../Graphs/Cars";
import moment from "moment";
import { format, compareAsc } from "date-fns";
import settingsAction from "./../../../redux/admin/booking/actions";
import LoadingOverlay from "react-loading-overlay";
import { getLocaleMessages } from "./../../../redux/helper";
import { formProps, DEFAULT_CURRENCY } from "./../../../helpers/constant";
LoadingOverlay.propTypes = undefined;

const AdminDashboard = () => {
  let bookingHeader = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (id, data, idx) => <span>{idx + 1}</span>,
    },
    {
      title: getLocaleMessages("Booking No"),
      dataIndex: "bookingno",
      key: "bookingno",
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
        if (status.status == 1) return <span>Confirmed</span>;
        else if (status.status == 2) return <span>Pending</span>;
        else if (status.status == 3) return <span>Completed</span>;
        else if (status.status == 0) return <span>Cancelled</span>;
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
  const localLang = localStorage.getItem("language");
  const [chartvalue, setchartValue] = useState(1);
  const dispatch = useDispatch();
  const { subLang, loader } = useSelector((state) => state.Auth);
  const [bookingBar, setBookingBar] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const { RangePicker } = DatePicker;
  const {
    barchartcount,
    piechartcount,
    admin_dashboard_count,
    admin_dashboard_bookings,
    admin_dashboard_car,
    isLoading,
  } = useSelector((state) => state.Dashboard);

  const rangeConfig = {
    rules: [
      //{ type: "array", required: true, message: "Please select date range!" },
    ],
  };

  // const chekcIsCarBooked = async (carid) => {
  //   await getRequest(`public/booking/getdates?id=${carid}`).then((res) => {
  //     let result = res.data;
  //     let data = result.data[0];
  //     let rest = false;
  //     if (data.length && data[0].dropoffdate !== null) {
  //       let today = new Date();
  //       let dropoff = new Date(data[0].dropoffdate);
  //       if (data[0].carid == carid && compareAsc(dropoff, today) >= 0) {
  //         rest = true;
  //       }

  //       return rest;
  //     } else {
  //       return rest;
  //     }
  //   });
  // };

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

  const handleChangeStatus = (id, event) => {
    dispatch({
      type: settingsAction.CHANGE_BOOKING_STATUS,
      payload: { id: id, status: event },
    });
  };

  const onFormLayoutChange = (values) => {
    const { rangepicker } = values;
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
    if (admin_dashboard_count[1] !== undefined) {
      return (value / admin_dashboard_count[1].count) * 100;
    } else return 0;
  };

  const handleFilterShow = () => {
    setShowFilter(!showFilter);
  };

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

  useEffect(() => {
    const _fromdate = new Date();
    const _todate = new Date();
    getDashboardResult(false, _fromdate, _todate);
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

  const onchartChange = (e) => {
    setchartValue(e.target.value);
  };

  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text={getLocaleMessages("Loading your content...")}
    >
      <div className="page-container">
        <Row className="head-filter">
          <Col span={20} />
          <Col span={4}>
            <Button
              onClick={handleFilterShow}
              type="primary"
              icon={<FilterOutlined />}
            >
              {getLocaleMessages("Filter")}
            </Button>
          </Col>
        </Row>

        {showFilter && (
          <Row className="head-filter">
            <Col span={16} />
            <Col span={8}>
              <Form {...formProps} onValuesChange={onFormLayoutChange}>
                <Form.Item name="rangepicker" {...rangeConfig}>
                  <RangePicker
                    placeholder={[
                      `${getLocaleMessages("Start Date")}`,
                      `${getLocaleMessages("End Date")}`,
                    ]}
                  />
                </Form.Item>
              </Form>
            </Col>
          </Row>
        )}

        <Row className="dashboard-boxes" gutter={20}>
          {/* <Col span={6}>
            <Card className="customer-count">
              <div className="right">
                  <p className="text">{count("total-users")}</p>
              </div>
              <Statistic title={<FormattedMessage id="dashboard.usercount" defaultMessage={"Users"}></FormattedMessage>} value={count("users")} />
             
            </Card>
          </Col>
          <Col span={6}>
            <Card className="color-two">
              <div className="right">
                  <p className="text">{count("total-agency")}</p>
              </div>
              <Statistic title={<FormattedMessage id="Agencies" defaultMessage={"Agencies"}></FormattedMessage>} value={count("agency")} />
             
            </Card>
          </Col>
          <Col span={6}>
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

          <Col span={6}>
            <div className="base">
              <div className="img">
                <UsergroupAddOutlined />
              </div>
              <span className="text">{getLocaleMessages("Agency")}</span>
              <span className="value">{count("agency")}</span>
            </div>
          </Col>

          <Col span={6}>
            <div className="base">
              <div className="img">
                <UserOutlined />
              </div>
              <span className="text">{getLocaleMessages("Users")}</span>
              <span className="value">{count("users")}</span>
            </div>
          </Col>

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
                percent={50}
                showInfo={false}
              />
              <span className="value">{count("car")}</span>
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
                percent={50}
                showInfo={false}
              />
              <span className="value">{count("available")}</span>
            </div>
          </Col>

          {/* <Col span={6}>
          <div className="base">          
            <div className="img"><CarFilled /></div>            
              <span className="text">{("Cars not vailable")}</span>
              <Progress className="progress" strokeColor={{
                from: '#108ee9',
                to: '#87d068',
              }} percent={percentage(count("car")-count("available"))} showInfo={false}/>
              <span className="value">{count("car")-count("available")}</span>           
          </div>          
        </Col> */}
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
              <span className="text">{getLocaleMessages("New Bookings")}</span>
              <Progress
                className="progress"
                strokeColor={{
                  from: "#108ee9",
                  to: "#87d068",
                }}
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
              <span className="text">{getLocaleMessages("Cancellation")}</span>
              <Progress
                className="progress"
                strokeColor={"red"}
                percent={percentage(
                  admin_dashboard_count[4] !== undefined &&
                    admin_dashboard_count[4].count
                )}
                showInfo={false}
              />
              <span className="value">
                {admin_dashboard_count[4] !== undefined &&
                  admin_dashboard_count[4].count}
              </span>
            </div>
          </Col>

          <Col span={6}>
            <div className="base">
              <div className="img">
                <MoneyCollectOutlined />
              </div>
              <span className="text">{getLocaleMessages("Total Income")}</span>
              <span className="value">
                {`${count("income")} `}
                <span
                  style={{ fontSize: "18px", marginLeft: "5px" }}
                >{`${" "} ${getLocaleMessages(DEFAULT_CURRENCY)}`}</span>
              </span>
            </div>
          </Col>
        </Row>

        {/* <Card>
          <Row gutter={30}>
            <Col span={16}>
              <LineChart chartdata={chartvalue}/>
            </Col>
            <Col span={8}>
              <Radio.Group onChange={onchartChange} value={chartvalue}>
                <Radio value={1}>{<FormattedMessage id="Per Day" defaultMessage={"Per day"}></FormattedMessage>}</Radio>
                <Radio value={2}>{<FormattedMessage id="Per Week" defaultMessage={"Per week"}></FormattedMessage>}</Radio>
              </Radio.Group>
              <PieChart chartdata={chartvalue}/>
            </Col>
          </Row>
        </Card> */}

        <div>
          <Row gutter={20}>
            {bookingBar && (
              <Col span={12}>
                <Card>
                  {" "}
                  {bookingBar.hasOwnProperty("series") && (
                    <LineChart pietype={1} booking={bookingBar} />
                  )}
                </Card>
              </Col>
            )}
            <Col span={12}>
              {piechartcount && (
                <Card>
                  {" "}
                  <AreaChart
                    pietype={2}
                    booking={piechartcount}
                    subLang={localLang}
                  />{" "}
                </Card>
              )}
            </Col>
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

        {/* <Card className="dashboard-table" title={getLocaleMessages("Cars")}>       
          <Row gutter={20}>           
            <Col span={12}>              
               <CarChart pietype={1} carcount={admin_dashboard_count}/>             
            </Col>
            <Col span={12}>             
               <CarChart pietype={2} carcount={admin_dashboard_count}/>             
            </Col>
          </Row>
        </Card>   */}

        {/* <Card className="dashboard-table" title={<FormattedMessage id="Bookings" defaultMessage={"Bookings"}></FormattedMessage>}>
          <Table
            columns={bookingHeader}
            dataSource={admin_dashboard_bookings}
          />
        </Card>

        <Card className="dashboard-table" title={<FormattedMessage id="Cars" defaultMessage={"Cars"}></FormattedMessage>}>
          <Table
            columns={carHeader}
            dataSource={admin_dashboard_car}
          />
        </Card> */}
      </div>
    </LoadingOverlay>
  );
};

export default AdminDashboard;
