import { MilvusClient } from '@zilliz/milvus2-sdk-node'


// Gọi API lấy danh sách collections
export async function listCollections() {
  try {
    const milvusClient = new MilvusClient({
      address: 'standalone:19530' // standalone
    })
    const res = await milvusClient.showCollections()
    return res['data'] // res['data]
  } catch (error) {
    console.error('Lỗi khi lấy collections milvus:', error)
    throw error
  }
}

// listCollections()
