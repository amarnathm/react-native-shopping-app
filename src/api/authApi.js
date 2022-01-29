// docs: https://firebase.google.com/docs/reference/rest/auth#section-create-email-password

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

/*
firebase sign-up with email/password:
https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

sign-in with password:
https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

*/

const instance = axios.create( {
    baseURL: 'https://identitytoolkit.googleapis.com'
});

/*

request body: 
    email, 
    password , 
    returnSecureToken : boolean whether or not to return an ID and refresh token. Should always be true.


    response payload:

    idToken	        string	A Firebase Auth ID token for the newly created user.
    email	        string	The email for the newly created user.
    refreshToken	string	A Firebase Auth refresh token for the newly created user.
    expiresIn	    string	The number of seconds in which the ID token expires.
    localId	        string	The uid of the newly created user.


for sign-in, additional field in response:

    registered	    boolean	Whether the email is for an existing account.

Common error codes for sign up:

EMAIL_EXISTS: The email address is already in use by another account.
OPERATION_NOT_ALLOWED: Password sign-in is disabled for this project.
TOO_MANY_ATTEMPTS_TRY_LATER: We have blocked all requests from this device due to unusual activity. Try again later.


Common error codes for sign in:

EMAIL_NOT_FOUND: There is no user record corresponding to this identifier. The user may have been deleted.
INVALID_PASSWORD: The password is invalid or the user does not have a password.
USER_DISABLED: The user account has been disabled by an administrator.

*/

instance.interceptors.request.use(
    // this function will always be called
    async (config) => {
       
        const authStr = await AsyncStorage.getItem("auth");
        if (authStr) {
            const auth = JSON.parse(authStr);
            console.log("request header auth=", auth);
            config.headers.Authorization = `Bearer ${auth.idToken}`;
        }
        
        config.headers['Content-Type'] = 'application/json';

        // console.log("axios request config", config);
            
        return config;
    },
    // this function will be called if there is an error
    (err) => {
        console.log("header err", err);
        return Promise.reject(err);

        
    }

);

instance.interceptors.response.use(
    res => {
        // console.info("axios res block", res);
        return res
    },
    err => {
        console.log("axios err block", err);

        // err.response.data looks as below. It will be handled in AuthContext
        // if (err.response) {
        //     // The request was made and the server responded with a status code
        //     // that falls out of the range of 2xx
        //     console.log("err.response block", err.response.data);

        //     /*
        //     Object {
        //         "error": Object {
        //             "code": 400,
        //             "errors": Array [
        //                 Object {
        //                     "domain": "global",
        //                     "message": "INVALID_PASSWORD",
        //                     "reason": "invalid",
        //                 },
        //             ],
        //             "message": "INVALID_PASSWORD",
        //         },
        //     }

        //     */
        //   } else if ("err.request block", err.request) {
        //     console.log(err.request);
        //   } else {
        //     console.log("Error neither block", err.message);
        // }
        
        
        
        return Promise.reject(err);
        // throw (err);
        // throw new Error(err.response.data.message);
    }
);

// instance.interceptors.request.use(
//     // this function will always be called
//     async (config) => {
//         const token = await AsyncStorage.getItem("token");
//         if (token) {
//             // console.log("header token=", token);
//             config.headers.Authorization = `Bearer ${token}`;
//             // config.headers.Authorization = token;
//         }
//         return config;
//     },
//     // this function will be called if there is an error
//     (err) => {
//         console.log("header err", err);
//         return Promise.reject(err);
//     }

// );

export default instance;