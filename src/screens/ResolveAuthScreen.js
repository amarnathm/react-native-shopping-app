import React , {useEffect, useContext } from 'react';

// import { StyleSheet , View } from 'react-native';
// import { Icon } from 'react-native-elements';

import {Context as AuthContext} from '../context/AuthContext';

const ResolveAuthScreen = () => {

    const {tryLocalSignin} =  useContext(AuthContext);

    useEffect( () => {
        tryLocalSignin();
    }, []);

    return null;

    // return (
    //     <View>
    //         <Icon 
    //             name="spinner"
    //             type="font-awesome-5"
    //         />
    //     </View>
    // )
}

// const styles = StyleSheet.create({});

export default ResolveAuthScreen;