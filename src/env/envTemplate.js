// copy this file to env.js and make changes.
// do not check env.js into git

const variables = {
    development: {
        googleApiKey: 'abc'
    },
    production: {
        googleApiKey: 'xyz'
    }
};

/*

The special __DEV__ global variable offered by Expo helps you - it's a variable 
which you can always access anywhere in your Expo-driven React Native project to 
determine whether you're running this app in development mode or not.

*/
 
const getEnvVariables = () => {
    if (__DEV__) {
        return variables.development; // return this if in development mode
    }
    return variables.production; // otherwise, return this
};
 
export default getEnvVariables; // export a reference to the function


/*

You would use that file like this:

someOtherFile.js

import ENV from './env';
...
const apiKey = ENV().googleApiKey;

*/