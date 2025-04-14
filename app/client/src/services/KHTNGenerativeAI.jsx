import React from 'react'
import { useKHTN_Chatbot } from '~/apis/KHTN_Chatbot'

const KHTNGenerativeAI = (
  before_step1, before_step2, before_step3, before_step4,
  after_step1, after_step2, after_step3, after_step4,
  beforeStream
) =>  {

  const checkIsFunction = (variable) => {
    return typeof variable === 'function'
  }

  const service = {
    apikey: null,
    setAPIkey: (key) => { this.apikey = key },
    getAPIkey : () => {
      const key = this.apikey
      return key
    },

    state: {
      isTyping: false,
      streamData: null
    },

    step_1: async function (usrInput) {
      checkIsFunction(before_step1) && before_step1(usrInput)
      return await useKHTN_Chatbot.determine_collection(usrInput, this.apikey)
    },
    step_2: async function (usrInput, chosen_collections) {
      checkIsFunction(before_step2) && before_step2(usrInput, chosen_collections)
      return await useKHTN_Chatbot.extract_meta(usrInput, chosen_collections, this.apikey)  
    },
    step_3: async function (usrInput, chosen_collections, filter_expressions) {
      checkIsFunction(before_step3) && before_step3(usrInput, chosen_collections, filter_expressions)
      return await useKHTN_Chatbot.search(usrInput, chosen_collections, filter_expressions, this.apikey)
    },
    step_4: async function (usrInput, context, isStreaming) {
      checkIsFunction(before_step4) && before_step4(usrInput, context, isStreaming)
      return await useKHTN_Chatbot.generate(usrInput,  context, isStreaming, this.apikey)
    },

    streamAction: async (streamObject, setStream) => {

      checkIsFunction(beforeStream) && beforeStream()

      const reader = streamObject.body.getReader();
      checkIsFunction(beforeStream) && setStream({streamData : '', isTyping: true})
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let result = ''
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        result += decoder.decode(value, { stream: true })
        checkIsFunction(beforeStream) && setStream(prev => ({...prev, streamData : result}))
      }
      return result
    },

    chat: async (usrInput, setStream) => {
      const startTime = (new Date()).getTime()
      const chosen_collections = await step_1(usrInput).then((res) => {
        checkIsFunction(after_step1) && after_step1(res.collection, (new Date()).getTime() - startTime)
        return res.collection
      })

      let point = (new Date()).getTime()
      const filter_expressions = await step_2(usrInput, chosen_collections).then((res) => {
        checkIsFunction(after_step2) && after_step2(res, (new Date()).getTime() - point)
        return res
      })

      point = (new Date()).getTime()
      const context = await step_3(usrInput, chosen_collections, filter_expressions).then((res) => {
        checkIsFunction(after_step3) && after_step3(res.context, (new Date()).getTime() - point)
        return res.context
      })

      point = (new Date()).getTime()
      const generate = await step_4(usrInput, context, true).then((res) => {
        checkIsFunction(after_step4) && after_step4(res, (new Date()).getTime() - point)
        return res
      })

      const finalResponse = await this.streamAction(generate, setStream)

      return {
        finalResponse, chosen_collections, 
        filter_expressions, context, 
        duration : (new Date()).getTime() - startTime
      }
    }
  }

  return service
}

export default KHTNGenerativeAI