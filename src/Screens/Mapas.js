import React, {useState, useRef} from 'react'
import { Button } from 'react-native'
//Maps
import MapView, {Marker} from 'react-native-maps'
// import darkStyle from '../Maps/mapstyle'

export const Mapas = () => {
    //State
    const globalMarker = useRef(React.Component);
    const [location, setLocation] = useState([]);
    const [region] = useState({
        longitude: -107.45220333333332,
        latitude: 24.82172166666667,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08
    });

    async function drawMarkers(object){
        if(location.length < 1){
            setLocation([...location, {color: "#00FF00", ...object}])
        } else if (location.length == 1) {
            setLocation([...location, {color: "#0000FF", ...object}])
        } else {
            setLocation([]);
        }
    }

    function animateMarker() {
        let duration = 1000
        globalMarker.current.animateMarkerToCoordinate(location[0], duration)
    }

    return(
        <>
        <MapView
        onPoiClick = {(e) => drawMarkers(e.nativeEvent.coordinate)}
        onPress = {(e) => drawMarkers(e.nativeEvent.coordinate)}
        // customMapStyle={darkStyle}
        style={{ flex: 1, width: '100%', height: '100%', zIndex: -1 }}
        initialRegion = {region}>
            {location.map(coord => {
                return <Marker ref = {globalMarker} coordinate = {coord} pinColor={coord.color}/>
            })}
        </MapView>
        <Button title = "Animate marker" onPress = {() => animateMarker()}/>
        </>
    )
}