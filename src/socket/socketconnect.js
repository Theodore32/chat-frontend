import openSocket from 'socket.io-client';
const  socket = openSocket('http://10.183.28.154:8000');
function sendChat(port,msg) {
  socket.emit(port, msg);
}

function recieveChat(user,toFront){
  socket.on(user, message => toFront(null,message));
}
export { sendChat ,recieveChat};
