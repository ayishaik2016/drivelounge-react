import React, { useState } from 'react';
// import OTPInput, { ResendOTP } from "otp-input-react";
import OtpInput from 'react-otp-input';
const OTPComponent = (props) =>{
    const { OTPdata, onChangeOTP } = props; 
    
    return ( 
        <OtpInput
            value={OTPdata}
            onChange={onChangeOTP}
            // autoFocus
            // OTPLength={5}
            // otpType="number"
            // disabled={false}

            numInputs={4}
            separator={<span>-</span>}
        />
    )
}

export default OTPComponent;