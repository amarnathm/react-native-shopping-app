import React, { useState } from 'react';

import {View, Text, StyleSheet, TouchableOpacity, Platform, TouchableNativeFeedback} from 'react-native';
import colors from '../constants/colors';
import CartItemAddSub from './CartItemAddSub';

import {Ionicons, Feather} from '@expo/vector-icons';

// output a small version of the item. skip the image and description.

const CartItem = ( {isPlacedOrder, cartProduct, updateCart, moreDetails} ) => {

    // let TouchableCompoment = TouchableOpacity;
    // if (Platform.OS === 'android' && Platform.Version >= 21) {
    //     TouchableCompoment = TouchableNativeFeedback;
    // }


    // console.log("cartItem cartProduct", cartProduct);

    // if order has already been placed, this is a noop. we are not letting you update it here. 
    // to update it, we need to put this order back in cart, and take user back to CartScreen
    // too involved for now
    const [showCart, setShowCart] = useState(false); 

    return ( 
        
        <View style={styles.cartItemContainer}>

            <View style={styles.column1}>

                <View style={styles.titleUnitPrice}>
                    <TouchableOpacity onPress={moreDetails}>
                        <Text style={styles.title}>{cartProduct.product.title}</Text> 
                        <Text style={styles.price}>
                            {cartProduct.quantity} item{cartProduct.quantity > 1? 's' : ''},
                            @ ${cartProduct.product.price}
                        </Text>
                    </TouchableOpacity>
                </View>

                { !isPlacedOrder 
                    
                    ?
                
                    <View style={styles.cartActions}>

                        { showCart
                        ? 
                            <View style={styles.buttonContainer} >
                                <CartItemAddSub numItems={cartProduct.quantity} updateNumItems={ (newNumItems) => updateCart(newNumItems)} /> 
                            </View>

                        : 
                            <View>
                                <TouchableOpacity onPress={() => setShowCart(true)}>
                                    {/* <Text style={styles.link}>Modify-Quantity</Text> */}
                                    <Feather 
                                        name='edit'
                                        size={23}
                                        color='grey' />
                                </TouchableOpacity>
                            </View>
                            
                        }

                            
                        <TouchableOpacity onPress={() => updateCart(0)} >      
                                    {/* <Text style={styles.link}>Remove-Item</Text> */}
                                    <Ionicons style={styles.deleteButton}
                                        name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
                                        size={23}
                                        color='grey' />

                        </TouchableOpacity>
                         
                    

                    </View>

                    : null

                }       
                
                
            </View>

            <Text style={styles.totalCost}>{ (cartProduct.product.price * cartProduct.quantity).toFixed(2)}</Text>
               
        </View>
    );
}

const styles = StyleSheet.create({
    cartItemContainer: {
        marginHorizontal: 20,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',  
        width: '100%',
        height: 150
    }, 
    column1: {
        width: '60%',
    },
    titleUnitPrice: {
        // alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
    },
    totalCost : {
        fontFamily: 'open-sans',
        fontSize: 16,
        width: '20%',
        // alignSelf: 'flex-end'
    },
    title: {
        fontFamily: 'open-sans',
        fontSize: 18,
    },
    price: {
        fontFamily: 'open-sans',
        fontSize: 16,
        // color: '#888'
    },
    buttonContainer:  {
        height: 40,
        marginRight: 20
    },
    cartActions: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginVertical: 20,
        alignItems: 'center',
        // justifyContent: 'space-between',
        width: '100%'
    },
    link: {
        color: colors.link,
        fontSize: 14,
        fontFamily: 'open-sans'
    },
    deleteButton : {

    }
    
    
    
    
});

export default CartItem;

