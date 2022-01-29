import Order from "../models/order";
import createDataContext from "./createDataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import trackerApi from '../api/tracker';

const ordersReducer = (state, action) => {
    switch(action.type) {

        case 'add_order': 

            // payload: {cartItems: [CartItem]  }
            const userId = state.userId || 'guest' + Math.random().toString();

            // const dummyId = new Date().toString(); // later, this will come from the server
            // payload is cart. compute totalAmount
            // let sum = 0;
            // action.payload.forEach(cartProduct => {
            //     sum += cartProduct.quantity * cartProduct.product.price;
            // });
            const order = new Order({ ...action.payload });
               

            const updatedOrders = state.orders.concat( order );

            return {...state, userId: userId,  orders: updatedOrders} ;

        case 'remove_order' : 
            // action.payload is the order Id to be removed

            const updatedOrders2 = state.orders.filter(elem => elem.id !== action.payload);
            return { ...state, orders: updatedOrders2 };
        
        case 'fetch_orders':
            
            // map the object of objects to array of objects each product 
            const data = action.payload;
            const allOrders = [];
            for (let key in data) {
                const dbObj = data[key];
                const order = new Order({ ...dbObj, id: key });
                allOrders.push(order);
              
            } // for

            return { userId: '', orders: allOrders };

        default:
            return state;
    }
}

const addOrder = (dispatch) => async (cartItems) => {

    try {

    
        console.log("enter addOrder");
        let sum = 0;
        cartItems.forEach(cartProduct => {
            sum += cartProduct.quantity * cartProduct.product.price;
        });
        const dbObj = {
            items: cartItems,
            amount: sum,
            date: new Date()
        };

        const authStr = await AsyncStorage.getItem("auth");
        let selfId = 'u1';
        if (authStr) {
            const auth = JSON.parse(authStr);
            selfId = auth.localId;
        }

        // TODO right now, owner is hardwired
        const response = await trackerApi.post(`/orders/${selfId}.json`, dbObj);

        console.log("addOrder response=", response);
        console.log("key=", response.data.name);

        dispatch({ type: 'add_order', payload: { ...dbObj, id: response.data.name } });
    } catch (err) {
        if (err.response) {
            console.log("addOrder", err.response.data);
        } else {
            console.log("addOrder", err);
        }
    }
}

const removeOrder = (dispatch) => async (orderId) => {
    
    try {
        console.log("enter removeOrder");
        const authStr = await AsyncStorage.getItem("auth");
        let selfId = 'u1';
        if (authStr) {
            const auth = JSON.parse(authStr);
            selfId = auth.localId;
        }

        const response = await trackerApi.delete(`/orders/${selfId}/${orderId}.json`);
        dispatch({ type: 'remove_order', payload: orderId });
    } catch (err) {
        if (err.response) {
            console.log("removeOrder", err.response.data);
        } else {
            console.log("removeOrder", err);
        }
    }
}

const fetchOrders = dispatch => async () => {

    try {
        console.log("enter fetchOrders");

        let selfId;
        const authStr = await AsyncStorage.getItem("auth");
        if (authStr) {
            const auth = JSON.parse(authStr);
            selfId = auth.localId;
        }

        // console.log("selfId", selfId);

        const response = await trackerApi.get(`/orders/${selfId}.json`);

        // console.log(response);

        dispatch({ type: 'fetch_orders', payload: response.data } );
    } catch (err) {
        // console.log("fetchProducts: err=", err);
        if (err.response) {
            console.log("fetchOrders", err.response.data);
        } else {
            console.log("fetchOrders", err);
        }
    }
}


export const { Provider, Context } = createDataContext (
    ordersReducer,
    { addOrder, removeOrder, fetchOrders }, // actions 
    { 
        userId: '', orders: [],  
    }  // initial value of state 

);