import React, { useContext } from 'react';

import {View, Text, StyleSheet, Button} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Card from '../../components/Card';
import CartItem from '../../components/CartItem';
import ProductSummary from '../../components/ProductSummary';
import colors from '../../constants/colors';

import {Context as CartContext } from '../../context/CartContext';

import {Context as OrdersContext} from '../../context/OrdersContext'

const CartScreen = ( {navigation} ) => {


    const {state: cartState, changeCartQuantity, removeFromCart, clearCart} = useContext(CartContext);

    const {state: ordersState, addOrder} = useContext(OrdersContext);

    // const findNumItemsInCart = (product) => {
    //     const cartProduct = cartState.cart.find(elem => elem.product.id === product.id);
    //     return cartProduct? cartProduct.quantity : 0;
    // }

    const cartTotal = () => {
        let sum = 0;
        cartState.cart.forEach(elem => {
            sum += elem.quantity * elem.product.price
        });
        return sum;
    }

    if (!cartState.cart || cartState.cart.length == 0 ) {
        return <View style={styles.emptyScreen}>
            <Text style={styles.emptyScreenText}>
                Your cart is empty
            </Text>
        </View>
    }
    return ( 
        <View style={styles.screen}>
            <Card style={styles.summary}>
                <Text style={styles.summaryText}>
                    Total:
                    <Text style={styles.totalPrice}> {cartTotal().toFixed(2) } </Text>
                </Text>
                <Button style={styles.orderButton} title="Place Order"
                    onPress={() => {
                        addOrder(cartState.cart);
                        clearCart();
                        navigation.navigate('Orders');
                    }}
                />
                
            </Card>
            <Card style={styles.cartList}>
                <FlatList 
                    keyExtractor={ item => item.id}
                    data={cartState.cart}
                    renderItem={ ( {item }) => {
                        return (
                            <CartItem
                                isPlacedOrder={false}
                                cartProduct={item}  
                                updateCart={(newNumItems) => changeCartQuantity(item.product, newNumItems)}
                                moreDetails={() => navigation.navigate('ProductDetail', {
                                    product: item.product
                                })}
                            />
                        )
                    }}
                />
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({

    emptyScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyScreenText: {
        fontSize: 18,
        fontFamily: 'open-sans'
    },
    screen: {
        flex: 1
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 20,
        paddingVertical: 10, 
    },
    cartList: {
        margin: 20
    },
    summaryText: {
        fontFamily: 'open-sans',
        fontSize: 18,
        marginHorizontal: 20
    },
    totalPrice: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
       
    }, 
    orderButton: {
        padding: 10
    }
    
});

export default CartScreen;

