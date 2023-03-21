import { environment as defaultEnvironment } from './environment.defaults';
export const environment = {
  ...defaultEnvironment,
  production: true,
  notificationKey: 'BDHw2BWT3153FHE8zIphUvMdZcdy3VnyAmZK_VXivaQ6gD0EqDATxmZB9Q390mEHwVyanFIvOlegXPqhs1bR1yY',
  apiBaseUrl: 'https://adzoneback-dev.heptagon.tech',
  apiuserBaseUrl:'https://adzoneback-ums.heptagon.tech',
  frontEndUrl: 'https://adzonefront-dev.heptagon.tech',
  apiorderBaseUrl:'https://adzoneback-order.heptagon.tech',
  language: 'es',
  firebase: {
    apiKey: 'AIzaSyDx4ADouZEzkelfGRxFhP7-l6VRsVW9C8A',
    authDomain: 'test-projects-186ba.firebaseapp.com',
    projectId: 'test-projects-186ba',
    storageBucket: 'test-projects-186ba.appspot.com',
    messagingSenderId: '917154581471',
    appId: '1:917154581471:web:4be9b5fb18c60c45f1d26a',
    measurementId: 'G-ZFSGXS0MR0'
  },
  firebaseServerKey: 'AAAA1YqsS98:APA91bFJfkHE06EadefwdNbJPj01i3_STADRmUHskN5OmifpaizWkZsgfWfY1kF5mPnmIaG_vFma5szxYfnMagweJmZU9xUltSQuJEh5tmUorbd4yRpolTbgkv_Ts3R-XctTlgXklVO_',
  oktaDetail: {
    // CLIENT_ID: '0oa10iizk4iNqDhg60h8',
    CLIENT_ID: '0oa15pemd5b7hV7Jo0h8',
    ISSUER: 'https://sso-dev.johndeere.com/oauth2/ausgnh0431ebF8iiL0h7',
    LOGIN_REDIRECT_URI: 'https://adzonefront-dev.heptagon.tech/home',
    LOGOUT_REDIRECT_URI: 'https://adzonefront-dev.heptagon.tech/login'
  }
};
