// // import React, { Component, useState, useEffect } from 'react';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { NavLink } from 'react-router-dom';
// // import { Layout, Menu, Breadcrumb, Row, Col, List, Card, Form, Select } from 'antd';

// // import carAction from './../redux/car/actions';
// // import carPresetAction from './../redux/admin/car/actions';
// // import format from 'date-fns/format';
// // import Header from './../views/Users/Header';
// // import Footer from './../views/Common/Footer/Footer';
// // import CarItem from './../views/Users/CarItem';
// // import {MenuFoldOutlined} from '@ant-design/icons';
// // const { Content } = Layout;
// // const { Option } = Select;
// // const style = { padding: '8px 0', minHeight: 900 };

// // const UserLayout = () => {

// //   const dispatch = useDispatch();
// //   const { carList } = useSelector((state) => state.CarListing);
// //   const { carinformation} = useSelector((state) => state.CarInfo);
// //   const [showCarModel, setshowCarModel] = useState(false);
// //   const [usedForm] = Form.useForm();

// //   useEffect(() => { 
// //     dispatch({
// //       type: carPresetAction.GET_CAR_INFO,
// //       payload: false,
// //     }); 
// //     dispatch({
// //         type: carAction.GET_CAR_MODEL_LIST,
// //         payload: false,
// //     });    
// //   }, []);

// //   const onFormLayoutChange = (values) => {
// //     console.log(values)
// //   }

// //   return (
// //       <Layout>
// //         <Header />
// //         <Content >
// //           <section>
// //           <Form form={usedForm} layout="inline"  onValuesChange={()=> onFormLayoutChange()}>       
// //             <Select
// //               showSearch
// //               allowClear
// //               optionFilterProp="children"
// //               filterOption={(input, option) =>
// //                 option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
// //               }
// //               placeholder={''}
// //               dropdownStyle={{ minWidth: '200px' }}
// //             >
// //               {carinformation.brand && carinformation.brand.map(value => {
// //                 return (
// //                   <Option key={value.id} value={value.id}>
// //                     {value.carbrandname}
// //                   </Option>
// //                 );
// //               })}
// //             </Select>        
// //             <Select
// //               showSearch
// //               allowClear
// //               optionFilterProp="children"
// //               filterOption={(input, option) =>
// //                 option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
// //               }
// //               autoComplete={'off'}
// //               placeholder={''}
// //               dropdownStyle={{ minWidth: '200px' }}
// //             >
// //               {carinformation.model && carinformation.model.map(value => {
// //                 return (
// //                   <Option key={value.id} value={value.id}>
// //                     {value.carmodelname}
// //                   </Option>
// //                 );
// //               })}
// //             </Select>         
// //             <Select
// //               showSearch
// //               allowClear
// //               optionFilterProp="children"
// //               filterOption={(input, option) =>
// //                 option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
// //               }
// //               autoComplete={'off'}
// //               placeholder={''}
// //               dropdownStyle={{ minWidth: '200px' }}
// //             >
// //               {carinformation.year && carinformation.year.map(value => {
// //                 return (
// //                   <Option key={value.id} value={value.id}>
// //                     {value.caryearname}
// //                   </Option>
// //                 );
// //               })}
// //             </Select>
// //           </Form>
// //           </section>
// //         </Content>
// //         <Content style={{ padding: '0 50px', marginTop: 5 }}>

// //           <div style={{ padding: 40, minHeight: 700 }}>
// //             <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
// //               <Col className="gutter-row" span={18}>
// //                 <div style={style}>
// //                   <List
// //                     grid={{
// //                       gutter: 16,
// //                       column: 2
// //                     }}
// //                     dataSource={carList}
// //                     renderItem={ car => <CarItem {...car} /> }
// //                   />
// //                 </div>
// //               </Col>
// //               <Col className="gutter-row" span={6}>
// //                 <div style={style}>col-6</div>
// //               </Col>

// //             </Row>
// //           </div>
// //         </Content>
// //         <Footer />
// //       </Layout>
// //     );

// // }

// // export default UserLayout;

// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Link } from "react-router-dom";
// import {
//   Layout,
//   Row,
//   Col,
//   Button,
//   Typography,
//   Card,
//   Carousel,
//   Skeleton,
//   Input,
//   Form,
//   DatePicker,
//   Menu,
//   Avatar,
//   Image,
//   Rate,
//   Slider,
//   Switch,
//   Tabs,
//   Select,
//   Breadcrumb,
//   Space,
//   Dropdown,
//   Checkbox,
//   Modal,
//   message,
// } from "antd";
// import Header from "./../views/Common/Header/Header";
// import Footer from './../views/Common/Footer/Footer';
// import {
//   SearchOutlined,
//   UserAddOutlined,
//   MenuUnfoldOutlined,
//   MenuFoldOutlined,
//   FormOutlined,
//   UserOutlined,
//   ExclamationCircleOutlined,
// } from "@ant-design/icons";

