import createDataContext from "./createDataContext";
import authApi from '../api/authApi';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { navigate } from '../navigation/navigationRef';

import ENV from '../env/env';

const API_KEY = ENV().googleApiKey;

const authReducer = (state, action ) => {
    switch (action.type ) {
        // TODO
        case 'add_error' : 
            console.log('add_error called with payload=', action.payload);
            return { ...state, errorCode: action.payload, errorMessage: createErrorMsg(action.payload) };
        case 'add_error_2' : 
            console.log('add_error2 called with payload=', action.payload);
            return { ...state, errorCode: action.payload, errorMessage: String(action.payload) };
        case 'add_error_3' : 
            console.log('add_error3 called with payload=', action.payload);
            return { ...state, errorCode: action.payload, errorMessage: String(action.payload) };
        
        case 'signup' : 
            return { errorCode: null, errorMessage: '', infoMessage: '', auth: action.payload }; 
        case 'signin' : 
            return { errorCode: null, errorMessage: '', infoMessage: '', auth: action.payload }; 
        case 'signout' : 
            return { errorCode: null, errorMessage: '', infoMessage: '', auth: null }; 
        case 'clear_error_messsage':
            // console.log('clear_error_message in authReduder');
            return { ...state, errorCode: null, errorMessage: '', infoMessage: '' };
        
        case 'add_info' : 
            console.log('add_info called with payload=', action.payload);
            return { ...state, infoMessage: action.payload };

        default:
            console.log('unknown action.type in authReducer', action.type);
            return state;
    }

}

// errorResponseData is err.response.data from the try/catch block

/*
    Object {
        "error": Object {
            "code": 400,
            "errors": Array [
                Object {
                    "domain": "global",
                    "message": "INVALID_PASSWORD",
                    "reason": "invalid",
                },
            ],
            "message": "INVALID_PASSWORD",
        },
    }

Common error codes for sign up:

EMAIL_EXISTS: The email address is already in use by another account.
OPERATION_NOT_ALLOWED: Password sign-in is disabled for this project.
TOO_MANY_ATTEMPTS_TRY_LATER: We have blocked all requests from this device due to unusual activity. Try again later.


Common error codes for sign in:

EMAIL_NOT_FOUND: There is no user record corresponding to this identifier. The user may have been deleted.
INVALID_PASSWORD: The password is invalid or the user does not have a password.
USER_DISABLED: The user account has been disabled by an administrator.

*/
const createErrorMsg = (errorResponseData) => {
 
    if (!errorResponseData.error.message) {
        return null;
    }
    let errorMessage = null;
    // https://stackoverflow.com/questions/56113778/how-to-handle-firebase-auth-exceptions-on-flutter
    switch (errorResponseData.error.message) {
        case "ERROR_INVALID_EMAIL":
          errorMessage = "Your email address appears to be malformed.";
            break;
        case "EMAIL_EXISTS":
            errorMessage = "An account with your email address exists.";
            break;
        case "INVALID_PASSWORD":
            errorMessage = "Your password is wrong.";
            break;
        case "OPERATION_NOT_ALLOWED":
            errorMessage = "Operation not allowed. Password sign-in may have been disabled for this project";
            break;
        case "TOO_MANY_ATTEMPTS_TRY_LATER":
            errorMessage = "Some unusual activity has been detected from this device. Please try again later.";
            break;
        case "EMAIL_NOT_FOUND":
            errorMessage = "There is no user record corresponding to this email. The user may have been deleted.";
            break;
        case "USER_DISABLED":
            errorMessage = "The user account has been disabled by an administrator.";
            break;
        
        // who knows if these codes are actually returned. this is from a stackover response
        case "ERROR_WRONG_PASSWORD":
          errorMessage = "Your password is wrong.";
          break;
        case "ERROR_USER_NOT_FOUND":
          errorMessage = "User with this email doesn't exist.";
          break;
        case "ERROR_USER_DISABLED":
          errorMessage = "User with this email has been disabled.";
          break;
        case "ERROR_TOO_MANY_REQUESTS":
          errorMessage = "Too many requests. Try again later.";
          break;
        case "ERROR_OPERATION_NOT_ALLOWED":
          errorMessage = "Signing in with Email and Password is not enabled.";
          break;
        default:
          errorMessage = errorResponseData.error.message;
    }

    return errorMessage;
}

