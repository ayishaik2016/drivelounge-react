import React, { useState, useEffect } from "react";
import { Layout, Menu, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import actions from "./../../../redux/app/actions";
import { LogoutOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import authactions from "./../../../redux/auth/actions";
import { history, store } from "./../../../redux/store";
import _ from "lodash";
import {
  getLocalDataType,
  getLocalData,
  getLocaleMessages,
} from "redux/helper";
import StickyBox from "react-sticky-box";
const { Sider } = Layout;
const { SubMenu } = Menu;

const CustomIcon = ({ type, ...rest }) => {
  if (type !== null && type !== undefined && type !== "") {
    const icons = require(`@ant-design/icons`);
    const Component = icons[type];
    return <Component {...rest} />;
  }
};

function Sidebar(props) {

  const { responsiveMenu, handleResponsiveMenuHide } = props;

  // const AdminSidebar = [
  //   {
  //     key: 1,
  //     icon: 'DashboardOutlined',
  //     link: '/admin/dashboard',
  //     name: getLocaleMessages("Dashboard"),
  //     access: true,
  //     hasSubmenu: false,
  //   },
  //   {
  //     key: 2,
  //     icon: 'SettingOutlined',
  //     link: '/admin/settings',
  //     name: getLocaleMessages('Settings'),
  //     access: true,
  //     hasSubmenu: true,
  //     sublist: [
  //       {
  //         key: 201,
  //         icon: '',
  //         link: '/admin/configuration',
  //         name: getLocaleMessages('Configuration'),
  //         access: 'config',
  //       },
  //       {
  //         key: 202,
  //         icon: '',
  //         link: '/admin/SocialMedia',
  //         name: getLocaleMessages('Social Media'),
  //         access: true,
  //       },
  //       { key: 203, icon: '', link: '/admin/sms', name: getLocaleMessages('SMS'), access: true },
  //       { key: 204, icon: '', link: '/admin/smtp', name: getLocaleMessages('SMTP'), access: true },
  //     ],
  //   },
  //   // {
  //   //   key: 3,
  //   //   icon: "BellOutlined",
  //   //   link: "/admin/pushnotification",
  //   //   name: "Push Notification",
  //   //   hasSubmenu: false,
  //   // },
  //   {
  //     key: 4,
  //     icon: 'CalendarOutlined',
  //     link: '/admin/bookings',
  //     name: getLocaleMessages('Bookings'),
  //     hasSubmenu: false,
  //     access: true,
  //   },
  //   {
  //     key: 18,
  //     icon: 'UserOutlined',
  //     link: '/admin/application',
  //     name: getLocaleMessages('Application'),
  //     hasSubmenu: false,
  //     access: true,
  //   },
  //   {
  //     key: 5,
  //     icon: 'CarOutlined',
  //     link: '/admin/cars',
  //     name: getLocaleMessages('Cars'),
  //     hasSubmenu: true,
  //     access: true,
  //     sublist: [
  //       {
  //         key: 501,
  //         icon: '',
  //         link: '/admin/cars',
  //         name: getLocaleMessages('Car Management'),
  //         access: true,
  //       },
  //       {
  //         key: 502,
  //         icon: '',
  //         link: '/admin/brand',
  //         name: getLocaleMessages('Brand Management'),
  //         access: true,
  //       },
  //       {
  //         key: 503,
  //         icon: '',
  //         link: '/admin/cartype',
  //         name: getLocaleMessages('Car Type Management'),
  //         access: true,
  //       },
  //     ],
  //   },

  //   {
  //     key: 7,
  //     icon: 'CreditCardOutlined',
  //     link: '/admin/coupon',
  //     name: getLocaleMessages('Coupon'),
  //     hasSubmenu: false,
  //     access: true,
  //   },
  //   {
  //     key: 8,
  //     icon: 'UserAddOutlined',
  //     link: '/admin/customer',
  //     name: getLocaleMessages('Customer'),
  //     hasSubmenu: false,
  //     access: 'customer',
  //   },
  //   {
  //     key: 9,
  //     icon: 'ContactsOutlined',
  //     link: '/admin/address',
  //     name: getLocaleMessages('Address'),
  //     hasSubmenu: true,
  //     access: 'address',
  //     sublist: [
  //       {
  //         key: 901,
  //         icon: '',
  //         link: '/admin/city',
  //         name: getLocaleMessages('City Management'),
  //         access: 'city',
  //       },
  //       {
  //         key: 902,
  //         icon: '',
  //         link: '/admin/area',
  //         name: getLocaleMessages('Area Management'),
  //         access: 'area',
  //       },
  //       {
  //         key: 903,
  //         icon: '',
  //         link: '/admin/addresstype',
  //         name: getLocaleMessages('Address Type'),
  //         access: 'addrtype',
  //       },
  //     ],
  //   },
  //   {
  //     key: 10,
  //     icon: 'MessageOutlined',
  //     link: '/admin/enquiry',
  //     name: getLocaleMessages('Enquiry'),
  //     hasSubmenu: false,
  //     access: 'enquiry',
  //   },
  //   {
  //     key: 11,
  //     icon: 'FileDoneOutlined',
  //     link: '/admin/pagemanagement',
  //     name: getLocaleMessages('Page MGNT'),
  //     hasSubmenu: true,
  //     access: 'pgmnt',
  //     sublist: [
  //       {
  //         key: 111,
  //         icon: '',
  //         link: '/admin/cms',
  //         name: getLocaleMessages('CMS Management'),
  //         access: 'cms',
  //       },
  //       {
  //         key: 112,
  //         icon: '',
  //         link: '/admin/faq',
  //         name: getLocaleMessages('FAQ Management'),
  //         access: 'faq',
  //       },
  //     ],
  //   },
  //   {
  //     key: 12,
  //     icon: 'StarOutlined',
  //     link: '/admin/rating',
  //     name: getLocaleMessages('Rating & Review'),
  //     hasSubmenu: false,
  //     access: 'rating',
  //   },
  //   {
  //     key: 13,
  //     icon: 'InteractionOutlined',
  //     link: '/admin/activitylog',
  //     name: getLocaleMessages('Activity Log'),
  //     hasSubmenu: false,
  //     access: 'alog',
  //   },
  //   // {
  //   //   key: 14,
  //   //   icon: "FileDoneOutlined",
  //   //   link: "/admin/role",
  //   //   name: "Role",
  //   //   hasSubmenu: false,
  //   // },
  //   {
  //     key: 14,
  //     icon: 'FileDoneOutlined',
  //     link: '/admin/rolemanagement',
  //     name: getLocaleMessages('Role'),
  //     hasSubmenu: true,
  //     access: 'roles',
  //     sublist: [
  //       {
  //         key: 113,
  //         icon: '',
  //         link: '/admin/administrator',
  //         name: getLocaleMessages('Administrator'),
  //         access: 'admin',
  //       },
  //       {
  //         key: 114,
  //         icon: '',
  //         link: '/admin/role',
  //         name: getLocaleMessages('Role Management'),
  //         access: 'rolemgnt',
  //       },
  //     ],
  //   },
  //   {
  //     key: 15,
  //     icon: 'DollarCircleOutlined',
  //     link: '/admin/payment',
  //     name: getLocaleMessages('Paymet'),
  //     hasSubmenu: false,
  //     access: 'payment',
  //   },
  //   {
  //     key: 16,
  //     icon: 'LineChartOutlined',
  //     link: '/admin/report',
  //     name: getLocaleMessages('Report'),
  //     hasSubmenu: false,
  //     access: 'rept',
  //   },
  // ];
  const AgentSidebar = [
    {
      key: 1,
      icon: "DashboardOutlined",
      link: "/agency/dashboard",
      name: "Dashboard",
      hasSubmenu: false,
    },

    {
      key: 4,
      icon: "CalendarOutlined",
      link: "/agency/bookings",
      name: "Bookings",
      hasSubmenu: false,
    },

    {
      key: 5,
      icon: "CarOutlined",
      link: "/agency/cars",
      name: "Cars",
      // hasSubmenu: true,
      // sublist: [
      //   { key: 501, icon: '', link: '/agency/cars', name: 'Car Management' },
      //   { key: 502, icon: '', link: '/agency/brand', name: 'Brand Management' },
      //   {
      //     key: 503,
      //     icon: '',
      //     link: '/agency/cartype',
      //     name: 'Car Type Management',
      //   },
      // ],
    },

    // {
    //   key: 7,
    //   icon: 'CreditCardOutlined',
    //   link: '/agency/coupon',
    //   name: 'Coupon',
    //   hasSubmenu: false,
    // },

    {
      key: 16,
      icon: "LineChartOutlined",
      link: "/agency/report",
      name: "Report",
      hasSubmenu: false,
    },
    {
      key: 15,
      icon: "UserOutlined",
      link: "/agency/profile/update",
      name: "Profile",
      hasSubmenu: false,
    },
  ];

  const { currentKey } = useSelector((state) => state.App),
    dispatch = useDispatch();
  const { userpermission } = useSelector((state) => state.Auth);
  const [collapsed, setcollapsed] = useState(false);
  const [sidebarSubmenu, setsidebarSubmenu] = useState([]);
  const [SideBarList, setSideBarList] = useState([]);
  const handleLogout = () => {
    dispatch({
      type: authactions.LOGOUT_USER,
    });
  };

  function handleClick(changedKey) {
    dispatch({
      type: actions.CHANGE_CURRENT_MENU,
      payload: [changedKey.key.toString()],
    });
  }

  function toggle(submenu) {
    setcollapsed(!collapsed);
    setsidebarSubmenu(submenu);
  }

  function onCollapse(flag) {
    setcollapsed(collapsed);
    setsidebarSubmenu([]);
  }

  useEffect(() => {
    if (getLocalDataType() === "admin") {
      let data = [];
      if (userpermission.length > 0) {
        userpermission.map((rights) => {
          let el = {};
          if (rights.parentid == 0) {
            el = {
              key: rights.id,
              name: rights.name,
              link: rights.link,
              icon: rights.icon,
              sort: rights.sortorder,
            };
          }
          if (Object.keys(el).length > 0 && rights.hasSubMenu == 1) {
            const children = userpermission.filter((child) => {
              if (child.parentid == rights.id) {
                return {
                  key: child.id,
                  icon: child.icon,
                  name: child.name,
                  link: child.link,
                };
              }
            });

            console.log('children---', children);
            if (children.length > 0) {
              el.hasSubmenu = true;
              el.sublist =
                el?.name === "Address"
                  ? children?.concat({
                      access: "true",
                      create: "true",
                      hasSubMenu: false,
                      icon: null,
                      id: 29,
                      link: "/admin/country",
                      module: "country",
                      name: "Country Management",
                      parentid: 15,
                      remove: "true",
                      sortorder: null,
                      status: "true",
                      update: "true",
                    },{
                      access: "true",
                      create: "true",
                      hasSubMenu: false,
                      icon: null,
                      id: 37,
                      link: "/admin/currency",
                      module: "currency",
                      name: "Currency Management",
                      parentid: 15,
                      remove: "true",
                      sortorder: null,
                      status: "true",
                      update: "true",
                    },{
                      access: "true",
                      create: "true",
                      hasSubMenu: false,
                      icon: null,
                      id: 38,
                      link: "/admin/currency-conversion",
                      module: "currency",
                      name: "Currency Conversion Management",
                      parentid: 15,
                      remove: "true",
                      sortorder: null,
                      status: "true",
                      update: "true",
                    })
                  : children;
            } else {
              el.hasSubmenu = false;
            }
          }
          Object.keys(el).length > 0 && data.push(el);
        });
        if (data.length > 0) {
          let sorted = _.orderBy(data, ["sort"], ["asc"]);
          setSideBarList(sorted);
        }
      }
      // else{
      //   setSideBarList(AdminSidebar)
      // }
    } else setSideBarList(AgentSidebar);
  }, [userpermission]);




  useEffect(() => {
    if (getLocalData("id") > 0) {
      dispatch({
        type: authactions.GET_USER_ROLERIGHTS,
        payload: getLocalData("id"),
      });
    }
  }, []);
  return (
    <>
      <Sider className={responsiveMenu ? 'mobile-sidebar-menu' : ''} collapsed={responsiveMenu ? false : true} width={responsiveMenu ? "100%" : 80}>
        <StickyBox offsetTop={10} offsetBottom={10}>
          <Menu theme="light" selectedKeys={currentKey} mode="inline">
            {SideBarList.length > 0 &&
              SideBarList.map((menu, index) => {
                return (
                  <>
                    {!menu.hasSubmenu && menu.hasSubmenu !== null ? (
                      <Menu.Item
                        key={menu.key}
                        icon={
                          menu.icon !== null ? (
                            <CustomIcon type={menu.icon} />
                          ) : (
                            ""
                          )
                        }
                        onClick={handleClick}
                      >
                        <NavLink to={menu.link} key={menu.key} onClick={handleResponsiveMenuHide}>
                          {" "}
                          {getLocaleMessages(menu.name)}{" "}
                        </NavLink>
                      </Menu.Item>
                    ) : (
                      <>
                        <SubMenu
                          key={menu.link}
                          icon={
                            menu.icon !== null ? (
                              <CustomIcon type={menu.icon} />
                            ) : (
                              ""
                            )
                          }
                          title={getLocaleMessages(menu.name)}
                          style={{
                            "& .antMenuRtl.antMenuInlineCollapsed.antMenuVertical .antMenuSubmenuTitle": {
                              padding: "none",
                            },
                          }}
                        >
                          {menu.hasSubmenu &&
                            menu.sublist.map((submenu) => {
                              return (
                                <Menu.Item
                                  onClick={() => handleClick(menu)}
                                  key={submenu.id}
                                >
                                  <NavLink to={submenu.link} key={submenu.id} onClick={handleResponsiveMenuHide}>
                                    {getLocaleMessages(submenu.name)}
                                  </NavLink>
                                </Menu.Item>
                              );
                            })}
                        </SubMenu>
                      </>
                    )}
                  </>
                );
              })}
            <Menu.Item
              key={"log"}
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              <a> {getLocaleMessages("Logout")} </a>
            </Menu.Item>
          </Menu>
        </StickyBox>
      </Sider>



      {/*<div className={responsiveMenu ? "overlay-mobile-menu" : ""}></div>*/}


    </>
  );
}

export default Sidebar;
