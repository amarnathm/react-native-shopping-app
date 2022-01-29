import React from 'react';

import { createAppContainer , createSwitchNavigator} from 'react-navigation';

import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';




import colors from '../constants/colors';

import { Ionicons } from '@expo/vector-icons' ;
import { Platform, TouchableNativeFeedbackComponent } from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import FiltersScreen from '../screens/FiltersScreen';
import ProductOverviewScreen from '../screens/shop/ProductOverviewScreen';
import CartScreen from '../screens/shop/CartScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';

import UserProductScreen from '../screens/user/UserProductScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import OrderScreen from '../screens/shop/OrdersScreen';
import OrderDetailScreen from '../screens/shop/OrderDetailScreen';
import AuthScreen from '../screens/auth/AuthScreen';
import ResolveAuthScreen from '../screens/ResolveAuthScreen';
import LogoutScreen from '../screens/LogoutScreen';
import DrawerComponent from './DrawerComponent';

const defaultStackNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? colors.primary : '' // 'white'
    },
    headerTitleStyle: {
        // color: 'white',  // this is getting preference over headerTintColor
        fontSize: 24,
        fontFamily: 'open-sans-bold'
    },
    headerBackTitleStyle : {
        fontFamily: 'open-sans'
    },
    headerTintColor: Platform.OS === 'android' ?  'white'  : colors.primary
};
// initialRouteName: ...
// mode: 'modal'  -- screen animates from bottom to top instead of left to right

const ProductNatigator = createStackNavigator({
    ProductOverview: ProductOverviewScreen,
    Cart: CartScreen,
    ProductDetail: ProductDetailScreen
},
{
    defaultNavigationOptions: defaultStackNavOptions
});

const OrdersNavigator = createStackNavigator({
    Orders: OrderScreen,
    OrderDetail: OrderDetailScreen
},
{
    defaultNavigationOptions: defaultStackNavOptions
});



const ManageProductsNavigator = createStackNavigator({
    UserProduct: UserProductScreen,
    EditProduct: EditProductScreen
}, 
{
    defaultNavigationOptions: defaultStackNavOptions
});

const tabScreenConfig = 
    {
        Product: {
            screen:  ProductNatigator,
            navigationOptions : {
                tabBarIcon: (tabInfo) => {
                    return (
                        <Ionicons name="ios-restaurant" size={25} color={tabInfo.tintColor} />
                    )
                } ,
                tabBarColor: colors.primary  // only for Material bottom tab. so no-op for ios
            }
        },
        User: {
            screen: ManageProductsNavigator,
            navigationOptions : {
                tabBarLabel: 'Manage Prodcts' ,
                tabBarIcon: (tabInfo) => {
                    return (
                        <Ionicons name="ios-star" size={25} color={tabInfo.tintColor} />
                    )
                } ,
                tabBarColor: colors.accent
            }
        }
    } ;

const ProductUserTabsNavigator = Platform.OS === 'android' ? createMaterialBottomTabNavigator(
    tabScreenConfig, { 
        activeTintColor: 'white', // colors.accent ,
        shifting: true  // if true, tabBarColor will be used
    }
) : 
createBottomTabNavigator( tabScreenConfig, {
    tabBarOptions: {
        // activeBackgroundColor: '#ccc',
        activeTintColor: colors.accent,
        labelStyle : {
            fontFamily: 'open-sans-bold'
        }
        
    } } );

// wrap the filters in a stack navigator so we get the headers
const FiltersNavigator = createStackNavigator({
    Filters: FiltersScreen
}, 
{
    // navigationOptions : {
    //     drawerLabel : 'Filters !!! '
    // },
    defaultNavigationOptions: defaultStackNavOptions
});

 const ShopNavigator = createDrawerNavigator({
    
    ProductUserNav : {
        screen: ProductUserTabsNavigator,
        navigationOptions : {
           drawerLabel: 'Products',
           drawerIcon: ( {tintColor}) => <Ionicons
                   name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                   size={23}
                   color={tintColor} />
               }
   },
    OrdersNav: {
        screen: OrdersNavigator,
        navigationOptions : {
            drawerLabel: 'Orders',
            drawerIcon: ( {tintColor}) => <Ionicons
                            name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                            size={23}
                            color={tintColor} />
         }

     },
     
    //  FiltersNav: {
    //      screen: FiltersNavigator,
    //      navigationOptions : {
    //         drawerLabel: 'Filters'
    //      }
    //  },
     LogoutNav: {
         screen: LogoutScreen,
         navigationOptions : {
            drawerLabel: 'Logout',
            drawerIcon: ( {tintColor}) => <Ionicons
                            name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                            size={23}
                            color={tintColor} />
         }
     }
     
 }, 
 {
     // see https://reactnavigation.org/docs/4.x/drawer-navigator for available options
    contentOptions: {
        activeTintColor: colors.accent,
        labelStyle: {
            fontFamily: 'open-sans-bold',
            fontSize: 16
        }
    },
    drawerBackgroundColor: 'white',
    contentComponent: DrawerComponent
});
 
const AuthNavigator = createStackNavigator({
    Auth: AuthScreen
}, 
{
    defaultNavigationOptions: defaultStackNavOptions
}

);

const switchNavigator = createSwitchNavigator({
    ResolveAuth: ResolveAuthScreen,
    Auth: AuthNavigator,
    Shop: ShopNavigator
    
});

export default createAppContainer(switchNavigator);

