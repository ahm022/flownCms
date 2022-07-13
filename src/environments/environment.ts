
import { environment as staging } from './environment.staging';

let host = window.location.hostname.toLowerCase();

let isStaging = (host === "staging-admin.diasporaid.com" || location.href.indexOf("force-staging-environment") > 0);

let environment = isStaging || host === "localhost" ? staging : staging;;
// isStaging || host === "localhost" ? staging : (isProduction ? production : development);

export { environment };