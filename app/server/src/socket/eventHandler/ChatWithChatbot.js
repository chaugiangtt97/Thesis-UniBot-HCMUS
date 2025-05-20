/* eslint-disable no-console */
/**
 * Updated by Mach Vi Kiet's author on November 15 2024
 */

import { useKHTN_Chatbot } from '../../apis/KHTN_Chatbot'
import { saveConservationToDB } from '../../controllers/v1/conservation/helper/saveConservationToDB'
import { updateChatSession } from '../../controllers/v1/conservation/helper/updateChatSession'
import { getProfileToString } from '../../utils/getProfileToString'
import { getTime } from '../../utils/getTime'
const { ObjectId } = require('mongodb')

const chatbot = useKHTN_Chatbot()

export const ChatWithChatBot = async (socket) => {
  socket.on('/ChatWithChatBot', async (req) => {

    const startTime = (new Date()).getTime()
    const message_id = new ObjectId()
    const message = req.message
    const current_session = req?.chat_session
    const conservationBefore = req?.history
    const collection = req?.collection

    let objectConservation = {
      '_id': message_id,
      'sender': socket.user._id,
      'session_id': current_session,
      'question': typeof message === 'object' ? message.question : message,
      'anwser': null,
      'state': 'in progress',
      'create_at': getTime(),
      'duration': null,
      'rating': -1,
      'resource': {
        type: 'auto'
      }
    }

    socket.emit('/ChatWithChatBot/userMessage', objectConservation)
    let resp
    try {

      socket.emit('/ChatWithChatBot/isProcessing', {
        ...objectConservation,
        notification: [{
          step_name: 'chosen_collections',
          notice: 'Xác định nội dung câu hỏi',
          state: false,
          data: null,
          time: null
        }] })

      await updateChatSession(current_session, { in_progress: objectConservation })
        .catch((err) => { throw 'Cập Nhật ChatSession Thất Bại' + JSON.stringify(err) })

      // Step 1
      const start_point_1 = (new Date()).getTime()
      let chosen_collections = null
      if (collection) {
        chosen_collections = collection
        objectConservation = { ...objectConservation, 'resource': { type: 'manual' } }
      }
      else if (message !== null && typeof message === 'object' && message?.resource?.chosen_collections) {
        chosen_collections = message.resource.chosen_collections
        objectConservation = { ...objectConservation, 'resource': { type: 'recommended' } }
      }
      else {
        chosen_collections = await chatbot.determine_collection(message, conservationBefore).then((res) => {
          return res['data'].collection
        }).catch((err) => { throw 'Lỗi ở bước determine_collection: ' + JSON.stringify(err) })
      }
      const end_point_1 = (new Date()).getTime()

      resp = {
        ...objectConservation,
        'isProcess': true,
        notification: [{
          step_name: 'chosen_collections',
          notice: 'Xác định nội dung câu hỏi',
          state: true,
          data: chosen_collections,
          duration: end_point_1 - start_point_1
        }, {
          step_name: 'filter_expressions',
          notice: 'Rút trích dữ liệu trong câu hỏi',
          state: false,
          data: null,
          time: null
        }] }

      socket.emit('/ChatWithChatBot/isProcessing', resp )

      await updateChatSession(current_session, { in_progress: resp })
        .catch((err) => { throw 'Cập Nhật ChatSession Thất Bại' + JSON.stringify(err) })

      if ( chosen_collections == null || chosen_collections == '' || !!!chosen_collections ) {
        socket.emit('/ChatWithChatBot/EndProcess', {
          ...objectConservation,
          'anwser': '',
          'state': 'request',
          'source': [],
          'update_at': getTime(),
          'duration': startTime - new Date().getTime()
        })
        return
      }


      // Step 2
      let filter_expressions

      const start_point_2 = (new Date()).getTime()
      if (message !== null && typeof message === 'object' && message?.resource?.filter_expressions) {
        filter_expressions = message.resource.filter_expressions
        objectConservation = { ...objectConservation, 'resource': { type: 'recommended' } }
      } else {
        filter_expressions = await chatbot.extract_meta(message, chosen_collections, conservationBefore).then((res) => {
          return res['data']
        }).catch((err) => { throw 'Lỗi ở bước extract_meta: ' + JSON.stringify(err) })
      }
      const end_point_2 = (new Date()).getTime()

      resp = {
        ...objectConservation,
        'isProcess': true,
        notification: [{
          step_name: 'chosen_collections',
          notice: 'Xác định nội dung câu hỏi',
          state: true,
          data: chosen_collections,
          duration: end_point_1 - start_point_1
        }, {
          step_name: 'filter_expressions',
          notice: 'Rút trích dữ liệu trong câu hỏi',
          state: true,
          data: filter_expressions,
          duration: end_point_2 - start_point_2
        }, {
          step_name: 'search',
          notice: 'Tìm kiếm tài liệu trong kho',
          state: false,
          data: null,
          time: null
        }] }

      socket.emit('/ChatWithChatBot/isProcessing', resp )

      await updateChatSession(current_session, { in_progress: resp })
        .catch((err) => { throw 'Cập Nhật ChatSession Thất Bại' + JSON.stringify(err) })

      const start_point_3 = (new Date()).getTime()

      // Step 3
      let searchResult
      if (message !== null && typeof message === 'object' && message.resource.context && message?.source) {
        searchResult = {
          context : message.resource?.context || 'Không có ngữ cảnh',
          source : message.source || []
        }
        objectConservation = { ...objectConservation, 'resource': { type: 'recommended' } }
      } else {
        searchResult = await chatbot.search(message, chosen_collections, JSON.stringify(filter_expressions), chosen_collections).then((res) => {
          return res['data']
        }).catch((err) => { throw 'Lỗi ở bước search: ' + JSON.stringify(err) })
      }
      const end_point_3 = (new Date()).getTime()

      resp = {
        ...objectConservation,
        'isProcess': true,
        notification: [{
          step_name: 'chosen_collections',
          notice: 'Xác định nội dung câu hỏi',
          state: true,
          data: chosen_collections,
          duration: end_point_1 - start_point_1
        }, {
          step_name: 'filter_expressions',
          notice: 'Rút trích dữ liệu trong câu hỏi',
          state: true,
          data: filter_expressions,
          duration: end_point_2 - start_point_2
        }, {
          step_name: 'search',
          notice: 'Tìm kiếm tài liệu trong kho',
          state: true,
          data: searchResult.context,
          duration: end_point_3 - start_point_3
        }, {
          step_name: 'generate',
          notice: 'Tạo văn bản',
          state: false,
          data: null,
          time: null
        }] }

      socket.emit('/ChatWithChatBot/isProcessing', resp)

      await updateChatSession(current_session, { in_progress: resp })
        .catch((err) => { throw 'Cập Nhật ChatSession Thất Bại' + JSON.stringify(err) })
      const start_point_4 = (new Date()).getTime()

      // Step 4
      let finalResponse
      finalResponse = await chatbot.generate(typeof message === 'object' ? message.question : message, searchResult.context, true, conservationBefore, getProfileToString(socket.user), chosen_collections).then((res) => {
        return res // StreamObject
      }).catch((err) => { throw 'Lỗi ở bước generate: ' + JSON.stringify(err) })

      const end_point_4 = (new Date()).getTime()

      resp = {
        ...objectConservation,
        'isProcess': true,
        notification: [{
          step_name: 'chosen_collections',
          notice: 'Xác định nội dung câu hỏi',
          state: true,
          data: chosen_collections,
          duration: end_point_1 - start_point_1
        }, {
          step_name: 'filter_expressions',
          notice: 'Rút trích dữ liệu trong câu hỏi',
          state: true,
          data: filter_expressions,
          duration: end_point_2 - start_point_2
        }, {
          step_name: 'search',
          notice: 'Tìm kiếm tài liệu trong kho',
          state: true,
          data: searchResult.context,
          duration: end_point_3 - start_point_3
        }, {
          step_name: 'generate',
          notice: 'Tạo văn bản',
          state: true,
          data: null,
          duration: end_point_4 - start_point_4
        }, {
          step_name: 'streaming',
          notice: 'Đang soạn',
          state: false,
          data: null,
          duration: null
        }] }

      socket.emit('/ChatWithChatBot/isProcessing', resp)

      await updateChatSession(current_session, { in_progress: resp })
        .catch((err) => { throw 'Cập Nhật ChatSession Thất Bại' + JSON.stringify(err) })

      socket.emit('/ChatWithChatBot/Processed', {
        ...objectConservation,
        chosen_collections, filter_expressions, finalResponse,
        context : searchResult.context,
        source : searchResult.source,
        create_at: getTime(),
        duration: startTime - new Date().getTime()
      })

      const reader = finalResponse.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let done = false
      let result = ''

      const point_5 = (new Date()).getTime()

      do {
        // const { value, done: doneReading } = await reader.read()
        const gpt = await reader.read()

        done = gpt.done
        if (gpt.value) {
          result += decoder.decode(gpt.value, { stream: true })

          socket.emit('/ChatWithChatBot/streamMessages', {
            ...objectConservation,
            'isProcess': true,
            'stream_state': true,
            duration: startTime - new Date().getTime(),
            create_at: getTime(),
            messages: result
          })
        }
      } while (!done)

      socket.emit('/ChatWithChatBot/EndStream', {
        ...objectConservation,
        'isProcess': true,
        'stream_state': false,
        duration: startTime - new Date().getTime(),
        stream_time: (new Date().getTime()) - point_5,
        create_at: getTime(),
        stream_message: result
      })

      const history = {
        ...objectConservation,
        'source': searchResult.source,
        'resource': {
          ...objectConservation.resource,
          chosen_collections: chosen_collections,
          filter_expressions: filter_expressions
        },
        'anwser': result,
        'state': 'success',
        'update_at': getTime(),
        'duration': startTime - new Date().getTime()
      }

      await saveConservationToDB(history).catch(() => {
        throw 'Lưu Cuộc Trò Chuyện Thất Bại: '
      })

      socket.emit('/ChatWithChatBot/EndProcess', history)

    } catch (error) {
      console.log('error:', error)
      await updateChatSession(current_session, { in_progress: null })
      socket.emit('/ChatWithChatBot/EndProcess', {
        ...objectConservation,
        'anwser': '### Hệ Thống Hiện Không Hoạt Động !\n Tôi rất tiếc, hệ thống chúng tôi đang gặp sự cố và không thể cung cấp thông tin cho bạn.\n Nếu cần thiết bạn có thể liên hệ với giáo vụ để có thông tin một cách nhanh chóng và chính xác nhất.',
        'state': 'failed',
        'source': [
          {
            'collection_name': 'Cổng Thông Tin Chính Thức',
            'url': 'https://www.fit.hcmus.edu.vn'
          }
        ],
        'update_at': getTime(),
        'duration': startTime - new Date().getTime()
      })
    }
    try {
      await updateChatSession(current_session, { in_progress: null })
        .catch(() => {
          throw 'Cập Nhật ChatSession Thất Bại '
        })
    } catch (error) {
      console.log('Lỗi ở bước cập nhật chat session', error)
    }
  })


  return socket
}

export default ChatWithChatBot