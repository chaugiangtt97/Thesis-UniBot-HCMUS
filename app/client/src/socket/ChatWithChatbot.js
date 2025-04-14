const userMessage = (socket, next) => {
  socket && socket.on('/ChatWithChatBot/userMessage', next)
}

const isProcessing = (socket, next) => {
    socket && socket.on('/ChatWithChatBot/isProcessing', next)
}

const Processed = (socket, next) => {
    socket && socket.on('/ChatWithChatBot/Processed', next)
}

const streamMessages = (socket, next) => {
    socket && socket.on('/ChatWithChatBot/streamMessages', next)
}

const EndStream = (socket, next) => {
    socket && socket.on('/ChatWithChatBot/EndStream', next)
}

const EndProcess = (socket, next) => {
    socket && socket.on('/ChatWithChatBot/EndProcess', next)
}

const unsign_all = (socket) => {
    if(socket) {
        socket.off('/ChatWithChatBot/userMessage')
        socket.off('/ChatWithChatBot/isProcessing')
        socket.off('/ChatWithChatBot/Processed')
        socket.off('/ChatWithChatBot/streamMessages')
        socket.off('/ChatWithChatBot/EndStream')
        socket.off('/ChatWithChatBot/EndProcess')
    }
}

const chat = (socket, message) => {
    socket && socket.emit('/ChatWithChatBot', message )
}

export const ChatWithChatbot = {
    userMessage,
    isProcessing,
    Processed,
    streamMessages,
    EndStream,
    EndProcess,
    chat,
    unsign_all
}
