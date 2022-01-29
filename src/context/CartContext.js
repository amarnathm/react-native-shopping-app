import createDataContext from "./createDataContext";

import CartProduct from '../models/cartProduct';

/*

state will be of the form:

{
    userId: string,
    cart: [CartProduct]
}

where CartProduct is: 

{
    product: Product,
    quantity: number 
}

when user logs out, state becomes:
    { userId: ';, cart: [] }
*/

const cartReducer = (state, action) => {
    switch(action.type) {
        case "change_cart_quantity": 

            // console.log("changeCartQuantity - before:", state);

            // console.log("action", action);
            
            // action.payload.quantity is the new total quantity. use this value for new quantity
            // dont add it to current quantity

            // if userId is not yet set, use a random one (let users who dont have an account shop)
            const userId = state.userId || 'guest' + Math.random().toString();
            let stateChanged = false;
            let cartCopy =  [...state.cart];
            const index = cartCopy.findIndex(cartProduct => cartProduct.id === action.payload.product.id);
            if (index < 0 ) {
                // new item to add to cart (if quantity is > 0)
                // console.log("here");
                if ( action.payload.quantity > 0) {
                    cartCopy.push(new CartProduct(action.payload.product, action.payload.quantity) );
                    stateChanged = true;

                    // console.log("here2, cartCopy", cartCopy);
                }
                // else no-op -- don't add to cart stuff with quantities <= 0
               
            } else if (index >= 0) {
                // product is already in cart. update quantity, and if quantity becomes <=0, remove it from cart
                // const newQuantity = cartCopy[index].quantity + action.payload.quantity;
                const newQuantity =  action.payload.quantity;
                if (newQuantity <= 0) {
                    // remove item from cart
                    cartCopy.splice(index, 1);
                } else {
                   // update quantity
                   cartCopy[index].quantity = newQuantity;
                }

                // in both cases, stateChanged is true
                stateChanged = true;
            }

            // console.log("stateChanged", stateChanged);

           

            if (stateChanged) {
                // console.log("after: state=", {...state, userId: userId, cart: cartCopy });
                return {...state, userId: userId, cart: cartCopy };
            } else {
                return state;
            }
            
        case  'remove_from_cart':

            const index2 = state.cart.findIndex(cartProduct => cartProduct.id === action.payload);

            if (index2 < 0) {
                return state;
            } else {
                let cartCopy =  [...state.cart];
                cartCopy.splice(index2, 1);
                return { ...state, cart: cartCopy }
            }
          
        case 'clear_cart' :
            return {...state, cart: []}

        default:
            return state;
    }
}

// const incrCart = (dispatch) => (product) => {
//     dispatch( {type: 'change_cart_quantity', payload: {product, quantity: 1 }});
// }

// const decrCart = (dispatch) => (product) => {
//     dispatch( {type: 'change_cart_quantity', payload: {product, quantity: -1 }});
// }

const changeCartQuantity = (dispatch) => (product, quantity) => {
    dispatch( {type: 'change_cart_quantity', payload: {product, quantity}});
   
}

const removeFromCart = (dispatch) => (productId) => {
    dispatch( {type: 'remove_from_cart', payload: productId});
}

const clearCart = (dispatch) => () => {
    dispatch( {type: 'clear_cart'});
}


export const { Provider, Context } = createDataContext (
    cartReducer,
    {changeCartQuantity, removeFromCart, clearCart}, // actions
    { 
       userId: '', cart: [] ,  // array of CartProduct
    }  // initial value of state 

);