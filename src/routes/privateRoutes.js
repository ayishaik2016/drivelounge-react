import asyncComponent from "./../components/asyncComponents";

const privateRoutes = {
  user: [
    {
      path: "/",
      component: asyncComponent(() =>
        // import ('./../views/Common/Checkout/Checkout')),
        import("./../views/Common/Home/Home")
      ),
    },
    {
      path: "mybooking",
      component: asyncComponent(() =>
        import("./../views/Common/MyBookings/Bookings")
      ),
    },
    {
      path: "listing",
      component: asyncComponent(() =>
        import("./../views/Common/Listing/Listing")
      ),
    },
    {
      path: "detail",
      component: asyncComponent(() =>
        import("./../views/Common/Detail/Detail")
      ),
    },
    {
      path: "checkout",
      component: asyncComponent(() =>
        import("./../views/Common/Checkout/Checkout")
      ),
    },
    {
      path: "confirmation",
      component: asyncComponent(() =>
        import("./../views/Common/Confirmation/Confirmation")
      ),
    },
    {
      path: "booking",
      component: asyncComponent(() =>
        import("./../views/Common/MyBookings/Bookings")
      ),
    },
    {
      path: "bookingdetails",
      component: asyncComponent(() =>
        import("./../views/Common/MyBookings/BookingDetails")
      ),
    },
    {
      path: "profile",
      component: asyncComponent(() =>
        import("./../views/Common/MyProfile/Profile")
      ),
    },
    {
      path: "reviews",
      component: asyncComponent(() =>
        import("./../views/Common/Reviews/Review")
      ),
    },
    {
      path: "favorites",
      component: asyncComponent(() =>
        import("./../views/Common/Favorites/Favorites")
      ),
    },
    {
      path: "contactus",
      component: asyncComponent(() =>
        import("./../views/Common/Enquiry/Enquiry")
      ),
    },
    {
      path: "paymenttransaction",
      component: asyncComponent(() =>
        import("./../views/Common/Confirmation/Transaction")
      ),
    },
    {
      path: "cms",
      component: asyncComponent(() => import("./../views/Common/Cms/Cms")),
    },
    {
      path: "faq",
      component: asyncComponent(() => import("./../views/Common/Faq/Faq")),
    },
    {
      path: "privacypolicy",
      component: asyncComponent(() =>
        import("./../views/Common/PrivacyPolicy/PrivacyPolicy")
      ),
    },
    {
      path: "termsofuse",
      component: asyncComponent(() =>
        import("./../views/Common/TermsofUse/TermsofUse")
      ),
    },
    {
      path: "*",
      component: asyncComponent(() => import("../components/NotFound")),
    },
  ],

  admin: [
    {
      path: "dashboard",
      component: asyncComponent(() =>
        import("./../views/Admin/Dashboard/Dashboard")
      ),
    },
    {
      path: "configuration",
      component: asyncComponent(() =>
        import("./../views/Admin/Settings/Configuration/Configuration")
      ),
    },
    {
      path: "socialmedia",
      component: asyncComponent(() =>
        import("./../views/Admin/Settings/SocialMedia/SocialMedia")
      ),
    },
    {
      path: "smtp",
      component: asyncComponent(() =>
        import("./../views/Admin/Settings/SMTP/SMTP")
      ),
    },
    {
      path: "sms",
      component: asyncComponent(() =>
        import("./../views/Admin/Settings/SMS/SMS")
      ),
    },
    {
      path: "application",
      component: asyncComponent(() =>
        import("./../views/Admin/Application/Application")
      ),
    },
    {
      path: "application/update",
      component: asyncComponent(() =>
        import("./../views/Admin/Application/ApplicationDetails")
      ),
    },
    {
      path: "application/create",
      component: asyncComponent(() =>
        import("./../views/Admin/Application/ApplicationDetails")
      ),
    },
    {
      path: "pushnotification",
      component: asyncComponent(() =>
        import("./../views/Admin/Notification/PushNotification")
      ),
    },
    {
      path: "bookings",
      component: asyncComponent(() =>
        import("../views/Admin/Bookings/Bookings")
      ),
    },
    {
      path: "bookingdetails",
      component: asyncComponent(() =>
        import("./../views/Common/MyBookings/BookingDetails")
      ),
    },
    {
      path: "cars/create",
      component: asyncComponent(() => import("../views/Admin/Cars/Car")),
    },
    {
      path: "cars/update",
      component: asyncComponent(() => import("../views/Admin/Cars/Car")),
    },
    {
      path: "cars",
      component: asyncComponent(() =>
        import("../views/Admin/Cars/CarManagement")
      ),
    },
    {
      path: "brand",
      component: asyncComponent(() =>
        import("./../views/Admin/Cars/BrandManagement")
      ),
    },
    {
      path: "cartype",
      component: asyncComponent(() =>
        import("./../views/Admin/Cars/CarTypeManagement")
      ),
    },
    // {
    //   path: 'ProfileUpdate',
    //   component: asyncComponent(() => import('./../views/Admin/ProfileUpdation/ProfileUpdate')),
    // },
    {
      path: "coupon",
      component: asyncComponent(() =>
        import("../views/Admin/Coupon/CouponManagement")
      ),
    },
    // {
    //     path: 'agency',
    //     component: asyncComponent(() =>
    //         import ('./../views/Admin/Agency/AgencyManagement')),
    // },
    // {
    //     path: 'agency/create',
    //     component: asyncComponent(() =>
    //         import ('./../views/Admin/Agency/Agency')),
    // },

    // {
    //   path: 'ServiceManagement',
    //   component: asyncComponent(() => import('./../views/Admin/ServiceManagement/ServiceManagement')),
    // },
    // {
    //   path: 'StafManagement',
    //   component: asyncComponent(() => import('./../views/Admin/StafManagement/StafManagement')),
    // },
    {
      path: "enquiry",
      component: asyncComponent(() =>
        import("./../views/Admin/Enquiry/Enquiry")
      ),
    },
    {
      path: "customer",
      component: asyncComponent(() =>
        import("./../views/Admin/Customer/Customer")
      ),
    },
    // {
    //   path: 'city',
    //   component: asyncComponent(() => import('./../views/Admin/Addresses/City/City')),
    // },
    {
      path: "area",
      component: asyncComponent(() =>
        import("./../views/Admin/Address/Area/Area")
      ),
    },
    {
      path: "city",
      component: asyncComponent(() =>
        import("../views/Admin/Address/City/City")
      ),
    },
    {
      path: "country",
      component: asyncComponent(() =>
        import("../views/Admin/Address/Country/Country")
      ),
    },
    {
      path: "currency",
      component: asyncComponent(() =>
        import("../views/Admin/Address/Currency/Currency")
      ),
    },
    {
      path: "currency-conversion",
      component: asyncComponent(() =>
        import("../views/Admin/Address/Currency/CurrencyConversion")
      ),
    },
    {
      path: "addresstype",
      component: asyncComponent(() =>
        import("./../views/Admin/Address/Type/Type Management")
      ),
    },
    {
      path: "addresstype/create",
      component: asyncComponent(() =>
        import("./../views/Admin/Address/Type/Type")
      ),
    },
    {
      path: "rating",
      component: asyncComponent(() =>
        import("./../views/Admin/RatingAndReview/RatingAndReview")
      ),
    },
    {
      path: "cms",
      component: asyncComponent(() =>
        import("../views/Admin/PageManagement/CMS/CMSManagement")
      ),
    },
    {
      path: "cms/create",
      component: asyncComponent(() =>
        import("../views/Admin/PageManagement/CMS/CMS")
      ),
    },
    {
      path: "cms/update",
      component: asyncComponent(() =>
        import("../views/Admin/PageManagement/CMS/CMS")
      ),
    },
    {
      path: "faq",
      component: asyncComponent(() =>
        import("../views/Admin/PageManagement/FAQ/FAQManagement")
      ),
    },
    {
      path: "faq/create",
      component: asyncComponent(() =>
        import("../views/Admin/PageManagement/FAQ/FAQ")
      ),
    },
    {
      path: "faq/update",
      component: asyncComponent(() =>
        import("../views/Admin/PageManagement/FAQ/FAQ")
      ),
    },
    {
      path: "payment",
      component: asyncComponent(() =>
        import("./../views/Admin/Payment/PaymentManagement")
      ),
    },

    // {
    //   path: 'country',
    //   component: asyncComponent(() => import('./../views/Admin/Addresses/Country/Country')),
    // },

    // {
    //   path: 'profile',
    //   component: asyncComponent(() => import('./../views/Admin/ProfileUpdation/ProfileUpdate')),
    // },
    {
      path: "activitylog",
      component: asyncComponent(() =>
        import("./../views/Admin/ActivityLog/ActivityLog")
      ),
    },
    {
      path: "administrator",
      component: asyncComponent(() =>
        import("./../views/Admin/Roles/Administrator")
      ),
    },
    {
      path: "role",
      component: asyncComponent(() =>
        import("./../views/Admin/Roles/RoleManagement")
      ),
    },
    {
      path: "role/create",
      component: asyncComponent(() =>
        import("./../views/Admin/Roles/RolePermission")
      ),
    },
    {
      path: "role/update",
      component: asyncComponent(() =>
        import("./../views/Admin/Roles/RolePermission")
      ),
    },
    {
      path: "report",
      component: asyncComponent(() => import("../views/Admin/Report/Admin")),
    },
    {
      path: "report1",
      component: asyncComponent(() =>
        import("../views/Admin/Report/ZatAndVatReport")
      ),
    },
    {
      path: "report2",
      component: asyncComponent(() =>
        import("../views/Admin/Report/BillReport")
      ),
    },
    {
      path: "report3",
      component: asyncComponent(() =>
        import("../views/Admin/Report/BookingReport")
      ),
    },
    {
      path: "report4",
      component: asyncComponent(() =>
        import("../views/Admin/Report/CanceledBookingReport1")
      ),
    },
    {
      path: "report5",
      component: asyncComponent(() =>
        import("../views/Admin/Report/CanceledBookingReport2")
      ),
    },
    {
      path: "report6",
      component: asyncComponent(() =>
        import("../views/Admin/Report/TotalBookingReport")
      ),
    },

    // {
    //   path: 'Agencyorderreport',
    //   component: asyncComponent(() => import('./../views/Admin/AgencyOrderReport/AgencyOrderReport')),
    // },

    {
      path: "*",
      component: asyncComponent(() => import("../components/NotFound")),
    },
  ],

  agency: [
    {
      path: "dashboard",
      component: asyncComponent(() =>
        import("./../views/Agency/Dashboard/Dashboard")
      ),
    },
    {
      path: "bookings",
      component: asyncComponent(() =>
        import("../views/Admin/Bookings/Bookings")
      ),
    },
    {
      path: "bookingdetails",
      component: asyncComponent(() =>
        import("./../views/Common/MyBookings/BookingDetails")
      ),
    },
    {
      path: "cars/create",
      component: asyncComponent(() => import("../views/Admin/Cars/Car")),
    },
    {
      path: "cars/update",
      component: asyncComponent(() => import("../views/Admin/Cars/Car")),
    },
    {
      path: "customer",
      component: asyncComponent(() =>
        import("./../views/Admin/Customer/Customer")
      ),
    },

    {
      path: "cars",
      component: asyncComponent(() =>
        import("../views/Admin/Cars/CarManagement")
      ),
    },
    {
      path: "brand",
      component: asyncComponent(() =>
        import("./../views/Admin/Cars/BrandManagement")
      ),
    },
    {
      path: "cartype",
      component: asyncComponent(() =>
        import("./../views/Admin/Cars/CarTypeManagement")
      ),
    },
    {
      path: "enquiry",
      component: asyncComponent(() =>
        import("./../views/Admin/Enquiry/Enquiry")
      ),
    },
    {
      path: "profile/update",
      component: asyncComponent(() =>
        import("./../views/Admin/Application/ApplicationDetails")
      ),
    },
    {
      path: "coupon",
      component: asyncComponent(() =>
        import("../views/Admin/Coupon/CouponManagement")
      ),
    },
    {
      path: "payment",
      component: asyncComponent(() =>
        import("./../views/Admin/Payment/PaymentManagement")
      ),
    },
    {
      path: "activitylog",
      component: asyncComponent(() =>
        import("./../views/Admin/ActivityLog/ActivityLog")
      ),
    },
    {
      path: "rating",
      component: asyncComponent(() =>
        import("./../views/Admin/RatingAndReview/RatingAndReview")
      ),
    },
    {
      path: "report",
      component: asyncComponent(() => import("../views/Admin/Report/Agency")),
    },
    {
      path: "profile",
      component: asyncComponent(() =>
        import("../views/Agency/Profile/Profile")
      ),
    },
    {
      path: "*",
      component: asyncComponent(() => import("../components/NotFound")),
    },
  ],

  common: [
    {
      path: "listing",
      component: asyncComponent(() =>
        import("./../views/Common/Listing/Listing")
      ),
    },
    {
      path: "detail",
      component: asyncComponent(() =>
        import("./../views/Common/Detail/Detail")
      ),
    },
    {
      path: "checkout",
      component: asyncComponent(() =>
        import("./../views/Common/Checkout/Checkout")
      ),
    },
    // {
    //     path: '/booking',
    //     component: asyncComponent(() =>
    //         import ('./../views/Common/MyBookings/Bookings')),
    // },
    // {
    //     path: '/profile',
    //     component: asyncComponent(() =>
    //         import ('./../views/Common/MyProfile/Profile')),
    // },
    // {
    //     path: '/reviews',
    //     component: asyncComponent(() =>
    //         import ('./../views/Common/Reviews/Review')),
    // },
    // {
    //   path: 'listing',
    //   component: asyncComponent(() => import('containers/Layouts/Listing')),
    // },
    // {
    //   path: 'detail',
    //   component: asyncComponent(() => import('containers/Layouts/Detail')),
    // },
    {
      path: "/agency",
      component: asyncComponent(() =>
        import("./../views/Common/Agency/Agency")
      ),
    },
    {
      path: "/contactus",
      component: asyncComponent(() =>
        import("./../views/Common/Enquiry/Enquiry")
      ),
    },

    {
      path: "/cms",
      component: asyncComponent(() => import("./../views/Common/Cms/Cms")),
    },
    {
      path: "/faq",
      component: asyncComponent(() => import("./../views/Common/Faq/Faq")),
    },
    {
      path: "/privacypolicy",
      component: asyncComponent(() =>
        import("./../views/Common/PrivacyPolicy/PrivacyPolicy")
      ),
    },
    {
      path: "/termsofuse",
      component: asyncComponent(() =>
        import("./../views/Common/TermsofUse/TermsofUse")
      ),
    },
    {
      path: "*",
      component: asyncComponent(() => import("../components/NotFound")),
    },
  ],
};

export default privateRoutes;