const signUp = (dispatch) => async ({ email, password }) => {
        // make api req to sign up with email and password

        // if we sign up, modify our state
        // if signing up fails, need to handle it -- show error message

        try {

            console.log('in signup');
            let url = `/v1/accounts:signUp?key=${API_KEY}`;
            const body = { email: email, password: password, returnSecureToken: true };
            const response = await authApi.post(url, body );
            // console.log(response.data);

            /*

            response.data looks like this:

             {
                "email": "foo@bar.com",
                "expiresIn": "3600",
                "idToken": "eyJhbGcilomgStringw",
                "kind": "identitytoolkit#SignupNewUserResponse",
                "localId": "someString",
                "refreshToken": "AFxQ4_oUnQxSNx3tjgcLongString",
            }

            */
        
            // compute expiresAt and add it to authInfo
            const expiresAt = response.data.expiresIn
                ? new Date().getTime() + response.data.expiresIn * 1000 
                : null;
            const authInfo = { ...response.data, expiresAt: expiresAt };

            await AsyncStorage.setItem('auth', JSON.stringify(authInfo));
            dispatch({ type: 'signup', payload: authInfo });

            clearTimer();
            const expiresInMsec = response.data.expiresIn ? response.data.expiresIn * 1000 : 0;

            if (expiresInMsec) {
                setLogoutTimer(expiresInMsec, dispatch);
            }

            // navigate to main flow 
            navigate ('Shop');
            

        } catch (err ) {
            // console.log(err);

            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                // console.log("AuthContext err.response block", err.response.data);
                dispatch({ type: 'add_error', payload: err.response.data });
    
                /*
                Object {
                    "error": Object {
                        "code": 400,
                        "errors": Array [
                            Object {
                                "domain": "global",
                                "message": "INVALID_PASSWORD",
                                "reason": "invalid",
                            },
                        ],
                        "message": "INVALID_PASSWORD",
                    },
                }
    
                */
            } else if ("AuthContext err.request block", err.request) {
                // console.log(err.request);
                dispatch({ type: 'add_error_2', payload: err.request });
            } else {
                dispatch({ type: 'add_error_2', payload: err });
            }

            // 
        }
 

    };

const signIn = (dispatch) => async ( { email, password }) => {
        // make api req to sign in with email and password
        // handle succcess by updating state
        // handle failure by showing err message

        try {

            let url = `/v1/accounts:signInWithPassword?key=${API_KEY}`;
            const response = await authApi.post(url, {email: email, password: password, returnSecureToken: true});
            // console.log(response.data);

            
            /* 
                fields: displayName, email, expiresIn (seconds), idToken, kind, localId, refreshToken, registered

                compute expiresAt and add it to authInfo

            */
            
            const expiresAt = response.data.expiresIn
                ? new Date().getTime() + response.data.expiresIn * 1000 
                : null;
            const authInfo = { ...response.data, expiresAt: expiresAt };

            await AsyncStorage.setItem('auth', JSON.stringify(authInfo));
            dispatch({ type: 'signin', payload: authInfo });

            clearTimer();
            const expiresInMsec = response.data.expiresIn ? response.data.expiresIn * 1000 : 0;

            if (expiresInMsec) {
                setLogoutTimer(expiresInMsec, dispatch);
            }
            
            navigate("Shop");

        } catch (err) {

            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                // console.log("AuthContext err.response block", err.response.data);
                dispatch({ type: 'add_error', payload: err.response.data });
    
            } else if ("AuthContext err.request block", err.request) {
                dispatch({ type: 'add_error_2', payload: err.request });
            } else {
                dispatch({ type: 'add_error_2', payload: err });
            }

        }
}

let timer;

const clearTimer = () => {
    if (timer) {
        clearTimeout(timer);
    }
}

const setLogoutTimer =  (expirationTimeMsec, dispatch) => {
    clearTimer();

    timer = setTimeout(() => {
        console.log("timer expired. logging out!");
        AsyncStorage.removeItem("auth");
        dispatch({ type: 'signout' });
        dispatch({ type: 'add_info', payload: { level1: 'Your session has timed out', level2: 'Please login again' } });
        navigate("Auth");
    }, expirationTimeMsec);  // expirationTimeMsec
}


const signOut =  (dispatch) => async () => {
        //  sign out
        await AsyncStorage.removeItem("auth");
        dispatch( {type: 'signout'});
        navigate("Auth");
}

const clearErrorMessage = (dispatch) => (payload) => {
    try {
        // console.log('clearErrorMessage, payload=', payload);
        // console.log('clearErrorMessage, dispatch=', dispatch);
        dispatch( {type: 'clear_error_messsage'}) ;
    } catch (err) {
        console.log(err);
    }
   

}

const tryLocalSignin = (dispatch) => async () => {
    try {
        const authStr = await AsyncStorage.getItem("auth");
        // console.log("auth=", JSON.parse(authStr));
        let authInfo = null;
        if (authStr) {
            authInfo = JSON.parse(authStr);
        }

        // if there is an expiresAt, verify login hasn't expired.
        // i.e., either !authInfo.expiresAt  OR authInfo.expiresAt is larger than the current time
        if (authInfo &&
            (!authInfo.expiresAt || authInfo.expiresAt > new Date().getTime())) {
            
            if (authInfo.expiresAt) {
                clearTimer();
                const expiresInMsec = authInfo.expiresAt - new Date().getTime() ;

                if (expiresInMsec) {
                    setLogoutTimer(expiresInMsec, dispatch);
                }
            }
            
            dispatch({type: 'signin', payload : authInfo });
            navigate("Shop");
        }  
        else {
            await AsyncStorage.removeItem("auth");
            navigate("Auth");
        }
    } catch(err) {
        console.log(err);
    }
}


export const { Provider, Context } = createDataContext (
    authReducer,
    {signIn, signUp, signOut, clearErrorMessage , tryLocalSignin }, // actions
    { auth: null , errorCode: null, errorMessage: '', infoMessage: ''}  // defaultValue 

);