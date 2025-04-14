import React from 'react'
import {
  GoogleGenerativeAI as serice,
} from "@google/generative-ai";

export function GoogleGenerativeAI(
  apiKey = import.meta.env.VITE_GOOGLE_GENERATIVE_API_APIKEY,
  modelName = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_MODEL
) {

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  try {
    const genAI = new serice(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
    });

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const chat = async (text) => {
      const res = chatSession.sendMessage(text).then(
        (result) => {
          return {
            "id": Math.floor(10000 + Math.random() * 900000),
            "role": "bot",
            "message": result.response.text()
        }}).catch((e) => { 
          return {
            "id": Math.floor(10000 + Math.random() * 90000),
            "role": "bot",
            "message": `Xin lỗi, Tôi không thể kết nối với server`
          }
        }
      ); 
      return res
    }
  
    const genAIModel = {
      startChat: (text) => chat(text)
    }

    return genAIModel

  } catch (error) {
    console.error('Erroe: ', error)
    return null
  }
}
