import * as React from 'react';
import Switch from '@mui/material/Switch';
import { Box } from '@mui/material';

export function ControlledSwitches({isChecked}) {
  const [checked, setChecked] = React.useState(isChecked);

  const handleChange = (event) => {
    // setChecked(event.target.checked);
  };

  return (
    <Switch
      checked={checked}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'controlled' }}
      onClick={(event) => {event.stopPropagation();}}
    />
  );
}

export function renderControlledSwitches(checked) {
  if(checked === null) {
    return <></>
  }
  return (
    <Box sx = {{ 
      width: '100%',
      height: '100%',
      display: 'flex',
      paddingLeft: 1
     }}>
      <ControlledSwitches isChecked = {checked.value}/>
    </Box>)
}