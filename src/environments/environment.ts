// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  notificationKey: 'BDHw2BWT3153FHE8zIphUvMdZcdy3VnyAmZK_VXivaQ6gD0EqDATxmZB9Q390mEHwVyanFIvOlegXPqhs1bR1yY',
  apiBaseUrl: 'https://az-qual-documentservice.channel-dss-r1-india-spm-qual-vpn.ap.e06.c01.johndeerecloud.com',
  uploadURL:'https://az-qual-uploaddocservice.channel-dss-r1-india-spm-qual-vpn.ap.e06.c01.johndeerecloud.com',
  apiuserBaseUrl:'https://az-qual-userservice.channel-dss-r1-india-spm-qual-vpn.ap.e06.c01.johndeerecloud.com',
  frontEndUrl: 'http://localhost:4200',
  apiorderBaseUrl:'https://az-qual-orderservice.channel-dss-r1-india-spm-qual-vpn.ap.e06.c01.johndeerecloud.com',
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
    CLIENT_ID: '0oa16impg47ejY7oS0h8',
    ISSUER: 'https://sso-qual.johndeere.com/oauth2/ausi8yk97rgZKt4WM0h7',
    LOGIN_REDIRECT_URI: 'http://localhost:4200/home',
    LOGOUT_REDIRECT_URI: 'http://localhost:4200/login'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
