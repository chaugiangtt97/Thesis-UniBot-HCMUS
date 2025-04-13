  
//   const CheckStatus = (socket, next) => {
//       socket && socket.on('/airflow/checkstatus', next)
//   }

  const CheckStatus = (socket, message) => {
    socket && socket.emit('/airflow/checkstatus', message )
}

const getStatus = (socket, next) => {
    socket && socket.on('/airflow/checkstatus', next )
}
  
  const unsign_all = (socket) => {
      if(socket) {
          socket.off('/airflow/checkstatus')
      }
  }
  

  
  
  export const Airflow = {
    CheckStatus,
      unsign_all,
      getStatus
  }
  