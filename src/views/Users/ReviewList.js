import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  Typography, 
  Avatar,
  Rate,} from "antd";
  import {
    UserOutlined
  } from "@ant-design/icons";
import actions from "./../../redux/car/actions"
import format from 'date-fns/format';
const { Title, Paragraph } = Typography;

const CarReviewList = (props) => {
  const dispatch = useDispatch();
  const { carReivewList } = useSelector(state => state.CarListing);
  useEffect(() => {
    dispatch({
        type: actions.GET_CAR_REVIEW_LIST,
        payload: {carid: props.carid, agentid: props.agentid},
    }); 
  }, [])
    return (
        <>
        {carReivewList && carReivewList.map(review =>{
            const {id,	username,	url,	created_at,	agentname,	rating,	title,	description } = review;
             return <div>
                <ul className="review-loop" key={id}>
                    <li>
                        <Typography className="box">
                        <Avatar shape="square" size={50} icon={<UserOutlined />} />
                        <Title level={4}>
                            {username ? username : 'Unknown'}
                            <span className="date">{format(new Date(created_at), 'dd/MM/yyyy hh:mm a')}</span>
                        </Title>
                        <Rate value={rating} disabled />
                        <Paragraph>
                            {description}
                        </Paragraph>
                        </Typography>
                    </li>            
                </ul>
            </div>
        })}
           
        </>
    )
}

export default CarReviewList;