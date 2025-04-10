const actions = {
  AUTHENTICATE_USER: 'AUTHENTICATE_USER',
  AUTHENTICATE_USER_SUCCESS: 'AUTHENTICATE_USER_SUCCESS',
  AUTHENTICATE_USER_FAILURE: 'AUTHENTICATE_USER_FAILURE',
  LOGOUT_USER: 'LOGOUT_USER',
  LOGOUT_USER_FAILURE: 'LOGOUT_USER_FAILURE',
  SEND_PASSWORD_RESET_LINK: 'SEND_PASSWORD_RESET_LINK',
  SEND_PASSWORD_RESET_LINK_SUCCESS: 'SEND_PASSWORD_RESET_LINK_SUCCESS',
  SEND_PASSWORD_RESET_LINK_FAILURE: 'SEND_PASSWORD_RESET_LINK_FAILURE',
  RESET_PASSWORD: 'RESET_PASSWORD',
  RESET_PASSWORD_SUCCESS: 'RESET_PASSWORD_SUCCESS',
  RESET_PASSWORD_FAILURE: 'RESET_PASSWORD_FAILURE',
  VALIDATE_AUTH_TOKEN: 'VALIDATE_AUTH_TOKEN',
  UPDATE_PROFILE_IMAGE: 'UPDATE_PROFILE_IMAGE',
  UPDATE_PROFILE_IMAGE_SUCCESS: 'UPDATE_PROFILE_IMAGE_SUCCESS',
  UPDATE_PROFILE_IMAGE_FAILURE: 'UPDATE_PROFILE_IMAGE_FAILURE',
  CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',

  ADMIN_AUTHENTICATE_USER_PRE_OTP: 'ADMIN_AUTHENTICATE_PRE_OTP_USER',
  ADMIN_AUTHENTICATE_USER_PRE_OTP_SUCCESS: 'ADMIN_AUTHENTICATE_USER_PRE_OTP_SUCCESS',
  ADMIN_AUTHENTICATE_USER_PRE_OTP_FAILURE: 'ADMIN_AUTHENTICATE_USER_PRE_OTP_FAILURE',

  ADMIN_AUTHENTICATE_USER_PRE_OTP_RESEND: 'ADMIN_AUTHENTICATE_PRE_OTP_USER_RESEND',
  ADMIN_AUTHENTICATE_USER_PRE_OTP_RESEND_SUCCESS: 'ADMIN_AUTHENTICATE_USER_PRE_OTP_RESEND_SUCCESS',
  ADMIN_AUTHENTICATE_USER_PRE_OTP_RESEND_FAILURE: 'ADMIN_AUTHENTICATE_USER_PRE_OTP_RESEND_FAILURE',

  ADMIN_AUTHENTICATE_USER: 'ADMIN_AUTHENTICATE_USER',
  ADMIN_AUTHENTICATE_USER_SUCCESS: 'ADMIN_AUTHENTICATE_USER_SUCCESS',
  ADMIN_AUTHENTICATE_USER_FAILURE: 'ADMIN_AUTHENTICATE_USER_FAILURE',
  SET_SHOW_ADMIN_FORGOT: 'SET_SHOW_ADMIN_FORGOT',
  SET_SHOW_VENDOR_FORGOT: 'SET_SHOW_VENDOR_FORGOT',

  ADMIN_SEND_PASSWORD_RESET_LINK: 'ADMIN_SEND_PASSWORD_RESET_LINK',
  ADMIN_SEND_PASSWORD_RESET_LINK_SUCCESS: 'ADMIN_SEND_PASSWORD_RESET_LINK_SUCCESS',
  ADMIN_SEND_PASSWORD_RESET_LINK_FAILURE: 'ADMIN_SEND_PASSWORD_RESET_LINK_FAILURE',

  ADMIN_EDIT_PROFILE: 'ADMIN_EDIT_PROFILE',
  ADMIN_EDIT_PROFILE_SUCCESS: 'ADMIN_EDIT_PROFILE_SUCCESS',
  ADMIN_EDIT_PROFILE_FAILURE: 'ADMIN_EDIT_PROFILE_PROFILE',

  ADMIN_CHANGE_PASSWORD: 'ADMIN_CHANGE_PASSWORD',
  ADMIN_CHANGE_PASSWORD_SUCCESS: 'ADMIN_CHANGE_PASSWORD_SUCCESS',
  ADMIN_CHANGE_PASSWORD_FAILURE: 'ADMIN_CHANGE_PASSWORD_PROFILE',

  CREATE_AUTHENTICATE_VENDOR: "CREATE_AUTHENTICATE_VENDOR",
  CREATE_AUTHENTICATE_VENDOR_SUCCESS: "CREATE_AUTHENTICATE_VENDOR_SUCCESS",
  CREATE_AUTHENTICATE_VENDOR_FAILURE: "CREATE_AUTHENTICATE_VENDOR_FAILURE",

  VENDOR_AUTHENTICATE_USER: 'VENDOR_AUTHENTICATE_USER',
  VENDOR_AUTHENTICATE_USER_SUCCESS: 'VENDOR_AUTHENTICATE_USER_SUCCESS',
  VENDOR_AUTHENTICATE_USER_FAILURE: 'VENDOR_AUTHENTICATE_USER_FAILURE',

  VENDOR_RESET_PASSWORD: 'VENDOR_RESET_PASSWORD',
  VENDOR_RESET_PASSWORD_SUCCESS: 'VENDOR_RESET_PASSWORD_SUCCESS',

  USER_RESET_PASSWORD: 'USER_RESET_PASSWORD',
  USER_RESET_PASSWORD_SUCCESS: 'USER_RESET_PASSWORD_SUCCESS',

  VENDOR_SEND_PASSWORD_RESET_LINK: 'VENDOR_SEND_PASSWORD_RESET_LINK',
  VENDOR_SEND_PASSWORD_RESET_LINK_SUCCESS: 'VENDOR_SEND_PASSWORD_RESET_LINK_SUCCESS',
  VENDOR_SEND_PASSWORD_RESET_LINK_FAILURE: 'VENDOR_SEND_PASSWORD_RESET_LINK_FAILURE',

  VENDOR_EDIT_PROFILE: 'VENDOR_EDIT_PROFILE',
  VENDOR_EDIT_PROFILE_SUCCESS: 'VENDOR_EDIT_PROFILE_SUCCESS',
  VENDOR_EDIT_PROFILE_FAILURE: 'VENDOR_EDIT_PROFILE_PROFILE',
  VENDOR_CHANGE_PASSWORD: 'VENDOR_CHANGE_PASSWORD',
  VENDOR_CHANGE_PASSWORD_SUCCESS: 'VENDOR_CHANGE_PASSWORD_SUCCESS',
  VENDOR_CHANGE_PASSWORD_FAILURE: 'VENDOR_CHANGE_PASSWORD_PROFILE',

  CREATE_AUTHENTICATE_USER: 'CREATE_AUTHENTICATE_USER',
  CREATE_AUTHENTICATE_USER_SUCCESS: 'CREATE_AUTHENTICATE_USER_SUCCESS',
  CREATE_AUTHENTICATE_USER_FAILURE: 'CREATE_AUTHENTICATE_USER_FAILURE',

  ADMIN_USER_IUD: "ADMIN_USER_IUD",
  ADMIN_USER_IUD_SUCCESS: "ADMIN_USER_IUD_SUCCESS",
  ADMIN_USER_IUD_FAILURE: "ADMIN_USER_IUD_FAILURE",

  VERIFY_OTP: 'VERIFY_OTP',
  VERIFY_OTP_SUCCESS: 'VERIFY_OTP_SUCCESS',
  VERIFY_OTP_FAILURE: 'VERIFY_OTP_FAILURE',

  SET_USER_PERMISSION: "SET_USER_PERMISSION",

  GET_USER_ROLERIGHTS: "GET_USER_ROLERIGHTS",
  GET_USER_ROLERIGHTS_SUCCESS: "GET_USER_ROLERIGHTS_SUCCESS",
  GET_USER_ROLERIGHTS_FAILURE: "GET_USER_ROLERIGHTS_FAILURE"
};

export default actions;
