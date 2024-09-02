import { all } from 'redux-saga/effects';
import auth from './../redux/auth/sagas';
import ActivityLog from './../redux/admin/activitylog/sagas';
import webSettings from './../redux/admin/settings/sagas';
import carInfo from './../redux/admin/car/sagas';
import BookingInfo from './../redux/admin/booking/sagas';
import Applications from './../redux/admin/application/sagas';
import Address from './../redux/admin/address/sagas';
import Rating from './../redux/admin/ratingsManagement/sagas';
import Coupon from './../redux/admin/coupon/sagas';
import Common from './../redux/common/sagas';
import CarListing from './../redux/car/sagas';
import AgencyListing from "./../redux/admin/agency/sagas";
import PageManagament from './../redux/admin/pageManagement/sagas';
import AdminDashboard from './../redux/admin/dashboard/sagas';
import CustomerDetails from './../redux/admin/customer/sagas';
import CarReservation from './../redux/user/sagas';
import Listing from './../redux/Listing/sagas';
import EnquiryInfo from './../redux/admin/enquiry/sagas';
import FilterOption from './filters/sagas';
import AdminInfo from './../redux/admin/users/sagas';
import RolesRights from './../redux/admin/roleandrights/sagas';
import Reports from './../redux/admin/report/sagas';
import Currecy from "./../redux/currency/sagas";
export default function* rootSaga(getState) {
    yield all([
        auth(),
        ActivityLog(),
        webSettings(),
        BookingInfo(),
        carInfo(),
        Applications(),
        Address(),
        Coupon(),
        Rating(),
        Common(),
        CarListing(),
        AgencyListing(),
        PageManagament(),
        AdminDashboard(),
        CustomerDetails(),
        CarReservation(),
        Listing(),
        EnquiryInfo(),
        FilterOption(),
        AdminInfo(),
        RolesRights(),
        Reports(),
        Currecy()
    ]);
}