// import PRODUCTS from "../../data/dummy-data";
// import CartProduct from "../models/cartProduct";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Product from "../models/product";
import createDataContext from "./createDataContext";
import trackerApi from '../api/tracker';


const productReducer = (state, action) => {
    
    switch(action.type) {
        
        case 'delete_product':
            const updatedAvailable = state.availableProducts.filter(elem => elem.id !== action.payload);
            const updatedUserProds = state.userProducts.filter(elem => elem.id !== action.payload);

            return { ...state, availableProducts: updatedAvailable, userProducts: updatedUserProds }
        
        case 'add_or_edit_product':
            // this will work for both edit and create
            
            console.log("add_or_edit_product action.payload=", action.payload);

            let updatedAvailableEdit = [...state.availableProducts];
            const editAvailIndex = updatedAvailableEdit.findIndex(elem => elem.id === action.payload.id);

            if (editAvailIndex >= 0) {
                updatedAvailableEdit[editAvailIndex] = action.payload;
            } else {
                // create
                updatedAvailableEdit = updatedAvailableEdit.concat(action.payload);
            }

            // with splice(), on every edit, the edited product will get pushed to the end
            // that can be avoided with the approach above
            // updatedAvailableEdit.splice(editAvailIndex, 1, action.payload);

            let updatedUserProducts = [...state.userProducts];
            const editUserIndex = updatedUserProducts.findIndex(elem => elem.id === action.payload.id);

            if (editUserIndex >= 0) {
                updatedUserProducts[editUserIndex] = action.payload;
            } else {
                // create
                updatedUserProducts = updatedUserProducts.concat(action.payload);
            }
            // see comments above
            // updatedUserProducts.splice(editUserIndex, 1, action.payload);
            
            return {...state, availableProducts: updatedAvailableEdit, userProducts: updatedUserProducts}

        case 'fetch_products':

            // map the object of objects to array of objects each product 

            const data = action.payload.data;
            const allProducts = [];
            // /userId/productId/...
            const userProds = [];
            for (let userId in data) {
                const userProdOuter = data[userId];
                for (let key in userProdOuter) {
                    const dbObj = userProdOuter[key];
                    const product = new Product({ ...dbObj, id: key });
                    allProducts.push(product);
                    if (product.ownerId === action.payload.selfId) {
                        userProds.push(product)
                    }
                } // for key in 

            } // for userId in data

            return { availableProducts: allProducts, userProducts: userProds };
        
        default:
            return state;
    }
}


const deleteProduct = dispatch => async (productId) => {

    try {
        console.log("enter deleteProduct");
        const response = await trackerApi.delete(`/products/${productId}.json`);
        dispatch({ type: 'delete_product', payload: productId });
    } catch (err) {
        console.log("deleteProduct: err=", err);
        throw (err.toString());
    }
    
}

const addProduct = dispatch => async (product) => {
    console.log("enter addProduct");
    try {

        const authStr = await AsyncStorage.getItem("auth");
        let ownerId = 'u1';
        if (authStr) {
            const auth = JSON.parse(authStr);
            ownerId = auth.localId;
        }
    
        const response = await trackerApi.post(`/products/${ownerId}.json`, product);


        console.log("addProduct response=", response);
        // console.log("key=", response.data.name);

        dispatch({ type: 'add_or_edit_product', payload: new Product({ ...product, id: response.data.name }) });
    } catch (err) {
        if (err.response) {
            console.log("addProduct", err.response.data);
        } else {
            console.log("addProduct", err);
        }
    }
}

const editProduct = dispatch => async (product) => {
    console.log("enter editProduct");
    try {
        

        const response = await trackerApi.patch(`/products/${product.ownerId}/${product.id}.json`,
        {
            title: product.title,
            description: product.description,
            imageUrl: product.imageUrl,
            ownerId: product.ownerId,
            // price: product.price
        });
        dispatch({ type: 'add_or_edit_product', payload: product });
    } catch (err) {
        if (err.response) {
            console.log("editProduct", err.response.data);
        } else {
            console.log("editProduct", err);
        }
    }
    
}

const fetchProducts = dispatch => async () => {

    try {
        console.log("enter fetchProducts");
        const response = await trackerApi.get('/products.json');

        const authStr = await AsyncStorage.getItem("auth");
        let selfId = 'u1';
        if (authStr) {
            const auth = JSON.parse(authStr);
            selfId = auth.localId;
        }

        // console.log(response);

        dispatch({ type: 'fetch_products', payload: { data: response.data, selfId: selfId } } );
    } catch (err) {
        if (err.response) {
            console.log("editProduct", err.response.data);
        } else {
            console.log("editProduct", err);
        }
    }
}


// const initialState

export const { Provider, Context } = createDataContext (
    productReducer,
    {deleteProduct , addProduct, editProduct, fetchProducts}, // actions
    { 
        // availableProducts: PRODUCTS,
        // userProducts: PRODUCTS.filter(e => e.ownerId === 'u1'),
        
        availableProducts: [],
        userProducts: [],
        
    }  // initial value of state 

);