
const socket = io('http://localhost:8000');

// Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageinp = document.getElementById('type-massage');
 const messagecontainer = document.querySelector('.container')

// Audio that will play on receiving messages
let audio = new Audio('tune.mp3');
// Function which will append event info to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messagecontainer.append(messageElement);
    if(position == 'left' || position == 'center'){
        audio.play();
    }
} 
// Ask new user for his/her name and let the server know
const name = prompt('Enter your name to login');
socket.emit('new-user-joined', name);

// If a new user joins, receive his/her name from the server
socket.on('user-joined', name=>{
    append(`${name} join the chat`, 'center');
});
// If server sends a message, receive it
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left');
});

// If a user leaves the chat, append the info to the container
socket.on('left', name=>{
    append(`${name} left the chat`, 'center');
});
// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault(); // prevents the page from reload to when the form is submitted
    const message = messageinp.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageinp.value = ' ';
});

