export const SET_LOCATION = 'SET_LOCATION'
export const SET_DRIVER = 'SET_DRIVER'
export const SET_USER = 'SET_USER'
export const SET_TOKEN = 'SET_TOKEN'
export const SET_CHAT = 'SET_CHAT'

export const set_location = (data) => {

    return {
        type: SET_LOCATION,
        payload: data
    }
}

export const set_driver = (data) => {

    // console.log(data)
    return {
        type: SET_DRIVER,
        payload: data
    }
}