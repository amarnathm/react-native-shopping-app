import { useState, useEffect } from 'react';

import { requestForegroundPermissionsAsync, watchPositionAsync, Accuracy } from 'expo-location';

export default (shouldTrack, callback) => {

    const [err, setErr] = useState('');

    

    useEffect( () => {

        let subscriber;

        const startWatching = async () => {

            
    
            try {
              const { granted } = await requestForegroundPermissionsAsync();
              if (!granted) {
                throw new Error('Location permission not granted');
              }
    
              const subscriber =  await watchPositionAsync( {
                        accuracy: Accuracy.BestForNavigation,  // high accuracy (needs more battery)
                        timeInterval: 1000,
                        distanceInterval: 10
    
                    }, 
                    //  location => {
                    //   addLocation(location);
                    //   }
                    callback 
                     // because callback is a prop, and used in useEffect, we put it inside useEffect
                    // so we don't forget to list it as a set of dependencies in the second argument to useEffect (in the array)
              );
            } catch (e) {
              setErr(e);
            }
        };

        if (shouldTrack) {
            startWatching();
        }
        // else stop watching
        else {
            if (subscriber) {
                subscriber.remove();
            }
            subscriber = null;
        }
        
        // cleanupFumction. will be called the next time useEffect is called
        return () => {
            if (subscriber) {
                subscriber.remove();
            }
        }
    }, [shouldTrack, callback]);   // for the second arg, if it changes, react will run useEffect again

    return [err];
}