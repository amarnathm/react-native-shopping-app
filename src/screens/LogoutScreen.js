import React , {useEffect, useContext } from 'react';

// import { StyleSheet , View } from 'react-native';
// import { Icon } from 'react-native-elements';

import {Context as AuthContext} from '../context/AuthContext';

const LogoutScreen = () => {

    const { signOut } = useContext(AuthContext);

    useEffect(() => {
        signOut();
    }, []);

    return null;
}


export default LogoutScreen;