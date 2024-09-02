import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import {
	ProfileOutlined,
	FieldTimeOutlined,
	CommentOutlined,
	HeartOutlined,
} from '@ant-design/icons';
import { getLocaleMessages } from 'redux/helper';

const ProfileSide = (props) => {
	return (
		<>
		<Menu selectedKeys={[props.selectionKey]}>			
			<Menu.Item key="booking">
				<Link to="/booking">
					<FieldTimeOutlined /> {getLocaleMessages("Bookings")}
				</Link>
			</Menu.Item>
			<Menu.Item key="favorites">
				<Link to="/favorites">
					<HeartOutlined /> {getLocaleMessages("Favorites")}
				</Link>
			</Menu.Item>
			<Menu.Item key="reviews">
				<Link to="/reviews">
					<CommentOutlined /> {getLocaleMessages("Rate & Reviews")}
				</Link>
			</Menu.Item>
			<Menu.Item key="profile">
				<Link to="/profile">
					<ProfileOutlined /> {getLocaleMessages("My Profile")}
				</Link>
			</Menu.Item>
		</Menu></>
	);
};
export default ProfileSide;
