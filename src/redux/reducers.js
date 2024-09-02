import Auth from './auth/reducer';
import App from './app/reducer';
import WebSettings from './admin/settings/reducer'
import Rating from './admin/ratingsManagement/reducer';
import ActivityLog from './admin/activitylog/reducer';
import Address from './admin/address/reducer';
import Layouts from './Layout/reducer';
import CarInfo from './admin/car/reducer';
import BookingInfo from './admin/booking/reducer';
import Applications from './admin/application/reducer';
import Coupon from './admin/coupon/reducer';
import Common from './common/reducer';
import CarListing from './car/reducer';
import Agency from './admin/agency/reducer';
import PageManagament from './admin/pageManagement/reducer';
import Dashboard from './admin/dashboard/reducer';
import CustomerDetails from './admin/customer/reducer';
import CarReservation from './user/reducer';
import Listing from './Listing/reducer';
import EnquiryInfo from './admin/enquiry/reducer';
import FilterOption from './filters/reducer';
import AdminInfo from './admin/users/reducer';

import RolesRights from './admin/roleandrights/reducer';
import Reports from './admin/report/reducer';
import Currency from "./currency/reducer"
export default {
    Dashboard,
    Auth,
    App,
    ActivityLog,
    WebSettings,
    Address,
    CarInfo,
    BookingInfo,
    Applications,
    Coupon,
    Rating,
    Layouts,
    Common,
    CarListing,
    Agency,
    PageManagament,
    CustomerDetails,
    CarReservation,
    Listing,
    EnquiryInfo,
    FilterOption,
    AdminInfo,
    RolesRights,
    Reports,
    Currency
};