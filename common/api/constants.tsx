const API_URL_AUTH = process.env.NEXT_PUBLIC_APP_API_URL + '/api';

export const API_URLS = {
  AUTH: {
    LOGIN: `${API_URL_AUTH}/user/sign-in`,
    GOOGLE_LOGIN: `${API_URL_AUTH}/user/google-login-forweb`,
    VERIFY_OTP: `${API_URL_AUTH}/user/verify-otp`,
    SIGN_UP: `${API_URL_AUTH}/user/sign-up`,
    RESET_PASSWORD: `${API_URL_AUTH}/user/reset-password`,
    SEND_OTP: `${API_URL_AUTH}/user/send-otp`,
    ROLE: `${API_URL_AUTH}/role`,
    SPECIALIZATION: `${API_URL_AUTH}/specializations/get-all`,
    INTEREST: `${API_URL_AUTH}/interests/get-all`,
    UPDATE_INFO: `${API_URL_AUTH}/user/update-user`,
    USER_PROFILE: `${API_URL_AUTH}/user/profile`,
    PROFILE: `${API_URL_AUTH}/user/profile`,
    SIDEBAR_LIST: `${API_URL_AUTH}/auth/sidebar-list`,
    EDIT_DETAILS: `${API_URL_AUTH}/user/complete-user-registration`,
    PERMISSION_LIST: `${API_URL_AUTH}/user-role-permission`
  },
  ADDRESS: {
    COUNTRY: `${API_URL_AUTH}/address/countries`,
    STATE: `${API_URL_AUTH}/address/states`,
    CITY: `${API_URL_AUTH}/address/cities`
  },
  USER: {
    LIST: `${API_URL_AUTH}/user`,
    STATUS_UPDATE: `${API_URL_AUTH}/user/facilitymanager/change-status`
  },
  SPECIALIZATION: {
    LIST: `${API_URL_AUTH}/specializations/get-all`,
    ADD: `${API_URL_AUTH}/specializations/add`,
    UPDATE: `${API_URL_AUTH}/specializations/update`,
    STATUS_UPDATE: `${API_URL_AUTH}/specializations/changestatus`,
  },
  ACTIVITY: {
    LIST: `${API_URL_AUTH}/activities/get-all`,
    ADD: `${API_URL_AUTH}/activities/add`,
    UPDATE: `${API_URL_AUTH}/activities/update`,
    STATUS_UPDATE: `${API_URL_AUTH}/activities/changestatus`,
  },
  INTERESTS: {
    LIST: `${API_URL_AUTH}/interests/get-all`,
    ADD: `${API_URL_AUTH}/interests/add`,
    UPDATE: `${API_URL_AUTH}/interests/update`,
    STATUS_UPDATE: `${API_URL_AUTH}/interests/changestatus`,
  },
  CERTIFICATE: `${API_URL_AUTH}/user/upload-certificates`,
  SETTING: {
    ROLE: {
      LIST: `${API_URL_AUTH}/role`,
      CREATE: `${API_URL_AUTH}/role/add`,
      UPDATE: `${API_URL_AUTH}/role`,
      DELETE: `${API_URL_AUTH}/role`
    },
    PERMISSIONS: {
      LIST: `${API_URL_AUTH}/role-permission/roleId`,
      UPDATE: `${API_URL_AUTH}/role-permission`,
      CREATE: `${API_URL_AUTH}/role-permission`,
    },
  }
};

 