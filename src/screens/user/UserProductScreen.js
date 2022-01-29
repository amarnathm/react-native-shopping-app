import React, { useContext } from 'react';

import {View, Text, StyleSheet, Button, Alert} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/CustomHeaderButton';
import ProductSummary from '../../components/ProductSummary';
import colors from '../../constants/colors';

import { Context as ProductContext } from '../../context/ProductContext';
import { Context as CartContext } from '../../context/CartContext';

const UserProductScreen = ({ navigation }) => {
    
    const { state: productState, deleteProduct } = useContext(ProductContext);
    
    const { removeFromCart } = useContext(CartContext);

    if (productState.userProducts.length == 0) {
        return (
            <View style={styles.empty}>
                <Text>There are no products. Maybe create some!</Text>
            </View>
        );
    }
    
    return ( 
        <View style={styles.screen}>
            <FlatList
                keyExtractor = {item => item.id}
                data={productState.userProducts}
                renderItem={ ( {item }) => {
                return (
                    <ProductSummary
                            product={item}  
                            moreDetails={() => navigation.navigate('EditProduct', {
                                productId: item.id
                            })}
                            
                            
                    >
                        <Button color={colors.primary} title="Edit"
                                onPress={() => navigation.navigate('EditProduct', {
                                    productId: item.id
                                })} />
                        
                        <Button color={colors.primary} title="Delete"
                            onPress={() => {

                                // params
                                // title, message, buttons, 
                                // and options for Android
                                Alert.alert(
                                    "Are you sure?",
                                    "This will permanently delete " + item.title,
                                    [
                                        // buttons
                                        {
                                            text: "Cancel",
                                            style: 'cancel'
                                        },
                                        {
                                            text: 'Ok',
                                            style: 'destructive',
                                            onPress: () => {
                                                deleteProduct(item.id);
                                                // also remove from cart if this product is in there
                                                removeFromCart(item.id)

                                            }
                                        }
                                        

                                    ]
                                );
                               
                            }}  />
                    </ProductSummary>
                )
                }}
            />
        </View>
    );
}

UserProductScreen.navigationOptions = ( {navigation }) => { 
    // console.log("navigationOptions navigation", navigation);
    return ( {
        headerTitle: 'Manage Products',
        
        headerLeft: () => {
            return (
                <HeaderButtons  HeaderButtonComponent={CustomHeaderButton}>
                    <Item title="Filters" iconName='ios-menu' 
                        onPress={() => navigation.toggleDrawer() } 
                    />
                </HeaderButtons>
            ); 
        },
        headerRight: () => {
            return (
                <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    <Item title="Create"
                        iconName='create'
                        onPress={() => {
                            navigation.navigate('EditProduct');
                        }}
                    
                    />
                </HeaderButtons>
            );
        }
    } )
    
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
    
});

export default UserProductScreen;

