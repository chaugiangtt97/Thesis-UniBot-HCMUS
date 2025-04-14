import { Box } from "@mui/material";

export const BubbleRight = ({xs = {}}) => ( 
  <>      
    <Box sx = {{ 
      background: 'inherit',
      position: 'absolute',
      width: '6px',
      height: '6px',
      top: '5px',
      right: '-10px',
      borderRadius: '50%',
      ...xs
    }}/>
    <Box sx = {{ 
      background: 'inherit',
      position: 'absolute',
      width: '4px',
      height: '4px',
      top: '10px',
      right: '-15px',
      borderRadius: '50%',
      ...xs
    }}/>
  </> 
)
  