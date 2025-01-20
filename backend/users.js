const users = [];

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };
 
  socket.join(user.room);
  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// Welcome current user
socket.emit('message', formatMessage(botname, 'Welcome to The Chat App!'));

// Broadcast when a user connects
socket.broadcast
.to(user.room)
.emit(
    'message',
    formatMessage(botName, '${user.username} has joined the chat!'));

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};