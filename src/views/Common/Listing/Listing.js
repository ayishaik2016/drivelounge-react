import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { formProps } from "./../../../helpers/constant";
import {
  Layout,
  Row,
  Col,
  Typography,
  Form,
  Slider,
  Checkbox,
  Button,
  Collapse,
  InputNumber,
  Empty,
  Spin,
} from "antd";
import CarCard from "./../../Users/CarItem";
// import SearchModal from './../../Common/Modals/SearchInformation';
import SearchModal from "./../../Common/Modals/EditDates";
import SearchEditModal from "../Modals/SearchEditModel";
import actions from "./../../../redux/car/actions";
import favactions from "./../../../redux/Listing/actions";
import filteractions from "./../../../redux/filters/actions";
import Header from "./../Header/Header";
import Footer from "./../Footer/Footer";
import "../../../assets/css/userStyle.css";
import { format, parseISO } from "date-fns";
import moment, { invalid } from "moment";
import { postRequest } from "helpers/axiosClient";
import _ from "lodash";
import { getLocaleMessages } from "redux/helper";

const { Content } = Layout;
const { Panel } = Collapse;
const { Title, Paragraph } = Typography;

const Listing = (props) => {
  let localValue = JSON.parse(localStorage.getItem("searchCriteria"));
  const [carsPerPage, setcarsPerPage] = useState(6);
  const [arrayForHoldingCars, setarrayForHoldingCars] = useState([]);
  const [ResponsiveFilter, setResonsiveFilter] = useState(false);
  var entryAttr = {
    features: [
      {
        label: "Sunroof",
        value: "sunroof",
      },
      {
        label: "Comfortable",
        value: "comfortable",
      },
    ],
    specificlocation: [
      {
        label: getLocaleMessages("Yes"),
        value: "Yes",
      },
      {
        label: getLocaleMessages("No"),
        value: "No",
      },
    ],
    insurance: [
      {
        label: getLocaleMessages("3rd Party Liability"),
        value: "3rd Party Liability",
      },
      {
        label: getLocaleMessages("Full Coverage"),
        value: "Full Coverage",
      },
      {
        label: getLocaleMessages("No Coverage"),
        value: "No Coverage",
      },
    ],
    speed: [
      {
        label: getLocaleMessages("Limited"),
        value: "Limited",
      },
      {
        label: getLocaleMessages("Unlimited"),
        value: "Unlimited",
      },
    ],
    transmission: [
      {
        label: getLocaleMessages("Manual"),
        value: "Manual",
      },
      {
        label: getLocaleMessages("Automatic"),
        value: "Automatic",
      },
    ],
    driver: [
      {
        label: getLocaleMessages("With Chauffeur"),
        value: "With Chauffeur",
      },
      {
        label: getLocaleMessages("Without Chauffeur"),
        value: "Without Chauffeur",
      },
    ],
    deposit: [
      {
        label: getLocaleMessages("With Deposit"),
        value: "With Deposit",
      },
      {
        label: getLocaleMessages("Without Deposit"),
        value: "Without Deposit",
      },
    ],
  };

  const cylinders = [3, 4, 5, 6];
  const [usedForm] = Form.useForm();
  const dispatch = useDispatch();

  const {
    carFullInformationList,
    carbrand_data,
    cartype_data,
    caryear_data,
  } = useSelector((state) => state.CarListing);
  const { filterCarElements, agencylist } = useSelector(
    (state) => state.Listing
  );
  const {preferredCurrency, currencyConversion}=useSelector(
    (state) => state.Currency
  )
  const { filters } = useSelector((state) => state.FilterOption);
  const { favoriteList } = useSelector((state) => state.Listing);
  const [carsToShow, setCarsToShow] = useState([]);
  const [next, setNext] = useState(6);
  const [MinPrice, setMinPrice] = useState(0);
  const [MaxPrice, setMaxPrice] = useState(0);
  const [SelectedMinPrice, setSelectedMinPrice] = useState(0);
  const [SelectedMaxPrice, setSelectedMaxPrice] = useState(0);
  const [SliderMarks, setSliderMarks] = useState({
    0: `${MinPrice} ${getLocaleMessages(preferredCurrency)}`,
    100: `${MaxPrice} ${getLocaleMessages(preferredCurrency)}`,
  });
  const [PickupDate, setPickupDate] = useState();
  const [DropoffDate, setDropoffDate] = useState();
  const [WithDriver, setWithDriver] = useState();

  const [PickupPlace, setPickupPlace] = useState("");
  const [DropPlace, setDropPlace] = useState("");
  const [PickupCors, setPickupCors] = useState({
    lat: 24.6877,
    lng: 46.7219,
    address: "",
  });
  const [DropCors, setDropCors] = useState({
    lat: 24.6877,
    lng: 46.7219,
    address: "",
  });
  const [FilteredCarList, setFilteredCarList] = useState([]);
  const [isSideForm, setisSideForm] = useState(false);
  const [NotOverLappedCar, setNotOverLappedCar] = useState([]);
  const [loading, setLoading] = useState(false);

  const findMinMax = (arr) => {
    if (arr.length) {
      let min = arr[0].carpriceperday,
        max = arr[0].carpriceperday;
      for (let i = 1, len = arr.length; i < len; i++) {
        let v = arr[i].carpriceperday;
        min = v < min ? v : min;
        max = v > max ? v : max;
      }
      return [min, max];
    }
    return [2000, 3500];
  };

  const handleReservation = (carid = 0) => {
    alert("please select location");
    // history.push({
    //   pathname: '/reservation',
    //   state: { carid: carid }
    // });
  };
  const [clearFilters, setclearFilters] = useState(true);
  const handleClearFilter = () => {
    setclearFilters(false);
    setTimeout(() => {
      setclearFilters(true);
    }, 50);
    dispatch({
      type: filteractions.CLEAR_FILTERS,
    });
    setFilteredCarList(carFullInformationList);
    const Price = findMinMax(carFullInformationList);
    setMinPrice(Price[0] * parseFloat(currencyConversion).toFixed(2));
    setMaxPrice(Price[1] * parseFloat(currencyConversion).toFixed(2));
    setSelectedMinPrice(Price[0] * parseFloat(currencyConversion).toFixed(2));
    setSelectedMaxPrice(Price[1] * parseFloat(currencyConversion).toFixed(2));
  };

  const handleRentNow = (carid) => {
    handleReservation(carid);
  };

  const handleFormOk = () => {
    setisSideForm(!isSideForm);
  };

  const handleFormCancel = () => {
    setisSideForm(!isSideForm);
  };

  const [modalDetails, SetModalDetails] = useState(false);

  const showModalDetail = () => {
    SetModalDetails(!modalDetails);
  };

  const updateFilter = (name, e) => {
    if (e.target.checked) {
      dispatch({
        type: filteractions.ADD_FILTER,
        payload: { name: name, value: e.target.value },
      });
    } else {
      dispatch({
        type: filteractions.REMOVE_FILTER,
        payload: { name: name, value: e.target.value },
      });
    }
  };

  const filterEntries = (entries) => {
    if (_.isEmpty(filters)) return entries;
    return entries.filter((entry) => {
      let matchFilters = true;
      Object.keys(filters).forEach((filterKey) => {
        if (filters[filterKey].length) {
          matchFilters = JSON.stringify(filters[filterKey]).includes(
            entry[filterKey]
          )
            ? matchFilters
            : false;
        }
      });
      return matchFilters;
    });
  };

  useEffect(() => {
    // setFilteredCarList(carFullInformationList);
    let result = filterEntries(carFullInformationList);
    setFilteredCarList(result);
  }, [filters, PickupPlace]);

  const loopWithSlice = (start, end, resultData) => {
    const slicedCars = resultData.slice(start, end);
    let sliedData = [...arrayForHoldingCars, ...slicedCars];

    setarrayForHoldingCars(sliedData);
    setNotOverLappedCar(sliedData);
    // setFilteredCarList(arrayForHoldingCars);
    // setPostsToShow(arrayForHoldingPosts);
  };

  const handleShowMoreCars = () => {
    loopWithSlice(next, next + carsPerPage, FilteredCarList);
    setNext(next + carsPerPage);
  };

  useEffect(() => {
    const Price = findMinMax(carFullInformationList);
    setMinPrice(Price[0] * parseFloat(currencyConversion).toFixed(2));
    setMaxPrice(Price[1] * parseFloat(currencyConversion).toFixed(2));
    setSelectedMinPrice(Price[0] * parseFloat(currencyConversion).toFixed(2));
    setSelectedMaxPrice(Price[1] * parseFloat(currencyConversion).toFixed(2));
    setSliderMarks({
      0: `${MinPrice} ${getLocaleMessages(preferredCurrency)}`,
      100: `${MaxPrice} ${getLocaleMessages(preferredCurrency)}`,
    });
    setFilteredCarList(filterEntries(carFullInformationList));
  }, [carFullInformationList]);

  useEffect(() => {
    if (Object.keys(filterCarElements)?.length > 0) {
      setWithDriver(filterCarElements.WithDriver);
      setPickupPlace(localValue !== null ? localValue?.PickupPlace : "");
      setPickupDate(filterCarElements.PickupDate);
      setDropPlace(filterCarElements.DropPlace);
      setDropoffDate(filterCarElements.DropoffDate);
      setPickupCors(filterCarElements.PickupCors);
      setDropCors(filterCarElements.DropCors);
      dispatch({
        type: filteractions.REMOVE_FILTER,
        payload: { name: "driver", value: "With Chauffeur" },
      });
      if (filterCarElements.WithDriver) {
        dispatch({
          type: filteractions.ADD_FILTER,
          payload: { name: "driver", value: "With Chauffeur" },
        });
      }
      dispatch({
        type: filteractions.REMOVE_FILTER,
        payload: { name: "pickup", value: PickupPlace },
      });
      if (filterCarElements.PickupPlace) {
        dispatch({
          type: filteractions.ADD_FILTER,
          payload: { name: "pickup", value: filterCarElements.PickupPlace },
        });
      }
    }
  }, [filterCarElements]);

  useEffect(() => {
    dispatch({
      type: actions.GET_CARBRAND_LIST,
      payload: false,
    });
    dispatch({
      type: actions.GET_CARTYPE_LIST,
      payload: false,
    });
    dispatch({
      type: actions.GET_CARYEAR_LIST,
      payload: false,
    });
    setLoading(true);
    dispatch({
      type: actions.GET_CAR_FULL_LIST,
      payload: false,
    });
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    let agency = [];
    agencylist.length &&
      agencylist.map((agent) => {
        agency.push(agent.firstname + " " + agent.lastname);
      });
    entryAttr = agency.length && {
      ...entryAttr,
      agencyname: agency,
    };
  }, [agencylist]);

  const checkIsAvailable = async (car) => {
    try {
      if (car.carid > 0) {
        let data = {
          carid: car.carid,
          fromdate: new Date(filterCarElements.PickupDate),
          todate: new Date(filterCarElements.DropoffDate),
        };
        const result = await postRequest(
          `public/car/checkisavailable`,
          data
        ).then((res) => {
          const { data } = res.data;
          return data;
        });

        // car.isoverlapping = result.IsAvailable;
        car.isoverlapping = result[0].Available;
        car.isavailable = result[1].NotAvailable;
        return car;
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(async () => {
    if (
      FilteredCarList.length > 0 &&
      Object.keys(filterCarElements)?.length > 0
    ) {
      let data = FilteredCarList;
      const result = await Promise.all(
        data.map((car) => checkIsAvailable(car))
      );

      setNotOverLappedCar(result);
    } else {
      setNotOverLappedCar([]);
    }
  }, [FilteredCarList]);

  useEffect(() => {
    if (filterCarElements.PickupPlace != "") {
      if (carFullInformationList.length > 0) {
        var carlistpickup = [];
        for (var i = 0; i < carFullInformationList.length; i++) {
          if (
            filterCarElements.PickupPlace == carFullInformationList[i].pickup
          ) {
            carlistpickup.push(carFullInformationList[i]);
          }
        }
        setFilteredCarList(filterEntries(carlistpickup));
      }
    } else {
      setFilteredCarList(filterEntries(carFullInformationList));
    }
  }, [carFullInformationList, filterCarElements, DropPlace, PickupPlace]);

  const HandleResponsiveFilterToggle = () => {
    setResonsiveFilter(!ResponsiveFilter);
  };

  return (
    <>
      {isSideForm && (
        <SearchEditModal
          title={getLocaleMessages("Change Booking Information")}
          visible={isSideForm}
          onOk={handleFormOk}
          onCancel={handleFormCancel}
          footer={false}
          width={600}
          setDrop={setDropPlace}
        />
      )}
      <Layout className={"on-boarding"}>
        <Header />
        <Content className="content_mt">
          <section className="search-result">
            <div className="container">
              <Title level={4}>{getLocaleMessages("Search Result")}</Title>

              <div className="box-information">
                <div className="bx_info_values">
                  <label>{getLocaleMessages("Pickup Location")}</label>
                  <p>
                    {PickupPlace !== undefined && PickupPlace !== ""
                      ? PickupPlace
                      : ""}
                  </p>
                </div>
                {PickupPlace !== DropPlace && (
                  <div className="bx_info_values">
                    <label>{getLocaleMessages("Dropoff Location")}</label>
                    <p>
                      {DropPlace !== undefined && DropPlace !== ""
                        ? DropPlace
                        : DropCors.address}
                    </p>
                  </div>
                )}
                <div className="bx_info_values">
                  <label>{getLocaleMessages("Pickup Date & Time")}</label>
                  <p>
                    {PickupDate !== undefined && !isNaN(Date.parse(PickupDate))
                      ? moment(PickupDate).format("DD/MM/YYYY hh:mm A")
                      : moment().format("DD/MM/YYYY hh:mm A")}
                  </p>
                </div>

                <div className="bx_info_values">
                  <label>{getLocaleMessages("Dropoff Date & Time")}</label>
                  <p>
                    {DropoffDate &&
                    DropoffDate !== undefined &&
                    !isNaN(Date.parse(DropoffDate))
                      ? moment(DropoffDate).format("DD/MM/YYYY hh:mm A")
                      : moment().format("DD/MM/YYYY hh:mm A")}
                  </p>
                </div>
                <div className="bx_info_values_btn">
                  <Button onClick={handleFormOk}>
                    {getLocaleMessages("Change")}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <Button
            onClick={HandleResponsiveFilterToggle}
            className={
              ResponsiveFilter ? "filter_toggle open" : "filter_toggle"
            }
          >
            {ResponsiveFilter ? "Close Filter" : "Filter"}
          </Button>

          <section className="car-listing">
            <div className="container">
              <Row gutter={20}>
                <Col span={19}>
                  <Row gutter={20}>
                    {NotOverLappedCar?.length > 0 ? (
                      NotOverLappedCar.filter(
                        (car) =>
                          (car.carpriceperday * parseFloat(currencyConversion).toFixed(2)) >= SelectedMinPrice &&
                          (car.carpriceperday * parseFloat(currencyConversion).toFixed(2)) <= SelectedMaxPrice
                      ).map(
                        (car, index) =>
                          car.isoverlapping >= 0 &&
                          car.isavailable == 0 && (
                            <CarCard
                              {...props}
                              key={index}
                              index={index}
                              handleRentNow={handleRentNow}
                              {...car}
                            />
                          )
                      )
                    ) : loading ? (
                      <Spin
                        size="large"
                        spinning={loading}
                        style={{ width: "100%" }}
                      />
                    ) : (
                      <Empty
                        style={{ width: "100%" }}
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        // description={getLocaleMessages(
                        //   "No Cars Found for the currently selected Pickup Location"
                        // )}
                      />
                    )}
                  </Row>
                </Col>
                <Col span={5}>
                  {clearFilters && (
                    <Form {...formProps} layout="horizontal" form={usedForm}>
                      <div
                        className={
                          ResponsiveFilter
                            ? "filter-header open"
                            : "filter-header"
                        }
                      >
                        <div className="filter-header-flex">
                          <Title level={4}>{getLocaleMessages("Filter")}</Title>

                          <Button onClick={handleClearFilter}>
                            {getLocaleMessages("Clear")}
                          </Button>
                        </div>
                        <div className="box">
                          <Title level={5}>{getLocaleMessages("Price")}</Title>
                          {/* <Slider
                            range={true}
                            min={MinPrice}
                            max={MaxPrice}
                            value={[SelectedMinPrice, SelectedMaxPrice]}
                            defaultValue={[SelectedMinPrice, SelectedMaxPrice]}
                            onChange={(values) => {
                              setSelectedMinPrice(values[0]);
                              setSelectedMaxPrice(values[1]);
                            }}
                          /> */}
                          <Row>
                            <Col span={12}>
                              <Slider
                                min={MinPrice}
                                max={MaxPrice}
                                value={SelectedMaxPrice}
                                onChange={(value) => {
                                  setSelectedMinPrice(MinPrice);
                                  setSelectedMaxPrice(value);
                                }}
                              />
                            </Col>
                            <Col span={4}>
                              <InputNumber
                                min={MinPrice}
                                max={MaxPrice}
                                style={{ margin: "0 16px" }}
                                value={SelectedMaxPrice}
                                onChange={(e) => setSelectedMaxPrice(e)}
                              />
                            </Col>
                          </Row>
                        </div>
                        <div className="box">
                          <Title level={5}>{getLocaleMessages("Make")}</Title>
                          <div className="box_filter_height">
                            {carbrand_data &&
                              carbrand_data.map((brd, idx) => {
                                return (
                                  <Collapse key={idx}>
                                    <Panel
                                      showArrow={false}
                                      header={brd.carbrandname}
                                      key={idx}
                                    >
                                      {carFullInformationList &&
                                        carFullInformationList.map(
                                          (item, index) => {
                                            if (brd.id == item.brandid)
                                              return (
                                                <Checkbox
                                                  key={index}
                                                  value={item.model}
                                                  onChange={(e) =>
                                                    updateFilter("model", e)
                                                  }
                                                >
                                                  {item.model}
                                                </Checkbox>
                                              );
                                          }
                                        )}
                                    </Panel>
                                  </Collapse>
                                );
                              })}
                          </div>
                        </div>
                        <div className="box">
                          <Title level={5}>{getLocaleMessages("Type")}</Title>
                          {cartype_data &&
                            cartype_data.map((brd) => {
                              return (
                                <Checkbox
                                  key={brd.id}
                                  value={brd.cartypename}
                                  onChange={(e) => updateFilter("cartype", e)}
                                >
                                  {brd.cartypename}
                                </Checkbox>
                              );
                            })}
                        </div>
                        <div className="box">
                          <Title level={5}>{getLocaleMessages("Year")}</Title>
                          {caryear_data &&
                            caryear_data.map((yrs, id) => {
                              return (
                                <Checkbox
                                  key={id}
                                  value={yrs.caryear}
                                  onChange={(e) => updateFilter("year", e)}
                                >
                                  {yrs.caryear}
                                </Checkbox>
                              );
                            })}
                        </div>
                        <div className="box">
                          <Title level={5}>
                            {getLocaleMessages("Specific Location")}
                          </Title>
                          {entryAttr.specificlocation.map((ins, idx) => {
                            return (
                              <Checkbox
                                key={idx}
                                value={ins?.value}
                                onChange={(e) =>
                                  updateFilter("specificlocation", e)
                                }
                              >
                                {ins?.label}
                              </Checkbox>
                            );
                          })}
                        </div>
                        <div className="box">
                          <Title level={5}>
                            {getLocaleMessages("Insurance")}
                          </Title>
                          {entryAttr.insurance.map((ins, idx) => {
                            return (
                              <Checkbox
                                key={idx}
                                value={ins?.value}
                                onChange={(e) => updateFilter("insurance", e)}
                              >
                                {ins?.label}
                              </Checkbox>
                            );
                          })}
                        </div>
                        <div className="box">
                          <Title level={5}>
                            {getLocaleMessages("Mileage")}
                          </Title>
                          {entryAttr.speed.map((spd, idx) => {
                            return (
                              <Checkbox
                                key={idx}
                                value={spd?.value}
                                onChange={(e) => updateFilter("speed", e)}
                              >
                                {spd?.label}
                              </Checkbox>
                            );
                          })}
                        </div>
                        <div className="box">
                          <Title level={5}>{getLocaleMessages("Gear")}</Title>
                          {entryAttr.transmission.map((trns, idx) => {
                            return (
                              <Checkbox
                                key={idx}
                                value={trns?.value}
                                onChange={(e) =>
                                  updateFilter("transmission", e)
                                }
                              >
                                {trns?.label}
                              </Checkbox>
                            );
                          })}
                        </div>
                        {/* <div className="box">
                        <Title level={5}>Features</Title>
                        {entryAttr.features.map((feature, idx) => {
                          return (
                            <Checkbox
                              key={idx}
                              value={feature.label}
                              onChange={(e) => updateFilter(feature.value, e)}
                            >
                              {feature.label}
                            </Checkbox>
                          );
                        })}
                        <Checkbox
                              key={"cy"}
                              onChange={(e) => setCyclinderChecked(e.target.checked)}
                            >
                              Cylinders
                        </Checkbox>
                         {CyclinderChecked && cylinders.map((data, idx) => {
                              {
                                return (
                                  <Checkbox
                                  style={{marginLeft: "30px"}}
                                    key={idx}
                                    value={data}
                                    onChange={(e) =>
                                      updateFilter('cylinders', e)
                                    }
                                  >
                                    {data}
                                  </Checkbox>
                                );
                              }
                            })}
                         
                      </div> */}

                        <div className="box">
                          <Title level={5}>
                            {getLocaleMessages("Deposit")}
                          </Title>
                          {entryAttr.deposit.map((deposit, idx) => {
                            return (
                              <Checkbox
                                key={idx}
                                value={deposit?.value}
                                onChange={(e) => updateFilter("deposit", e)}
                              >
                                {deposit?.label}
                              </Checkbox>
                            );
                          })}
                        </div>
                        <div className="box">
                          <Title level={5}>
                            {getLocaleMessages("Chauffeur")}
                          </Title>
                          {entryAttr.driver.map((driver, idx) => {
                            return (
                              <Checkbox
                                key={idx}
                                defaultChecked={
                                  driver == "With Driver" &&
                                  filterCarElements.WithDriver
                                    ? true
                                    : false
                                }
                                value={driver?.value}
                                onChange={(e) => updateFilter("driver", e)}
                              >
                                {driver?.label}
                              </Checkbox>
                            );
                          })}
                        </div>
                        {/* <div className="box">
                       <Title level={5}>Additional Features</Title>                      
                       {entryAttr.additional.map((feature,idx) => {return(<Checkbox key={idx} value={feature.label} onChange={e=> updateFilter(feature.value, e)}>{feature.label}</Checkbox> )})} 
                    </div> */}
                        {/* <div className="box">
                      <Title level={5}>Agency</Title>                      
                       {agencylist && agencylist.map(agency => {return(<Checkbox key={agency.id} value={agency.firstname + " " + agency.lastname} onChange={e=> updateFilter("agencyname", e)}>{agency.firstname + " " + agency.lastname}</Checkbox> )})} 
                    </div> */}
                      </div>
                    </Form>
                  )}{" "}
                </Col>
              </Row>
            </div>
          </section>
        </Content>
        <Footer />
      </Layout>
    </>
  );
};

export default Listing;
