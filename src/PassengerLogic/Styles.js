import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    serviceContainer: {
        flex: 1 / 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fab: {
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: "#16A0DB"
    },
    fabContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        height: "10%",
        width: "20%"
    },
    inputsContainer: {
        height: 120,
        position: "absolute",
        // backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        // borderWidth:2,
        // borderColor: "red",
        width: "100%",
        marginTop: 80
    },
    input: {
        backgroundColor: "rgba(255,255,255,0.5)",
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "gray",
        fontSize: 20,
        color: "black",
        width: '95%',
        // borderRadius:25,
        margin: 5,
        height: "50%",
        paddingLeft: 10
    },
    cardContainer: {
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        alignContent: 'center',
        position: "relative",
        height: "30%",
        width: "98%"
    },
    scroll: {
        flex: 1,
        // flexDirection: 'row',
        height: '100%',
        borderWidth: 2,
        borderColor: 'blue'
    },
    serviceContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: "gray",
        margin: 10
    },
    avatar: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    texto: {
        fontSize: 15,
        color: 'black'
    },
    textCard: {
        fontSize: 17,
        color: 'black',
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginLeft: 35
    },
    tripPanel: {
        flex: 1 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
})
