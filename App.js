
import React, {useState} from 'react';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

import { enableScreens } from 'react-native-screens';
import { setNavigator } from './src/navigation/navigationRef';

import  {Provider as ProductProvider} from './src/context/ProductContext';
import  {Provider as OrdersProvider} from './src/context/OrdersContext';
import  {Provider as FilterProvider} from './src/context/FilterContext';

import { Provider as CartProvider } from './src/context/CartContext';

import {Provider as AuthProvider } from './src/context/AuthContext';

import ShoppingNavigation  from './src/navigation/ShoppingNavigation';

// use native optimized screens
enableScreens();

const fetchFonts = () => {

  // loadAsync returns a Promise
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  });
    
}

export default App = () => {

  const [fontLoaded, setFontLoaded] = useState(false);
  
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  } // !dataLoaded

  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <OrdersProvider>
            <FilterProvider>
              <ShoppingNavigation ref={ (navigator) => setNavigator(navigator)} />
            </FilterProvider>
          </OrdersProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
    

    
  );
}


