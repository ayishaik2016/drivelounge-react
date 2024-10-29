import asyncComponent from "../components/asyncComponents";

const publicRoutes = [
  {
    path: "/",
    component: asyncComponent(() => import("./../views/Common/Home/Home")),
  },
  {
    path: "/listing",
    component: asyncComponent(() =>
      import("./../views/Common/Listing/Listing")
    ),
  },
  {
    path: "/detail",
    component: asyncComponent(() => import("./../views/Common/Detail/Detail")),
  },
  {
    path: "/checkout",
    component: asyncComponent(() =>
      import("./../views/Common/Checkout/Checkout")
    ),
  },
  {
    path: "/agency",
    component: asyncComponent(() => import("./../views/Common/Agency/Agency")),
  },
  {
    path: "/admin/login",
    component: asyncComponent(() => import("../views/Admin/Login/Login1")),
  },
  {
    path: "/registerconfirmation",
    component: asyncComponent(() =>
      import("./../views/Common/Confirmation/Registerconfirmation")
    ),
  },
  {
    path: "/contactus",
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
    path: "/termsofuse/user",
    component: asyncComponent(() =>
      import("./../views/Common/TermsofUse/TermsofUse")
    ),
  },
  {
    path: "/termsofuse/agency",
    component: asyncComponent(() =>
      import("./../views/Common/TermsofUse/TermsofUse")
    ),
  },
  {
    path: "/agency/login",
    component: asyncComponent(() => import("../views/Agency/Login/Login1")),
  },
  {
    path: "/reset/:id",
    component: asyncComponent(() =>
      import("views/Agency/Login/UserForgotPassword")
    ),
  },
  {
    path: "/vendor/reset/:id",
    component: asyncComponent(() =>
      import("views/Agency/Login/ForgotPassword")
    ),
  },
  {
    path: "*",
    component: asyncComponent(() => import("../components//NotFound")),
  },
];

export default publicRoutes;
