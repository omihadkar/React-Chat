import React,{useState,useEffect} from 'react'
import './Chat.css'
import queryString from 'query-string'
import io from 'socket.io-client'
import InfoBar from '../InfoBar/InfoBar'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'
import TextContainer from '../TextContainer/TextContainer'

let socket;

export default function Chat({location}) {
    const [name,setName]=useState('');
    const [room,setRoom]=useState('');
    const [message,setMessage]=useState('');
    const [messages,setMessages]=useState([]);
    const [users, setUsers] = useState('');
    const ENDPOINT='localhost:5000';

    useEffect(()=>{
        const {name,room} = queryString.parse(location.search);
        socket=io(ENDPOINT);
        setName(name);
        setRoom(room);

        socket.emit('join',{name,room},(error)=>{
            if(error)
            {
                alert(error);
            }
        });
        console.log(socket);

        return ()=>{
            socket.emit('disconnect');
            socket.off();
        }
    },[ENDPOINT,location.search]);


    useEffect(()=>{
        socket.on('message',(message)=>{
            setMessages([...messages,message]);
        });

        socket.on("roomData", ({ users }) => {
            setUsers(users)});
    },[messages]);

    console.log(message,messages);

    const sendMessage=(event)=>{
        event.preventDefault();

        if(message)
        {
            socket.emit('sendMessage',message,()=>setMessage(''))
        }
    }

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}/>
                <Messages messages={messages} name={name}/>
                <Input message={message}  setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
            <TextContainer users={users}/>        
        </div>
    )
}
