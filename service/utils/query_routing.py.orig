import py_vncorenlp
#from jpype import isJVMStarted
import os
from dotenv import load_dotenv

load_dotenv('.env')
#os.environ['JAVA_HOME'] = r'C:\Program Files\Java\jdk-23'

<<<<<<< HEAD
path = "./utils/vncorenlp"
path = os.path.abspath(path)
path = path.replace('\\', '/')
    #path = r'{}'.format(path)
rdrsegmenter = py_vncorenlp.VnCoreNLP(annotators=["wseg"], save_dir=path)

def segment_vietnamese(text):
=======
# #if not isJVMStarted():
# path = "./utils/vncorenlp"
# path = os.path.abspath(path)
# path = path.replace('\\', '/')
# #path = r'{}'.format(path)
# rdrsegmenter = py_vncorenlp.VnCoreNLP(annotators=["wseg"], save_dir=path)

def segment_vietnamese(text):
    path = "./utils/vncorenlp"
    path = os.path.abspath(path)
    path = path.replace('\\', '/')
    #path = r'{}'.format(path)
    rdrsegmenter = py_vncorenlp.VnCoreNLP(annotators=["wseg"], save_dir=path)
>>>>>>> c7036b93522232d5fc6e306506d11b79f09217a1
    result = rdrsegmenter.word_segment(text)
    result = ' '.join([''.join(x) for x in result])
    del rdrsegmenter
    return result

print("Done.")
