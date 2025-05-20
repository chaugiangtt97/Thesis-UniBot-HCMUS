/* eslint-disable no-console */
import { useAirflow } from '../../apis/Airflow'
import { saveNewDocumentToDB } from '../../controllers/v1/document/helper/saveNewDocumentToDB'

const airflow = useAirflow()
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
export const ProcessDocument = async (socket) => {
  socket.on('/airflow/checkstatus', async (req) => { // dag_id, dag_run_id, state
    try {
      let res
      do {
        res = await airflow.CheckStatus(req?.dag_id, req?.dag_run_id)
        if (res?.state != req?.state) {
          socket.emit('/airflow/checkstatus', { 'file_id': req?.file_id, state: res.state })
          let new_document = {}
          if ( res.state == 'success' ) {
            new_document = { state: res.state, isactive: true }
          } else {
            new_document = { state: res.state, isactive: false }
          }
          await saveNewDocumentToDB(req?.file_id, new_document)
        }
        await delay(3000)
      } while (res.state != 'success' && res.state != 'failed')


    } catch (error) {
      socket.emit('/airflow/checkstatus/error', { 'message': 'Tự Động Cập Nhật Trạng Thái Thất Bại' })
      console.log('Ghi nhận lịch sử thất bại', error)
    }
  })
}

export default ProcessDocument