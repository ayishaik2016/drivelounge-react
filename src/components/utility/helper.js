import React from 'react';
import { notification } from 'antd';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
// import { scheduleTimeMinute } from 'components/constants';

export function showNotification({ type, message, description, onClose }) {
  notification[type]({
    message: message,
    description: description,
    className: type === 'error' ? 'error-notification' : 'success-notification',
    icon: (
      <img alt={'icon'} />
    ),
    onClose: onClose,
  });
}

export function getLocalTimeZone() {
  return momentTimezone.tz.guess();
}

export function getTimeWithTimeZone(date, dateFormat, getTimeZone) {
  return moment(date).tz(getTimeZone).format(dateFormat);
}
export function getMomentTime(time, format) {
  return moment(time, format);
}

// export function isValidTime(time) {
//   //checks the time is in 15 minutes interval
//   return moment(time).minute() % scheduleTimeMinute === 0;
// }
