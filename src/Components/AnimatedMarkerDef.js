import React, {useEffect, useState, useRef} from 'react'
import { AnimatedRegion, MarkerAnimated } from 'react-native-maps';
import { Platform, Animated as AnimatedRN, Easing } from 'react-native';

export function AnimatedMarkerDef(props) {

    const [coords, setCoords] = useState(
        new AnimatedRegion({
            // longitude: -107.45220333333332,
            // latitude: 24.82172166666667,
            longitude: props.data.lng,
            latitude: props.data.lat,
            longitudeDelta: 0.08,
            latitudeDelta: 0.08
        })
    );

    const [animacion] = useState(new AnimatedRN.Value(0))
    const spin = animacion.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg']
    })

    const driverMarker = useRef();

    useEffect(() => {
        if(props.data !== true){
            // console.log('Prop Received: ', props.data);
            // if (this.props.heading !== nextProps.heading) {
                AnimatedRN.timing(animacion, {
                  toValue: props.data.heading + -90,
                  duration: 4000,
                  easing: Easing.linear,
                  useNativeDriver: true
                }).start();

                if (Platform.OS === 'asd') {
                    if (driverMarker !== null) {
                      driverMarker.animateMarkerToCoordinate(
                        {
                            longitude: props.data.lng,
                            latitude: props.data.lat,
                            longitudeDelta: 0.08,
                            latitudeDelta: 0.08
                        },
                        4000
                      );
                    }
                  } else {
                    coords.timing({
                      ...{
                        longitude: props.data.lng,
                        latitude: props.data.lat,
                        longitudeDelta: 0.08,
                        latitudeDelta: 0.08
                    },
                      useNativeDriver: true,
                      duration: 4000
                    }).start();
                  }
            // }
            // setCoords({
            //     longitude: props.data.longitude,
            //     latitude: props.data.latitude,
            //     longitudeDelta: 0.08,
            //     latitudeDelta: 0.08
            // });
            // setHeading(props.data.heading);
        }
     }, [props.data])

     return (
        <MarkerAnimated
        ref={driverMarker}
          coordinate={coords}
          >
          <AnimatedRN.View style={{transform: [{rotate: spin}]}, {perspective: 1000}}>
          {/* <AnimatedRN.View style={{transform: [{rotate: spin}]}}> */}
            <AnimatedRN.Image
              style={{transform: [{rotate: spin}] }}
              source={require('../../assets/images/map-taxi.png')}
            />
          </AnimatedRN.View>
        </MarkerAnimated>
      );
}