// import { history, store } from "./../../../redux/store";
// import { uploadRequest } from "./../../../helpers/axiosClient";

// import "./../../assets/css/userStyle.css";

// const { Content } = Layout;
// const { Option } = Select;
// const { Title, Paragraph } = Typography;
// const { Meta } = Card;
// const { SubMenu } = Menu;
// const { TabPane } = Tabs;

// const caroselItems = [1, 2, 3, 4, 5, 6, 7, 8];
// const dumyCars = [1, 2, 3, 4, 5, 6];

// const Home = () => {
//   const [form] = Form.useForm();
//   const dispatch = useDispatch();
//   const { subLang, loader, isLoggedIn, isOtp, isemail } = useSelector(
//     (state) => state.Auth
//   );
//   const LayoutData = useSelector((state) => state.Layouts);
//   const [CurrentKey, setCurrentKey] = useState("");
//   const [menuClicked, setmenuClicked] = useState(false);
//   const {
//     categoryLoader,
//     categoryData,
//     saloonLoader,
//     saloonData,
//     topRatingLoader,
//     topRatingData,
//   } = LayoutData;

//   useEffect(() => {
//     // store.dispatch({
//     //   type: actions.GET_LAYOUT_CATEGORIES,
//     // })
//     // store.dispatch({
//     //   type: actions.GET_LAYOUT_SALOON,
//     // })
//     // store.dispatch({
//     //   type: actions.GET_LAYOUT_TOP_RATING,
//     // })
//   }, []);
//   const [ImageName, setImageName] = useState("");
//   const onChange = ({ file }) => {
//     let form = new FormData();
//     form.append("file", file);

//     uploadRequest("public/upload", form).then((res) => {
//       let image = res.data;
//       let imageName = image[0].data.filePath.split("__uploads/")[1];
//       setImageName(imageName);
//       console.log(imageName);
//     });
//     console.log(ImageName);
//   };

//   const settings = {
//     infinite: true,
//     speed: 600,
//     dots: false,
//     arrows: true,
//     autoplay: true,
//     slidesToShow: 6,
//     slidesToScroll: 1,
//   };

//   const settingsDestination = {
//     infinite: true,
//     speed: 600,
//     dots: true,
//     arrows: false,
//     autoplay: true,
//     slidesToShow: 5,
//     slidesToScroll: 1,
//   };

//   const handleMenuClick = (e) => {
//     setmenuClicked(!menuClicked);
//   };

  

//   const [modalDetails, SetModalDetails] = useState(false);

//   const showModalDetail = () => {
//     SetModalDetails(true);
//   };

//   const handleCancelDetail = () => {
//     SetModalDetails(false);
//   };

//   const handleRentNow = () => {
//     history.push('/detail');
//   }

//   return (
//     <>
//       <Layout className={"on-boarding"}>
//         <Header />
//         <Content>
//           <section className="search-result">
//             <div className="container">
//               <div>
//                 <Title level={4}>Search Result</Title>

//                 <Breadcrumb>
//                   <Breadcrumb.Item>
//                     <Link to="/">Search</Link>
//                   </Breadcrumb.Item>
//                   <Breadcrumb.Item>Choose A Car</Breadcrumb.Item>
//                 </Breadcrumb>
//               </div>

             
//             </div>
//           </section>
//         </Content>

//         <Modal
//           visible={modalDetails}
//           onCancel={handleCancelDetail}
//           footer={false}
//           className="modal-detail-popup"
//           width="100%"
//           destroyOnClose
//           maskStyle={{ background: "rgb(255 255 255 / 75%)" }}
//         >
//           <div className="car-container">
//             <div className="img">
//               <div>
//               <Link to="/detail">
//                 <img
//                   src={require("./../../../assets/images/Bugatti.png").default}
//                   alt="Car"
//                 />
//                 </Link>
//               </div>
//               <span className="year">2020</span>
//             </div>

