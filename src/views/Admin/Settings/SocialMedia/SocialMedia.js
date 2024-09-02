import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Input, Button, Card, Form } from 'antd';
import { formProps } from '../../../../helpers/constant';
import settingsAction from './../../../../redux/admin/settings/actions';
import "../../../../assets/css/adminStyle.css";
import { ShowForPermission } from 'redux/userPermissions';
import LoadingOverlay from 'react-loading-overlay';
import { getLocaleMessages } from 'redux/helper';

const AdminSocialMedia = () =>{
    const dispatch = useDispatch();
    const [usedForm] = Form.useForm();
    const { isLoading, socialmedia_data } = useSelector((state) => state.WebSettings);
   
    useEffect(() => {
        dispatch({
            type: settingsAction.GET_SOCIAL_MEDIA,
            payload: false,
        });
    },[]);
    
    useEffect(() => {       
        usedForm.setFieldsValue({...socialmedia_data});
    },[usedForm, socialmedia_data]);

    const onFinishSocialMedia = (values) =>{
       
        dispatch({
            type: settingsAction.UPDATE_SOCIAL_MEDIA,
            payload: values,
        });
    }
    return (
      <LoadingOverlay
		  active={isLoading}
		  spinner
		  text={getLocaleMessages('Loading your content...')}
		  >
        <div className="page-container medium">
          <Card title={getLocaleMessages("Social Media")}>
            <div className="dashboard-form">  
              <Form form={usedForm} onFinish={onFinishSocialMedia} {...formProps}>      
                <Row gutter={30}>
                  <Col span={12}  className="inner-content">
                    <Form.Item
                      label={getLocaleMessages('Facebook Url')} 
                      name={'facebook'} 
                      rules={
                        [
                          {
                            required: true,
                            message: getLocaleMessages('Fields are required'),
                          },
                        ]
                      }
                    >
                      <Input placeholder="" />
                    </Form.Item>
                  </Col>
                  <Col span={12}  className="inner-content">
                    <Form.Item
                      label={getLocaleMessages('Twitter Url')} 
                    
                      name={'twitter'} 
                      rules={
                        [
                          {
                            required: true,
                            message: getLocaleMessages('Fields are required'),
                          },
                        ]
                      }
                    >
                      <Input placeholder="" />
                    </Form.Item>
                  </Col>
                  <Col span={12} className="inner-content">
                    <Form.Item 
                      label={getLocaleMessages('Instagram Url')} 
                      name={'instagram'} 
                      rules={
                        [
                          {
                            required: true,
                            message: getLocaleMessages('Fields are required'),
                          },
                        ]
                      }
                    >
                      <Input placeholder="" />
                    </Form.Item>
                  </Col>
                  <Col span={12} className="inner-content">
                    <Form.Item
                      label={getLocaleMessages('Snapchat Url')} 
                      name={'snapchat'} 
                      rules={
                        [
                          {
                            required: true,
                            message: getLocaleMessages('Fields are required'),
                          },
                        ]
                      }
                    >
                      <Input placeholder="" />
                    </Form.Item>
                  </Col>
                </Row>
                  <Form.Item>
                    <div className="button-center">
                      <ShowForPermission permission="update" module="soc">
                      <Button type="primary" htmlType="submit" className="save-btn">
                        {getLocaleMessages("Save")}
                      </Button>
                      </ShowForPermission>
                    </div>
                  </Form.Item>
              </Form>
            </div>
          </Card>
        </div>
        </LoadingOverlay>

    ) 
}

export default AdminSocialMedia;