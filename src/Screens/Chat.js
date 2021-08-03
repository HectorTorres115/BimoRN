import React, {useState,useEffect,useRef} from 'react'
import { StyleSheet, Text, View, TextInput,Button, FlatList } from 'react-native'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo'
import { backAction,handleAndroidBackButton } from '../Functions/BackHandler'
import { useUsuario } from '../Context/UserContext'
import { ChatListener } from '../Listeners/ChatListener'

const GET_CHATS_BYID = gql`
query get_chat_byid($id: Int!){
    GetChatById(id:$id){
      id
      createdAt
      status
      driverId
      passenger{
        id
        name
        email
      }
      driver{
        id
        name
        email
      }
      messages{
        id
        chatId
        message
        sender
        hour
      }
      readed
    }
  }
`
const CREATE_MESSAGE = gql`
mutation create_message($chatid: Int!,$message: String!,$sender: String!){
    CreateMessage(input:{
      chatId:$chatid
      message:$message
      sender:$sender
    }){
      id
      sender
      message
      hour
    }
  }
`

export const Chat = (props)=> {

    useEffect(() => {

        console.log('componente montado')
        // lista.current.scrollToEnd()
        handleAndroidBackButton(() => backAction(props.navigation.navigate('Mapas')))
        return ()=> {
            handleAndroidBackButton(() => backAction(setUser))
        }

    }, [])

    const lista = useRef(React.Component)
    const [chat,setChat] = useState({})
    const [message,setMessage] = useState({})
    const [messages,setMessages] = useState([])

    //Global states
    const {usuario, setUser} = useUsuario();

    useQuery(GET_CHATS_BYID,{
        fetchPolicy: "no-cache",
        variables:{
            id:4
          },
        onCompleted:({GetChatById})=>{

            console.log(GetChatById);
            setChat(GetChatById)
            setMessages(GetChatById.messages)
            // lista.current.scrollToEnd()
        },
        onError:(err)=>{
            console.log(err);
        }
    })

    const [create_message] = useMutation(CREATE_MESSAGE,{
        fetchPolicy: "no-cache",
        variables:{
            chatid:4,
            message:message,
            sender: usuario.name
          },
        onCompleted:({CreateMessage})=>{

            // console.log(CreateMessage);
            setMessage('')
        },
        onError:(err)=>{
            console.log(err);
        }
    })

    function evaluateMessage(item) {
        if(item.sender !== usuario.name){
            return (
                <View style={styles.test}>
                    <View style={styles.MessagesContainerAlt}>
                        <Text style={styles.textName}>{item.sender}</Text>
                        <Text style={styles.textMessage}>{item.message}</Text>
                    </View>
                </View>
            )
        }else{
            return (
                <View style={styles.testAlt}>
                    <View style={styles.MessagesContainer}>
                        <Text style={styles.textName}>{item.sender}</Text>
                        <Text style={styles.textMessage}>{item.message}</Text>
                    </View>
                </View>
            )
        }
    } 

    return (
        <View style={styles.container}>
            <View style={styles.chatContainer}>
                <FlatList 
                ref= {lista}
                data={messages} 
                key = {(item)=> item.id}
                keyExtractor = {(item)=> item.id}
                renderItem = { ({item})=> (evaluateMessage(item))} />
                <ChatListener messages={messages} setter={setMessages} chatId= {4} lista={lista}/>
            </View>
            <View style={styles.inputContainer}>
                <TextInput placeholder={'Message'} placeholderTextColor={'gray'} onChangeText={(message)=>setMessage(message)} value={message} style={styles.inputText}/>
                <Button title='Send' onPress={async ()=> await create_message()}></Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        width:'100%',
        height:'100%',
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    chatContainer:{
        flex: 7/8,
        width:'100%',
        height:'100%',
        // justifyContent:'center',
        // alignItems: 'center',
        
    },
    inputContainer:{
        flex: 1/8,
        width:'100%',
        height:'100%',
        justifyContent:'space-around',
        alignItems: 'center',
        borderColor:'gray',
        borderWidth:1,
        flexDirection:'row',
    },
    inputText:{
        fontSize:15,
        borderRadius:5,
        borderWidth:1,
        borderColor:'gray',
        color: 'black',
        backgroundColor: 'white',
        width:'70%'
    },
    MessagesContainerAlt:{
        width:'80%',
        // height: 50,
        flex:1,
        backgroundColor: 'lightblue',
        borderRadius: 10,
        display:'flex',
        // justifyContent:'flex-end',
        // alignItems: 'flex-end',
        margin:10
    },
    MessagesContainer:{
        width:'80%',
        // height: 50,
        flex:1,
        backgroundColor: 'lightgray',
        borderRadius: 10,
        // justifyContent:'flex-start',
        // alignItems: 'flex-start',
        margin:10
    },
    textName:{
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 20,
        color: 'black'
    },
    textMessage:{
        fontSize: 15,
        marginLeft: 20,
        marginRight: 20,
        color: 'black',
        textAlign: 'justify'
    },
    test:{
        width:'100%',
        flex:1,
        justifyContent:'flex-start',
        alignItems: 'flex-start'
    },
    testAlt:{
        width:'100%',
        flex:1,
        justifyContent:'flex-end',
        alignItems: 'flex-end'
    },
})