//             <Title level={3}>Mercedes Benz</Title>
//             <div className="specification">
//               <div className="box">
//                 <div>
//                   {" "}
//                   <img
//                     src={
//                       require("./../../../assets/images/Comfortable.png").default
//                     }
//                     alt="Car"
//                   />{" "}
//                   <span>Comfortable</span>{" "}
//                 </div>
//               </div>
//               <div className="box">
//                 <div>
//                   {" "}
//                   <img
//                     src={
//                       require("./../../../assets/images/Automatic-gear.png")
//                         .default
//                     }
//                     alt="Car"
//                   />{" "}
//                   <span>Automatic Gear</span>{" "}
//                 </div>
//               </div>
//               <div className="box">
//                 <div>
//                   {" "}
//                   <img
//                     src={
//                       require("./../../../assets/images/full-Coverage.png")
//                         .default
//                     }
//                     alt="Car"
//                   />{" "}
//                   <span>Full Coverage</span>{" "}
//                 </div>
//               </div>
//               <div className="box">
//                 <div>
//                   {" "}
//                   <img
//                     src={
//                       require("./../../../assets/images/UnLimited.png").default
//                     }
//                     alt="Car"
//                   />{" "}
//                   <span>Unlimited</span>{" "}
//                 </div>
//               </div>
//               <div className="box">
//                 <div>
//                   {" "}
//                   <img
//                     src={
//                       require("./../../../assets/images/5-Persons.png").default
//                     }
//                     alt="Car"
//                   />{" "}
//                   <span>5 Persons</span>{" "}
//                 </div>
//               </div>
//               <div className="box cursor-pointer" onClick={showModalDetail}>
//                 <div>
//                   {" "}
//                   <img
//                     src={
//                       require("./../../../assets/images/view-all-arrow.png")
//                         .default
//                     }
//                     alt="Car"
//                   />{" "}
//                   <span>View all Specifications</span>{" "}
//                 </div>
//               </div>

//               <div className="foroneDays">
//                 <Paragraph>
//                   for 1 Day's <span className="bold">SAR 2600</span>
//                 </Paragraph>
//                 <Button>Rent Now</Button>
//               </div>
//             </div>
//           </div>

//           <Tabs defaultActiveKey="1" centered>
//             <TabPane tab="All Specification" key="1">
//               <div className="fullSpecification">
//                 <div className="box">
//                   <div>
//                     {" "}
//                     <img
//                       src={
//                         require("./../../../assets/images/Comfortable.png")
//                           .default
//                       }
//                       alt="Car"
//                     />{" "}
//                   </div>
//                   <span>Comfortable</span>{" "}
//                 </div>
//                 <div className="box">
//                   <div>
//                     {" "}
//                     <img
//                       src={
//                         require("./../../../assets/images/Automatic-gear.png")
//                           .default
//                       }
//                       alt="Car"
//                     />{" "}
//                   </div>
//                   <span>Automatic Gear</span>{" "}
//                 </div>
//                 <div className="box">
//                   <div>
//                     {" "}
//                     <img
//                       src={
//                         require("./../../../assets/images/full-Coverage.png")
//                           .default
//                       }
//                       alt="Car"
//                     />{" "}
//                   </div>
//                   <span>Full Coverage</span>{" "}
//                 </div>
//                 <div className="box">
//                   <div>
//                     {" "}
//                     <img
//                       src={
//                         require("./../../../assets/images/UnLimited.png").default
//                       }
//                       alt="Car"
//                     />{" "}
//                   </div>
//                   <span>Unlimited</span>{" "}
//                 </div>
//                 <div className="box">
//                   <div>
//                     {" "}
//                     <img
//                       src={
//                         require("./../../../assets/images/5-Persons.png").default
//                       }
//                       alt="Car"
//                     />{" "}
//                   </div>
//                   <span>5 Persons</span>{" "}
//                 </div>
//               </div>
//             </TabPane>
//             <TabPane tab="Image Gallery" key="2">
//               <Row>
//                 {dumyCars.map(() => (
//                   <Col span={8}>
//                     <Image
//                       width="100%"
//                       src={require("./../../../assets/images/img3.png").default}
//                     />
//                   </Col>
//                 ))}
//               </Row>
//             </TabPane>
//             <TabPane tab="Rate & Reviews" key="3">
//               <ul className="review-loop">
//                 <li>
//                   <Typography className="box">
//                     <Avatar shape="square" size={50} icon={<UserOutlined />} />
//                     <Title level={4}>
//                       Ramesh Kumar{" "}
//                       <span className="date">8/11/2020 11:10 AM</span>
//                     </Title>
//                     <Rate value={4} disabled />
//                     <Paragraph>
//                       Lorem ipsum dolor sit amet, consectetur adipisicing elit,
//                       sed do eiusmod tempor incididunt ut labore et. Excepteur
//                       sint occaecat cupidatat
//                     </Paragraph>
//                   </Typography>
//                 </li>
//                 <li>
//                   <Typography className="box">
//                     <Avatar shape="square" size={50} icon={<UserOutlined />} />
//                     <Title level={4}>
//                       Ramesh Kumar{" "}
//                       <span className="date">8/11/2020 11:10 AM</span>
//                     </Title>
//                     <Rate value={4} disabled />
//                     <Paragraph>
//                       Lorem ipsum dolor sit amet, consectetur adipisicing elit,
//                       sed do eiusmod tempor incididunt ut labore et. Excepteur
//                       sint occaecat cupidatat
//                     </Paragraph>
//                   </Typography>
//                 </li>
//               </ul>
//             </TabPane>
//           </Tabs>
//         </Modal>

//         <Footer />
//       </Layout>
//     </>
//   );
// };

// export default Home;
