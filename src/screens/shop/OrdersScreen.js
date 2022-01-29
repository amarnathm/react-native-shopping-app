import React, { useContext } from 'react';

import {View, Text, StyleSheet, Button} from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/CustomHeaderButton';

import {Context as OrdersContext } from '../../context/OrdersContext';


const OrdersScreen = ( {navigation} ) => {

    const { state: ordersState, addOrder, fetchOrders } = useContext(OrdersContext);
    
    // if (ordersState.orders.length == 0) {
    //     return (
    //         { ordersState.orders.length == 0 && <View style={styles.empty}>
    //             <Text>There are no orders. Maybe create some!</Text>
    //             </View>
    //         }
    //     );
    // }

    return ( 
        <View style={styles.screen}>
            {/* <Text>Order Screen</Text> */}

            <NavigationEvents onWillFocus={fetchOrders} />

            <FlatList 
                keyExtractor={item => item.id}
                data={ordersState.orders}
                renderItem={ ( {item }) => {
                    return (
                        <TouchableOpacity  onPress={() => {
                            navigation.navigate('OrderDetail', {
                                order: item
                            })
                        } } >
                            <View style={styles.orderItem}>
                                <Text style={styles.date}>{item.readableDate} </Text>
                                <Text style={styles.amount}>{item.amount.toFixed(2)} </Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}

            />

            { ordersState.orders.length == 0 && <View style={styles.empty}>
                <Text>There are no orders. Maybe create some!</Text>
                </View>
            }
        </View>
    );
}

OrdersScreen.navigationOptions = ( {navigation }) => { 
    // console.log("nav igationOptions navigation", navigation);
    return ( {
        headerTitle: 'My Orders',
        
        headerLeft: () => {
            return (
                <HeaderButtons  HeaderButtonComponent={CustomHeaderButton}>
                    <Item title="Filters" iconName='ios-menu' 
                        onPress={() => navigation.toggleDrawer() } 
                    />
                </HeaderButtons>
            ); 
        }
    } )
    
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        margin: 20
    },
    orderItem : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'grey'
    },
    date :{
        fontFamily: 'open-sans',
        fontSize: 18
    },
    amount :{
        fontFamily: 'open-sans-bold',
        fontSize: 20
    },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
    
});

export default OrdersScreen;

