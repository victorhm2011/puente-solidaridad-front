// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseApiUrl: 'https://puente-solidaridad-api.herokuapp.com/v1/',
  basePatientUrl: 'https://puente-solidaridad-patients.herokuapp.com/v1/',
  basePhysicianUrl: 'https://puente-solidaridad-physicians.herokuapp.com/v1/',
  baseAidUrl: 'https://puente-solidaridad-aids.herokuapp.com/v1/',
  baseSurgeryUrl: 'https://puente-solidaridad-surgerys.herokuapp.com/v1/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
