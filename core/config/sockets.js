
module.exports = function (io, people) {
  // On new connection, run io.on('connection'), then continue to listen for other events.
  io.on('connection', (socket) => {
    // Add socket id to list with user._id as the index
    console.log('A User Connected with ID: ' + socket.handshake.query.id);
    people.push({ "id": socket.handshake.query.id, "sid": socket.id });

    // Need to init an object to send as normal json doesn't send correctly.
    let p = {id: socket.handshake.query.id};
    
    // On a new connect send out the people that are online to everyone
    io.emit('goneOnline', p);
    io.to(socket.id).emit('online', people);

    // On disconnect
    socket.on('disconnect', () => {
      // Remove the user from the list & emit the user has gone offline so client remove the id from list.
      people = people.filter(e => e.id != socket.handshake.query.id);
      io.emit('goneOffline', p);
      console.log('A User Disconnected with ID: ' + socket.handshake.query.id);
    });

    // Testing connection
    socket.on('message', function(data) {
      console.log(socket.handshake.query.id + " says hello to the server");
    });

    // When a message is send, send to the sender and recipient.
    socket.on('dm', function(data) {
      let sender = people.filter(e => e.id == data.sender);
      let recipient = people.filter(e => e.id == data.recipient);
      if (sender && sender.length) {
        io.to(sender[0].sid).emit('message', data);
      }
      if (recipient && recipient.length) {

        io.to(recipient[0].sid).emit('message', data);
      }
      
      console.log("sending message to " + data.recipient + " from " + data.sender);
    });
  });
}