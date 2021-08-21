import {SET_LOCATION} from './Redux-actions'
import {SET_USER} from './Redux-actions'
import {SET_TOKEN} from './Redux-actions'
import {SET_CHAT} from './Redux-actions'
import {SET_DRIVER} from './Redux-actions'

export const default_location_state = {
    longitude: null,
    latitude: null,
}

export const default_driver_state = {
    indexDriver: null,
    indexPassenger: null,
}

export const default_users_state = {
    name: null,
    name2: null,
    lastName: null,
    lastName2: null,
    username: null,
    password: null,
    password2: null,
    deviceToken: null
}

export const default_chat_state = {}

export const location_reducer = (state = default_location_state, action) => {
    switch(action.type) {
        case SET_LOCATION: {
            // console.log(action.payload)
            state = action.payload
            return state
        }
        default: return state;
    }
}

export const driver_reducer = (state = default_driver_state, action) => {
    switch(action.type) {
        case SET_DRIVER: {
            // console.log(action.payload)
            state = action.payload
            return state
        }
        default: return state;
    }
}

