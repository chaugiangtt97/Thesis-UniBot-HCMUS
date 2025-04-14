import { determine_collection } from './Conservation/determine_collection'
import { generate } from './Conservation/generate'
import { search } from './Conservation/search'
import { extract_meta } from './Conservation/extract_meta'

import { get_collection_schema } from './Document/get_collection_schema'
import { get_chunk_file } from './Document/get_chunk_file'
import { delete_file } from './Document/delete_file'
import { enhance_file } from './Document/enhance_file'

export const useKHTN_Chatbot = () => ({
  determine_collection,
  generate,
  search,
  extract_meta,

  get_collection_schema,
  get_chunk_file,
  delete_file,
  enhance_file
})