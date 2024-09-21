import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Input,
  Button,
  Divider,
  Form,
  Checkbox,
  Select,
  Card,
  Typography,
  InputNumber,
  Space,
  Modal,
  message,
  Radio,
} from "antd";
import { formProps } from "../../../helpers/constant";
import { EyeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import settingsAction from "../../../redux/admin/car/actions";
import cityAction from "../../../redux/admin/address/actions";
import "./../../../assets/css/adminStyle.css";
import UploadImages from "../../../components/shared/uploadImages";
import UploadFiles from "../../../components/shared/uploadFiles";
import CoverImageUpload from "../../../components/shared/CoverImageUpload";
import InteriorImageUpload from "./../../../components/shared/InteriorImageUpload";
import { getLocalDataType, getLocaleMessages } from "redux/helper";
import moment from "moment";
import _, { values } from "lodash";
import LoadingOverlay from "react-loading-overlay";
import { Link } from "react-router-dom";

const { Option } = Select;
const { Title } = Typography;
const cylinderArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const CarComponent = (props) => {
  const dispatch = useDispatch();
  const [usedForm] = Form.useForm();
  const {
    carinformation,
    carinfo_carid,
    carinfo_interriorimage,
    carinfo_supportdocs,
    carinfo_carareas,
    agencyinfo,
    isLoading,
  } = useSelector((state) => state.CarInfo);
  const { area_data, city_data, country_data } = useSelector(
    (state) => state.Address
  );
  const [curTime, setcurTime] = useState(new Date());
  const [carCylinder, setCarCylinder] = useState();
  const [CarTransmission, setCarTransmission] = useState(0);
  const [CarImages, setCarImages] = useState([]);
  const [CarDocuments, setCarDocuments] = useState([]);
  const [CarArea, setCarArea] = useState([]);
  const [HasDriver, setHasDriver] = useState(false);
  const [Category, setCategory] = useState(0);
  const [HasSpeed, setHasSpeed] = useState(false);
  const [AgentId, setAgentId] = useState(
    JSON.parse(localStorage.getItem("user_data"))["id"]
  );
  const [visible, setvisible] = useState(false);
  const [SupportDocs, setSupportDocs] = useState({});
  const [CityFilter, setCityFilter] = useState([]);
  const [AreaFilter, setAreaFilter] = useState([]);
  const [CoverImagePath, setCoverImagePath] = useState({ name: "" });
  const [CoverImage, setCoverImage] = useState();
  const [CountrySelectedID, setCountrySelectedID] = useState();

  const [IntImagePath, setIntImagePath] = useState({ name: "" });
  const [IntImage, setIntImage] = useState();
  const [value, setValue] = React.useState(true);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onFinishDetails = async (values) => {
    // if (
    //   CoverImage &&
    //   (CoverImage.name == undefined || CoverImage.name.length == 0)
    // ) {
    //   message.error(getLocaleMessages("Please input the cover image"));
    //   return;
    // }
    var documents = await processDocuments();
    // if (documents <= 2) {
    //   message.error(getLocaleMessages('Please upload atleast 2 support documents'));
    //   return;
    // }

    // if((values.ispickupavailable == undefined || values.ispickupavailable == false) && (values.isdropoffavailable !== undefined || values.isdropoffavailable == false) && (values.showdashboard !== undefined && values.showdashboard == false) ){
    //   message.error(getLocaleMessages("Please select atleast one in IsPickup Available | IsDropoff Available | ShowDashboard"));
    //   return;
    // }
    var areas = await processCarArea(
      values.areaid,
      values.cityid,
      values.countryid
    );
    var data = {
      action: props.location.state !== undefined ? "U" : "I",
      carinfo: {
        carno: values.carno,
        carbrand: values.carbrand,
        carmodel: values.carmodel,
        caryear: values.caryear,
        carpriceperday: values.carpriceperday,
        cardeposite: values.cardeposite,
        carstatus: true, //values.carstatus,
        showdashboard: values.showdashboard, // ShowDashboard !== undefined? ShowDashboard : false,
        cityid: values.cityid,
        countryid: values.countryid,
        minbookingdays: values.minbookingdays,
        vat: 0,
        agentid: getLocalDataType() === "agency" ? AgentId : values.agentid,
        carcoverimagepreview: CarImages.cover,
        ispickupavailable: false,
        // values.ispickupavailable !== undefined ? values.ispickupavailable : false,
        isdropoffavailable: false,
        //  values.isdropoffavailable !== undefined ? values.isdropoffavailable : false,
        specificlocation:
          values.specificlocation !== undefined
            ? values.specificlocation
            : false,
        coverimagepath:
          CoverImage !== undefined ? CoverImage.name : CoverImagePath.name,
        category: values.category,
        sortorder: 0,
        //values.sortorder,
      },
      carfeatures: {
        carinformationid: "",
        carinsurance: values.carinsurance,
        cardropofdate: moment(new Date()),
        carmilege: values.carmilege,
        carcylinder: carCylinder,
        cardriver: values.cardriver,
        cardrivercharge: HasDriver ? values.cardrivercharge : 0,
        carsunroof: values.carsunroof,
        cartransmission: CarTransmission,
        carseat: values.carseat,
        carspeed: values.carspeed,
        carspeedlimit:
          values.carspeedlimit !== undefined ? values.carspeedlimit : 0,
        cartype: values.cartype,
      },
      carinterrior: IntImage,
      cardocuments: documents,
      carareas: [1], // areas,
    };
    dispatch({
      type: settingsAction.CAR_INFORMATION_IUD,
      payload: data,
      callBackAction: (resp) => {
        window.location.href = "/admin/cars";
      },
    });
  };

  const onTrasmissionChagne = (e) => {
    setCarTransmission(e);
  };

  const processInterriorImages = () => {
    let data = CarImages.map((img) => ({
      id: img.id !== undefined ? img.id : -1,
      carinterriorimagename: img.name,
      carimageorderid: img.type,
      carcoverimage: img.type == 5 ? true : false,
      hasRemoved: img.hasRemoved,
    }));
    return data;
  };

  const processCarArea = (area, cityid, countryid) => {
    const formdata =
      area &&
      area.map((area) => ({
        areaid: area,
        cityid: cityid,
        countryid: countryid,
      }));
    return formdata;
  };

  const processDocuments = () => {
    let data = CarDocuments.map((doc) => {
      return {
        sortorder: doc.doc || doc.sortorder,
        supportdocumentname: doc.name,
        hasRemoved: doc.hasRemoved,
      };
    });
    return data;
  };
  // const handleCarImages = (props) => {
  //   const index = CarImages.findIndex(e => e.type === props.type);
  //   if(index === -1){
  //     setCarImages(CarImages => [...CarImages, props])
  //   }
  //   else {
  //     const newOuter = _.cloneDeep(CarImages) // cloneDeep() is coming from the Lodash lib
  //     newOuter[index].hasRemoved = props.hasRemoved;
  //     newOuter[index].name = props.name;
  //     setCarImages(newOuter)
  //   }
  // }

  const handleSupportDocs = (props) => {
    const index = CarDocuments.findIndex((e) => e.doc === props.doc);
    if (index === -1) {
      setCarDocuments((CarDocuments) => [...CarDocuments, props]);
    } else {
      const newOuter = _.cloneDeep(CarDocuments); // cloneDeep() is coming from the Lodash lib
      newOuter[index].hasRemoved = props.hasRemoved;
      newOuter[index].name = props.name;
      newOuter[index].sortorder = props.doc;
      setCarDocuments(newOuter);
    }
  };

  // const handleCityChange = (value) =>{
  //   const data  = area_data && area_data.filter(area => area.cityid === value);
  //   setAreaFilter(data)
  // }

  // const handleCountryChange = (value) =>{
  //   const data  = city_data && city_data.filter(city => city.countryid === value);
  //   setCityFilter(data);
  // }

  // useEffect(() => {
  //   if(CountrySelectedID){
  //     const data  = city_data && city_data.filter(city => city.countryid === carinfo_carid.countryid);
  //     setCityFilter(data);
  //   }
  // }, [CountrySelectedID])

  // useEffect(() => {
  //   if(CityFilter){
  //     usedForm.setFieldsValue({cityid: carinfo_carid.cityid})
  //     let data = []
  //     carinfo_carareas.map(res => {
  //       data.push(res.areaid)
  //     })
  //     usedForm.setFieldsValue({areaid: data})
  //   }
  // }, [CityFilter])

  useEffect(() => {
    if (CountrySelectedID !== undefined) {
      let data = [];
      carinfo_carareas.map((res) => {
        data.push(res.areaid);
      });
      usedForm.setFieldsValue({ areaid: data });
    }
  }, [CountrySelectedID, area_data]);
  const handleCylinderInput = (value) => {
    if (value > 0 && value < 13) {
      setCarCylinder(value);
    } else {
      message.warn(getLocaleMessages("Maximum 12 cylinder's allowed"));
      return;
    }
  };

  useEffect(() => {
    usedForm.resetFields();
    if (props.location.state !== undefined) {
      dispatch({
        type: settingsAction.GET_CAR_INFO_BYCARID,
        payload: props.location.state.carid,
      });
    } else {
      usedForm.resetFields();
    }

    dispatch({
      type: settingsAction.GET_CAR_INFO,
      payload: false,
    });
    if (getLocalDataType() === "admin") {
      dispatch({
        type: settingsAction.GET_AGENCY_INFO,
        payload: false,
      });
    }
    dispatch({
      type: cityAction.GET_COUNTRY_LIST,
      payload: false,
    });
    dispatch({
      type: cityAction.GET_CITY_MANAGEMENT,
      payload: false,
    });
    dispatch({
      type: cityAction.GET_AREA_MANAGEMENT,
      payload: false,
    });
  }, []);

  useEffect(() => {
    if (props.location.state !== undefined && carinfo_carid !== undefined) {
      usedForm.setFieldsValue({
        ...carinfo_carid,
        caraction: parseInt(carinfo_carid.caraction),
        cartransmission: carinfo_carid.cartransmission == 0 ? false : true,
        carstatus: carinfo_carid.carstatus == 1 ? true : false,
        specificlocation: carinfo_carid.specificlocation == 1 ? true : false,
      });

      setCountrySelectedID(carinfo_carid.cityid);

      setCarCylinder(carinfo_carid.carcylinder);
      setCarTransmission(carinfo_carid.cartransmission);
      setHasDriver(carinfo_carid.cardriver);
      setCategory(carinfo_carid.category);
      setHasSpeed(carinfo_carid.carspeed);
      // setShowDashboard(carinfo_carid.showdashboard);
      setCoverImagePath({
        uid: carinfo_carid.carid,
        name: carinfo_carid.coverimagepath,
        status: "done",
        url:
          carinfo_carid.coverimagepath !== ""
            ? `https://api.drivelounge.com/${carinfo_carid.coverimagepath}`
            : "",
        thumbUrl:
          carinfo_carid.coverimagepath !== ""
            ? `https://api.drivelounge.com/${carinfo_carid.coverimagepath}`
            : "",
      });
      setCoverImage({
        uid: carinfo_carid.carid,
        name: carinfo_carid.coverimagepath,
        status: "done",
        url: `https://api.drivelounge.com/${carinfo_carid.coverimagepath}`,
        thumbUrl: `https://api.drivelounge.com/${carinfo_carid.coverimagepath}`,
      });
    }
    if (props.location.state !== undefined && carinfo_carid !== undefined) {
      let data = [];
      carinfo_interriorimage &&
        carinfo_interriorimage.map((carimage, idx) => {
          data.push({
            uid: idx,
            name: carimage.carinterriorimagename,
            status: "done",
            url: `https://api.drivelounge.com/${carimage.carinterriorimagename}`,
            thumbUrl: `https://api.drivelounge.com/${carimage.carinterriorimagename}`,
          });
        });
      setIntImagePath(data);
      setIntImage(data);
      // carinfo_interriorimage && carinfo_interriorimage.map(carimage => {
      //   setCarImages(CarImages => [...CarImages, {
      //     id: carimage.id,
      //     type: carimage.carimageorderid,
      //     name: carimage.carinterriorimagename,
      //     hasRemoved: carimage.status == 1 ? false : true
      //   }]);
      // })
      let docs = [];
      carinfo_supportdocs &&
        carinfo_supportdocs.map((doc) => {
          // setCarDocuments(CarDocuments => [...CarDocuments, {
          //   id: doc.id,
          //   name: doc.supportdocumentname,
          //   hasRemoved: doc.status == 1 ? false : true
          // }])
          docs.push({
            id: doc.id,
            name: doc.supportdocumentname,
            hasRemoved: doc.status == 1 ? false : true,
            sortorder: doc.sortorder,
          });
        });
      setCarDocuments(docs);
    }
  }, [carinfo_carid]);

  useEffect(() => {
    if (props.location.state == undefined && carinformation !== undefined) {
      const row = carinformation.row !== undefined && carinformation.row[0];
      const { rowid } = row;
      usedForm.setFieldsValue({ carno: rowid });
    }
  }, [carinformation]);

  const Supportdocview = ({ title, sortorder }) => {
    return (
      props.location.state &&
      carinfo_supportdocs.map((data) => {
        if (data.sortorder === sortorder) {
          return (
            <EyeOutlined
              key={data.id}
              onClick={() => {
                setvisible(!visible);
                setSupportDocs({
                  title: title,
                  url: carinfo_supportdocs.length
                    ? data.supportdocumentname
                    : "",
                });
              }}
            />
          );
        }
      })
    );
  };

  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text={getLocaleMessages("Loading your content...")}
    >
      <div className="page-container">
        <Modal
          title={
            SupportDocs.name !== undefined &&
            getLocaleMessages(SupportDocs.title)
          }
          visible={visible}
          centered
          footer={false}
          width={800}
          className="ant_modal_car"
          destroyOnClose
          onCancel={() => setvisible(!visible)}
        >
          <div>
            <iframe
              width="100%"
              height="600px"
              alt="example"
              src={`https://api.drivelounge.com/${SupportDocs.url}`}
            />
          </div>
        </Modal>

        <Form form={usedForm} onFinish={onFinishDetails} requiredMark={true}>
          <Card
            title={getLocaleMessages("Car Information")}
            extra={
              <Button>
                <Link
                  to={{
                    pathname:
                      getLocalDataType() === "admin"
                        ? `/admin/cars`
                        : `/agency/cars`,
                  }}
                  className="backtoBook"
                >
                  <ArrowLeftOutlined /> {getLocaleMessages("Back")}
                </Link>
              </Button>
            }
          >
            <Row gutter={20}>
              <Col span={6} className="inner-content">
                <Form.Item
                  label={getLocaleMessages("Car No")}
                  requiredMark
                  name="carno"
                  rules={[
                    {
                      required: true,
                      message: getLocaleMessages("Fields are required"),
                    },
                  ]}
                >
                  <Input disabled placeholder="" />
                </Form.Item>
              </Col>
              <Col span={6} className="inner-content">
                <Form.Item
                  label={getLocaleMessages("Brand")}
                  name={"carbrand"}
                  required
                  requiredMark={true}
                  rules={[
                    {
                      required: true,
                      message: `${getLocaleMessages(
                        "Select"
                      )} ${getLocaleMessages("Brand")}`,
                    },
                  ]}
                >
                  <Select
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder={""}
                    dropdownStyle={{ minWidth: "200px" }}
                  >
                    {carinformation.brand &&
                      carinformation.brand.map((value) => {
                        return (
                          <Option key={value.id} value={value.id}>
                            {value.carbrandname}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6} className="inner-content">
                <Form.Item
                  label={getLocaleMessages("Model")}
                  name={"carmodel"}
                  rules={[
                    {
                      required: true,
                      message: `${getLocaleMessages(
                        "Select"
                      )} ${getLocaleMessages("Model")}`,
                    },
                  ]}
                >
                  <Input placeholder="" />
                </Form.Item>
              </Col>
              <Col span={6} className="inner-content">
                <Form.Item
                  label={getLocaleMessages("Year")}
                  name={"caryear"}
                  rules={[
                    {
                      required: true,
                      message: `${getLocaleMessages(
                        "Select"
                      )} ${getLocaleMessages("Year")}`,
                    },
                  ]}
                >
                  {/* <Input /> */}

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
                          <Option
                            key={value.caryearname}
                            value={value.caryearname}
                          >
                            {value.caryearname}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6} className="inner-content">
                <Form.Item
                  label={getLocaleMessages("Price per day")}
                  name={"carpriceperday"}
                  rules={[
                    {
                      required: true,
                      message: getLocaleMessages("Fields are required"),
                    },
                  ]}
                >
                  <Input
                    placeholder=""
                    type="number"
                    min={0}
                    onChange={(e) => {
                      usedForm.setFieldsValue({
                        carpriceperday: e.target.value.replace(/[^0-9]/g, ""),
                      });
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={6} className="inner-content">
                <Form.Item
                  label={getLocaleMessages("Deposit")}
                  name="cardeposite"
                  rules={[
                    {
                      required: true,
                      message: getLocaleMessages("Fields are required"),
                    },
                  ]}
                >
                  <Input
                    placeholder=""
                    type="number"
                    min={0}
                    onChange={(e) => {
                      usedForm.setFieldsValue({
                        cardeposite: e.target.value.replace(/[^0-9]/g, ""),
                      });
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={6} className="inner-content">
                <Form.Item
                  label={getLocaleMessages("Country Name")}
                  name={"countryid"}
                  rules={[
                    {
                      required: true,
                      message: `${getLocaleMessages(
                        "Select"
                      )} ${getLocaleMessages("Country Name")}`,
                    },
                  ]}
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
                    {country_data &&
                      country_data.map((value) => {
                        return (
                          <Option key={value.id} value={value.id}>
                            {value.countryname}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6} className="inner-content">
                <Form.Item
                  label={getLocaleMessages("City Name")}
                  name={"cityid"}
                  rules={[
                    {
                      required: true,
                      message: `${getLocaleMessages(
                        "Select"
                      )} ${getLocaleMessages("City Name")}`,
                    },
                  ]}
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
                    {city_data &&
                      city_data.map((value) => {
                        return (
                          <Option key={value.id} value={value.id}>
                            {value.cityname}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
              {/* <Col span={12} className="inner-content">
                <Form.Item
                  label={getLocaleMessages('Area Name')}
                  name={'areaid'}
                  rules={[{ required: true, message: 'select the area name' }]}
                >
                  <Select
                    mode="multiple"
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    autoComplete={'off'}
                    placeholder={''}
                    dropdownStyle={{ minWidth: '200px' }}
                  >
                    {area_data &&
                      area_data.map((value) => {
                        return (
                          <Option key={value.areaid} value={value.id}>
                            {value.areaname}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col> */}
            </Row>

            <Row gutter={20}>
              {getLocalDataType() === "admin" && (
                <Col span={6}>
                  <Form.Item
                    label={getLocaleMessages("Agency Name")}
                    name={"agentid"}
                    rules={[
                      {
                        required: true,
                        message: `${getLocaleMessages(
                          "Select"
                        )} ${getLocaleMessages("Agency Name")}`,
                      },
                    ]}
                  >
                    <Select
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
                      {agencyinfo &&
                        agencyinfo.map((value) => {
                          return (
                            <Option key={value.id} value={value.id}>
                              {value.agencyname}
                            </Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                </Col>
              )}

              {/* <Col span={4} className="inner-content">
                    <Form.Item
                      label={'Vat'}
                      name={'vat'}
                      rules={[{ required: true, message: 'Select brand of the car' }]}
                    >
                      <Input placeholder="" />
                    </Form.Item>
                  </Col> */}
              <Col span={6} className="inner-content">
                <Form.Item
                  label={getLocaleMessages("Minimum Booking Days")}
                  name="minbookingdays"
                  rules={[
                    {
                      required: true,
                      message: getLocaleMessages("Fields are required"),
                    },
                  ]}
                >
                  <Input
                    placeholder=""
                    type="number"
                    min={0}
                    onChange={(e) => {
                      usedForm.setFieldsValue({
                        minbookingdays: e.target.value.replace(/[^0-9]/g, ""),
                      });
                    }}
                  />
                </Form.Item>
              </Col>
              {/* <Col span={8} className="inner-content">
                <Form.Item
                  label={getLocaleMessages('Status')}
                  name={'carstatus'}
                  rules={[{ required: true, message: 'Select car model' }]}
                >
                  <Radio.Group onChange={onChange} value={value}>
                    <Radio value={true}>{getLocaleMessages("Published")}</Radio>
                    <Radio value={false}>{getLocaleMessages("Unpublished")}</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col> */}
              <Col span={6} className="inner-content">
                <Form.Item
                  label={getLocaleMessages("Available for Specific location?")}
                  name={"specificlocation"}
                  rules={[
                    {
                      required: true,
                      message: `${getLocaleMessages(
                        "Select"
                      )} ${getLocaleMessages(
                        "Available for Specific location?"
                      )}`,
                    },
                  ]}
                >
                  <Radio.Group onChange={onChange} value={value}>
                    <Radio
                      value={true}
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      {getLocaleMessages("Yes")}
                    </Radio>
                    <Radio
                      value={false}
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      {getLocaleMessages("No")}
                    </Radio>
                  </Radio.Group>
                  {/* <Select
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    autoComplete={'off'}
                    placeholder={''}
                    dropdownStyle={{ minWidth: '200px' }}
                  >
                    <Option value={true}>{'Active'}</Option>
                    <Option value={false}>{'InActive'}</Option>
                  </Select> */}
                </Form.Item>
              </Col>
              {getLocalDataType() === "admin" && (
                <>
                  <Col span={6} className="inner-content">
                    <Form.Item
                      label={getLocaleMessages("Category")}
                      name={"category"}
                      defaultValue={Category}
                      rules={[
                        {
                          required: true,
                          message: `${getLocaleMessages(
                            "Select"
                          )} ${getLocaleMessages("Category")}`,
                        },
                      ]}
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
                        onChange={(e) => setCategory(e)}
                      >
                        <Option value={1}>
                          {getLocaleMessages("Platinum")}
                        </Option>
                        <Option value={2}>{getLocaleMessages("Gold")}</Option>
                        <Option value={3}>{getLocaleMessages("Silver")}</Option>
                        <Option value={0}>{getLocaleMessages("Others")}</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  {/* <Col span={6} className="inner-content">
                    <Form.Item
                      label={getLocaleMessages("Sort Order")}
                      name="sortorder"
                      rules={[
                        {
                          required: true,
                          message: getLocaleMessages("Fields are required"),
                        },
                      ]}
                    >
                      <Input placeholder="" type="number" />
                    </Form.Item>
                  </Col> */}
                </>
              )}
              <Col span={6}>
                {/* <Form.Item
                  name="ispickupavailable"
                  valuePropName="checked"
                
                >
                  <Checkbox>{getLocaleMessages("Is Pickup Available")}</Checkbox>
                </Form.Item>

                <Form.Item
                  name="isdropoffavailable"
                  valuePropName="checked"
                  
                >
                  <Checkbox>{getLocaleMessages("Is Dropoff Available")}</Checkbox>
                </Form.Item> */}

                {getLocalDataType() === "admin" && (
                  <Form.Item name="showdashboard" valuePropName="checked">
                    <Checkbox>
                      {getLocaleMessages("Show on home page")}
                    </Checkbox>
                  </Form.Item>
                )}
              </Col>
            </Row>
          </Card>

          <Card title={getLocaleMessages("Features")}>
            <Row gutter={20}>
              <Col span={6} className="inner-content">
                <Form.Item
                  label={getLocaleMessages("Insurance")}
                  name={"carinsurance"}
                  rules={[
                    {
                      required: true,
                      message: `${getLocaleMessages(
                        "Select"
                      )} ${getLocaleMessages("Insurance")}`,
                    },
                  ]}
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
                    {carinformation.insurance &&
                      carinformation.insurance.map((value) => {
                        return (
                          <Option key={value.id} value={value.id}>
                            {value.carinsurancename}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
              {/* <Col span={6} className="inner-content">
                  <Form.Item label={'Drop-off Date'}
                      name={'cardropofdate'}
                      rules={[{ required: true, message: 'Select drop off date' }]}>
                    
                      <DatePicker showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD HH:mm"/>
                                      
                  </Form.Item>
                  </Col> */}
              <Col span={6} className="inner-content">
                <Form.Item
                  label={getLocaleMessages("Mileage")}
                  name={"carspeed"}
                  rules={[
                    {
                      required: true,
                      message: `${getLocaleMessages(
                        "Select"
                      )} ${getLocaleMessages("Mileage")}`,
                    },
                  ]}
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
                    onChange={(e) => setHasSpeed(e)}
                  >
                    {carinformation.speed &&
                      carinformation.speed.map((value) => {
                        return (
                          <Option key={value.id} value={value.id}>
                            {value.carspeedname}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
              {HasSpeed == 2 && (
                <Col span={6} className="inner-content">
                  <Form.Item
                    label={getLocaleMessages("Mileage")}
                    name="carspeedlimit"
                  >
                    <Input placeholder="" />
                  </Form.Item>
                </Col>
              )}
              {/* <Col span={6} className="inner-content">
                <Form.Item
                  label={'Mileges'}
                  name={'carmilege'}
                  rules={[{ required: true, message: 'Select car milege' }]}
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
                    autoComplete={'off'}
                    placeholder={''}
                    dropdownStyle={{ minWidth: '200px' }}
                  >
                    {carinformation.milege &&
                      carinformation.milege.map((value) => {
                        return (
                          <Option key={value.id} value={value.id}>
                            {value.carmileagename}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col> */}

              {/* <Col span={6} className="inner-content" style={{ width: '50px' }}>
                <Form.Item
                  label={getLocaleMessages('Cylinders')}
                  name={'carcylinder'}
                  rules={[{ required: true, message: 'Select year of the car' }]}
                >
                  <Select
                        allowClear
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        autoComplete={'off'}
                        placeholder={''}
                        dropdownStyle={{ minWidth: '200px' }}
                        onChange={handleCylinderInput}
                      >
                        {cylinderArray && cylinderArray.map(value => {
                          return (
                            <Option key={value} value={value}>
                              {value}
                            </Option>
                          );
                        })}
                      </Select>
                </Form.Item>
              </Col> */}
              <Col span={6} className="inner-content">
                <Form.Item
                  label={getLocaleMessages("Gear")}
                  name={"cartransmission"}
                  defaultValue={CarTransmission}
                  rules={[
                    {
                      required: true,
                      message: `${getLocaleMessages(
                        "Select"
                      )} ${getLocaleMessages("Gear")}`,
                    },
                  ]}
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
                    onChange={onTrasmissionChagne}
                  >
                    <Option value={true}>
                      {getLocaleMessages("Automatic")}
                    </Option>
                    <Option value={false}>{getLocaleMessages("Manual")}</Option>
                  </Select>
                </Form.Item>
              </Col>
              {/* <Col span={6} className="inner-content">
                <Form.Item
                  label={getLocaleMessages('Sunroof')}
                  name={'carsunroof'}
                  rules={[{ required: true, message: 'Select sunroof availability' }]}
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
                    autoComplete={'off'}
                    placeholder={''}
                    dropdownStyle={{ minWidth: '200px' }}
                  >
                    <Option value={true}>{getLocaleMessages('Yes')}</Option>
                    <Option value={false}>{getLocaleMessages('No')}</Option>
                  </Select>
                </Form.Item>
              </Col> */}

              <Col span={6} className="inner-content">
                <Form.Item
                  label={getLocaleMessages("Driver")}
                  name={"cardriver"}
                  rules={[
                    {
                      required: true,
                      message: `${getLocaleMessages(
                        "Select"
                      )} ${getLocaleMessages("Driver")}`,
                    },
                  ]}
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
                    onChange={(e) => setHasDriver(e)}
                  >
                    <Option value={1}>
                      {getLocaleMessages("With Driver")}
                    </Option>
                    <Option value={0}>
                      {getLocaleMessages("Without Driver")}
                    </Option>
                    {/* <Option value={2}>{getLocaleMessages("Both")}</Option> */}
                  </Select>
                </Form.Item>
              </Col>
              {HasDriver !== 0 && HasDriver !== undefined && (
                <Col span={6} className="inner-content">
                  <Form.Item
                    label={`${getLocaleMessages(
                      "Driver Charges"
                    )} (${getLocaleMessages("Per Day")})`}
                    name="cardrivercharge"
                    rules={[
                      {
                        required: true,
                        message: getLocaleMessages("Fields are required"),
                      },
                    ]}
                  >
                    <Input
                      placeholder=""
                      type="number"
                      name="cardrivercharge"
                      min={0}
                      onChange={(e) => {
                        usedForm.setFieldsValue({
                          cardrivercharge: e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          ),
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
              )}
              {/* <Col span={6} className="inner-content">
                <Form.Item
                  label={getLocaleMessages('Car Seats')}
                  name={'carseat'}
                  rules={[{ required: true, message: 'Select car sitters' }]}
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
                    autoComplete={'off'}
                    placeholder={''}
                    dropdownStyle={{ minWidth: '200px' }}
                  >
                    {carinformation.seat &&
                      carinformation.seat.map((value) => {
                        return (
                          <Option key={value.id} value={value.id}>
                            {value.carseatsname}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col> */}

              <Col span={6} className="inner-content">
                <Form.Item
                  label={getLocaleMessages("Type")}
                  name={"cartype"}
                  rules={[
                    {
                      required: true,
                      message: `${getLocaleMessages(
                        "Select"
                      )} ${getLocaleMessages("Type")}`,
                    },
                  ]}
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
                    {carinformation.type &&
                      carinformation.type.map((value) => {
                        return (
                          <Option key={value.id} value={value.id}>
                            {value.cartypename}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title={getLocaleMessages("Cover Image")}>
            <CoverImageUpload
              setCoverImage={setCoverImage}
              ImagePath={CoverImagePath}
            />
          </Card>

          <Card title={getLocaleMessages("Interior Images")}>
            <InteriorImageUpload
              setIntImage={setIntImage}
              IntPath={IntImagePath}
            />
          </Card>

          {/* <Card title={getLocaleMessages("Support Documents")}>
            <table className="table_supportes">
              <tbody>
                <tr>
                  <td>1. {getLocaleMessages("Copy of car grant")} </td>
                  <td>
                    {" "}
                    <UploadFiles
                      {...(carinfo_supportdocs
                        ? _.find(
                            carinfo_supportdocs,
                            _.matchesProperty("id", 1)
                          )
                        : {})}
                      doc={1}
                      handleSupportDocs={(props) => {
                        handleSupportDocs(props);
                      }}
                    />
                  </td>
                  <td>
                    {carinfo_supportdocs.length ? (
                      Supportdocview({
                        title: getLocaleMessages("Copy of car grant"),
                        sortorder: 1,
                      })
                    ) : (
                      <></>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>2. {getLocaleMessages("Latest service receipt")} </td>
                  <td>
                    <UploadFiles
                      {...(carinfo_supportdocs
                        ? _.find(
                            carinfo_supportdocs,
                            _.matchesProperty("id", 2)
                          )
                        : {})}
                      doc={2}
                      handleSupportDocs={(props) => {
                        handleSupportDocs(props);
                      }}
                    />
                  </td>
                  <td>
                    {" "}
                    {carinfo_supportdocs.length ? (
                      Supportdocview({
                        title: getLocaleMessages("Latest service receipt"),
                        sortorder: 2,
                      })
                    ) : (
                      <></>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>3. {getLocaleMessages("Road Tax")}</td>
                  <td>
                    <UploadFiles
                      {...(carinfo_supportdocs
                        ? _.find(
                            carinfo_supportdocs,
                            _.matchesProperty("id", 3)
                          )
                        : {})}
                      doc={3}
                      handleSupportDocs={(props) => {
                        handleSupportDocs(props);
                      }}
                    />
                  </td>
                  <td>
                    {" "}
                    {carinfo_supportdocs.length ? (
                      Supportdocview({
                        title: getLocaleMessages("Road Tax"),
                        sortorder: 3,
                      })
                    ) : (
                      <></>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>4. {getLocaleMessages("Insurance")} </td>
                  <td>
                    {" "}
                    <UploadFiles
                      {...(carinfo_supportdocs
                        ? _.find(
                            carinfo_supportdocs,
                            _.matchesProperty("id", 4)
                          )
                        : {})}
                      doc={4}
                      handleSupportDocs={(props) => {
                        handleSupportDocs(props);
                      }}
                    />
                  </td>
                  <td>
                    {" "}
                    {carinfo_supportdocs.length ? (
                      Supportdocview({
                        title: getLocaleMessages("Insurance"),
                        sortorder: 4,
                      })
                    ) : (
                      <></>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    5. {getLocaleMessages("Authorized inspection result")}{" "}
                  </td>
                  <td>
                    {" "}
                    <UploadFiles
                      {...(carinfo_supportdocs
                        ? _.find(
                            carinfo_supportdocs,
                            _.matchesProperty("id", 5)
                          )
                        : {})}
                      doc={5}
                      handleSupportDocs={(props) => {
                        handleSupportDocs(props);
                      }}
                    />
                  </td>
                  <td>
                    {" "}
                    {carinfo_supportdocs.length ? (
                      Supportdocview({
                        title: getLocaleMessages(
                          "Authorized inspection result"
                        ),
                        sortorder: 5,
                      })
                    ) : (
                      <></>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </Card> */}

          {/* <Col span={4} className="inner-content">
                    <UploadImages {...(carinfo_interriorimage.length > 0 ? _.find(carinfo_interriorimage,_.matchesProperty('carimageorderid', 1)) : {})} Image={1} handleCarImages={(props)=>{handleCarImages(props)}}/>
                  </Col>
                  <Col span={4} className="inner-content">
                    <UploadImages {...(carinfo_interriorimage.length > 0 ? _.find(carinfo_interriorimage,_.matchesProperty('carimageorderid', 2)) : {})} Image={2} handleCarImages={(props)=>{handleCarImages(props)}}/>
                  </Col>
                  <Col span={4} className="inner-content">
                    <UploadImages {...(carinfo_interriorimage.length > 0 ? _.find(carinfo_interriorimage,_.matchesProperty('carimageorderid', 3)) : {})} Image={3} handleCarImages={(props)=>{handleCarImages(props)}}/>
                  </Col>
                  <Col span={4} className="inner-content">
                    <UploadImages {...(carinfo_interriorimage.length > 0 ? _.find(carinfo_interriorimage,_.matchesProperty('carimageorderid', 4)) : {})} Image={4} handleCarImages={(props)=>{handleCarImages(props)}}/>
                  </Col>
                  <Col span={4} className="inner-content">
                    <UploadImages {...(carinfo_interriorimage ? _.find(carinfo_interriorimage,_.matchesProperty('carimageorderid', 5)) : {})} Image={5} handleCarImages={(props)=>{handleCarImages(props)}}/>
                  </Col> */}

          <div className="button-center">
            <Button type="primary" htmlType="submit" className="save-btn">
              {props.location.state !== undefined
                ? getLocaleMessages("Update")
                : getLocaleMessages("Save")}
            </Button>
          </div>
        </Form>
      </div>
    </LoadingOverlay>
  );
};

export default CarComponent;
