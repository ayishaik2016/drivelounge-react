import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
// import './App.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  SettingOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  RightOutlined,
  ArrowLeftOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class App extends Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };
  render() { 
    return (  
      <Layout style={{ minHeight: '100vh' }}>
        {/* <Sider trigger={null} collapsible collapsed={this.state.collapsed}> */}
        <Sider collapsed={true}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
           
            <Menu.Item key="2" onClick={this.toggle} icon={<DesktopOutlined />}/>              
           
            <Menu.Item key="3" icon={<SettingOutlined />}/>             
           
          </Menu>
        </Sider>
        { this.state.collapsed && <Sider theme="light">
                <Menu mode="inline">
                  <Menu.Item key="1">Tom</Menu.Item>
                  <Menu.Item key="2">Bill</Menu.Item>
                  <Menu.Item key="3">Alex</Menu.Item>
                  <Menu.Item key="city"><RightOutlined />City</Menu.Item>
                </Menu>
                
              </Sider>}
        
        <Layout className="site-layout admin-layout-1">
          <Header className="site-layout-background" style={{ padding: 0 }} >
          {React.createElement(this.state.collapsed ? ArrowLeftOutlined : ArrowLeftOutlined, {
              className: 'trigger',
              onClick: this.toggle,
            })}
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              Bill is a cat.
            </div>
          </Content>
         
        </Layout>
      </Layout>
    );
  }
}
 
export default App;