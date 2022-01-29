import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


const instance = axios.create( {
    baseURL: 'https://react-native-test1-13989-default-rtdb.firebaseio.com'
});

instance.interceptors.request.use(
    // this function will always be called
    async (config) => {
       
        // const headers = {
        //     'Content-Type': 'application/json',
        // }

        // config.headers.Authorization = `Bearer ${token}`;

        const authStr = await AsyncStorage.getItem("auth");
        if (authStr) {
            const auth = JSON.parse(authStr);
            // console.log("request header auth=", auth);
            if (config.params) {
                config.params = {...config.params, auth: auth.idToken}
            } else {
                config.params = {auth: auth.idToken}
            }
            
        }
        
        
        config.headers['Content-Type'] = 'application/json';

        // console.log("sending config:", config);
            
        return config;
    },
    // this function will be called if there is an error
    (err) => {
        console.log("header err", err);

        
        return Promise.reject(err);

        
    }

);

instance.interceptors.response.use(
    res => res,
    err => {
        console.log("axios response err", err);
        // if (err.response) {
        //     // The request was made and the server responded with a status code
        //     // that falls out of the range of 2xx
        //     console.log("err.response block", err.response.data);
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