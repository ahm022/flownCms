const isIE = window.navigator.userAgent.indexOf("MSIE") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

export const environment = {
  name: "staging",
  production: false,
  staging: true,
  development: false,
  hmr: false,
  ApiUrlsForBrowser: {
    graphql_schema_url: 'https://staging-leb-graph.diasporaid.com/graphql/schema?sdl',
    graphql_url: 'https://staging-leb-graph.diasporaid.com/graphql?sdl',
  },
  MsalOptionsForBrowser: {
    auth: {
      clientId: "2c99ee77-54ea-4824-8bfa-ec5421bb639d",
      authority: "https://diasporaidstaging.b2clogin.com/diasporaidstaging.onmicrosoft.com/B2C_1A_signup_signin",
      redirectUri: window.location.origin,
      navigateToLoginRequestUrl: false,
      validateAuthority: false,
      knownAuthorities: ["diasporaidstaging.b2clogin.com"],
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
    framework: {
      isAngular: true,
    },
    system: {
      navigateFrameWait: 5000,
    },
    forceRefresh: true,
    scopes: ["https://diasporaidstaging.onmicrosoft.com/graphql/user"],
  },
};
