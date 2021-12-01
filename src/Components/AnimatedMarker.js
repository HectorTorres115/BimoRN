import { AnimatedRegion, MarkerAnimated } from 'react-native-maps';
import React, { Component } from 'react'
import { Platform, Animated as AnimatedRN, Easing } from 'react-native';

export class AnimatedMarker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coordinate: new AnimatedRegion({
        longitude: -107.45220333333332,
        latitude: 24.82172166666667,
        longitudeDelta: 0.08,
        latitudeDelta: 0.08
      }),
      heading: this.props.heading,
      animacion: new AnimatedRN.Value(0)
    };

    this.spin = this.state.animacion.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg']
    })
  }

  componentWillReceiveProps(nextProps) {
    // console.log('New props received');
    const duration = this.props.duration
    if (this.props.heading !== nextProps.heading) {
      AnimatedRN.timing(this.state.animacion, {
        toValue: nextProps.heading,
        duration: this.props.duration,
        easing: Easing.linear,
        useNativeDriver: true
      }).start();
    }

    if (this.props.coordinate !== nextProps.coordinate) {
      // console.log('Coords has been changed')
      if (Platform.OS === 'android') {
        if (this.marker) {
          this.marker.animateMarkerToCoordinate(
            nextProps.coordinate,
            duration
          );
        }
      } else {
        this.state.coordinate.timing({
          ...nextProps.coordinate,
          useNativeDriver: true,
          duration
        }).start();
      }
    }
  }

  render() {
    return (
      <MarkerAnimated
        ref={marker => { this.marker = marker }}
        coordinate={this.state.coordinate}
        // icon = {require('../../assets/images/map-taxi.png')}
        >
        <AnimatedRN.View style={{transform: [{rotate: this.spin}]}, {perspective: 1000}}>
          <AnimatedRN.Image
            style={{transform: [{rotate: this.spin}] }}
            source={require('../../assets/images/map-taxi.png')}
          />
        </AnimatedRN.View>
      </MarkerAnimated>
    );
  }
}