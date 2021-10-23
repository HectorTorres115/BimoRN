import gql from 'graphql-tag'

export const QUERY_DRIVERS = gql`
query{
    GetCities{
      lat, lng, indexH3, driver{name, email, isOnline}
    }
  }
`
export const QUERY_SERVICES = gql`
query{
  GetServices{
    id
    name
    icon
    mapIcon
    seats
    commissionType{ id, commissionType }
    tarifaBase
    cuotaDeSolicitudPorKm
    tarifaMinima
    costoPorKm
    costoPorTiempo
    tarifaDeCancelacion
  }
}
`
export const DRAW_ROUTE = gql`
mutation get_route_info($object: JSON){
    GetRouteInfo(object: $object) {
      startAdress
      endAdress
      polyline
      distance
      time
    }
  }
`
export const CURRENT_ADDRESS = gql`
mutation get_address($lat: Float!, $lng: Float!){
  GetAddress(lat: $lat, lng: $lng){
    name, placeId, direction
  }
}
`
export const CREATE_TRIP = gql`
mutation create_trip($passengerId: Int!, $origin: JSON!, $destination: JSON!, $paymentMethod: Int!, $note: String!){
    CreateTrip(input:{
      passengerId:$passengerId
      tripStatusId: 5
      promocodeId: 1
      commissionTypeId: 1
      origin: $origin
      destination: $destination
      paymentMethodId:$paymentMethod
      note:$note,
      serviceId: 1
    })
    {
      id
      opt
      driverId
      passengerId
      driver{ id, name }
      passenger{ id, name }
      tripStatus{ id, tripStatus }
      commissionType{ id, commissionType }
      paymentMethod{ id, paymentMethod }
      promocode{ id, code, discount }
      commission
      commissionValue
      createdAt
      currency
      originVincity
      originLocationLat
      originLocationLng
      destinationVincity
      destinationLocationLat
      destinationLocationLng
      discount
      distance
      pickedUpAt
      droppedOffAt
      fee
      feeTaxed
      feedback
      note
      rating
      rawfee
      tax
      tripPolyline
      chatId
    }
  }
`