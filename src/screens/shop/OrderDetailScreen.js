import React, { useContext } from 'react';

import {View, Text, StyleSheet} from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CartItem from '../../components/CartItem';
import CustomHeaderButton from '../../components/CustomHeaderButton';

import {Context as OrdersContext } from '../../context/OrdersContext';
import { formattedDate } from '../../util/dateUtil';


const OrderDetailScreen = ( {navigation} ) => {

    const {state: ordersState, removeOrder} = useContext(OrdersContext);

    const order = navigation.getParam('order');

    // console.log("order detail: order", order);
    return ( 
        <View style={styles.screen}>
            {/* <Text>Order Detail</Text> */}

            <FlatList 
                keyExtractor={item => item.id}
                data={order.items}
                renderItem={ ( {item }) => {
                    return (

                        <CartItem isPlacedOrder={true}
                            cartProduct={item}
                            moreDetails={() => navigation.navigate('ProductDetail', {
                            product: item.product
                            })}
                        />

                        // <TouchableOpacity  onPress={() => {
                        //     navigation.navigate('OderDetail', {
                        //         order: item
                        //     })
                        // } } >
                        //     <View style={styles.orderItem}>
                        //         <Text>{item.date} </Text>
                        //         <Text>{item.totalAmount} </Text>
                        //     </View>
                        // </TouchableOpacity>
                    );
                }}

            />
        </View>
    );
}

OrderDetailScreen.navigationOptions = ( {navigation }) => { 
    // console.log("navigationOptions navigation", navigation);

    const order = navigation.getParam('order');

    return ( {
        headerTitle: order.readableDateSmall + ' :  $' + order.amount ,
        
        // headerLeft: () => {
        //     return (
        //         <HeaderButtons  HeaderButtonComponent={CustomHeaderButton}>
        //             <Item title="Filters" iconName='ios-menu' 
        //                 onPress={() => navigation.toggleDrawer() } 
        //             />
        //         </HeaderButtons>
        //     ); 
        // }
    } )
    
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    orderItem : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10
    }
    
});

export default OrderDetailScreen;

