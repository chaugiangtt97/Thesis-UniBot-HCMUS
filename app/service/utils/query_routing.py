import py_vncorenlp
#from jpype import isJVMStarted
import os
from dotenv import load_dotenv

load_dotenv('.env')
#os.environ['JAVA_HOME'] = r'C:\Program Files\Java\jdk-23'

# #if not isJVMStarted():
path = "./utils/vncorenlp"
path = os.path.abspath(path)
path = path.replace('\\', '/')
#path = r'{}'.format(path)
rdrsegmenter = py_vncorenlp.VnCoreNLP(annotators=["wseg"], save_dir=path)
#vncorenlp_path = os.path.abspath('./utils/vncorenlp')

def segment_vietnamese(text):
    result = rdrsegmenter.word_segment(text)
    result = ' '.join([''.join(x) for x in result])
    return result

print("Done.")
