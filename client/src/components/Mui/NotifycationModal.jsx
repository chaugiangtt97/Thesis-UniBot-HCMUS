import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';

export default function NotifycationModal({ 
  modalHandler = null,
  title = null,
  content = null,
  propsContent = { content : null, props: null } 
}) {
  const ContentWithProps = propsContent.content || null
  return (
    <React.Fragment>
      <Dialog
        open={modalHandler?.state}
        onClose={modalHandler?.close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx = {{ width: 'fit-content' }}>
          <Typography variant='p'
            >{title || 'Nguồn Trích Dẫn'}</Typography>
        </DialogTitle>
        <DialogContent sx = {{ color: '#000' }}>
          <DialogContentText id="alert-dialog-description">
            <Typography variant='p' sx = {{ color: '#000' }}
            >{ content || <ContentWithProps onClose={modalHandler?.close} parent= {propsContent.props}/> || <p>'Xin lỗi bạn, tính năng này chưa được hỗ trợ ☹️'</p>}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          { modalHandler?.actionName && <Button onClick={async (e) => { await modalHandler?.action(e), modalHandler?.close()}} sx = {{ color: '#115819' }}>{modalHandler?.actionName}</Button> }
          <Button onClick={modalHandler?.close} sx = {{ color: 'red' }}> Đóng</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}