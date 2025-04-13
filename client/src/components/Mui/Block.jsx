import { Box, Paper } from "@mui/material";

export function Block({sx = {}, children, className }) {
  return (
    <Box 
    className = { className || 'Custom_Block' }
    sx = {theme => ({
      ...theme.typography.body2,
      paddingX: {md: 2, xs: 1},
      paddingY: 1,
      textAlign: 'center',
      width: '100%',
      height: '100%',
      borderRadius: '15px',
      color: theme.palette.text.secondary,
      background: theme.palette.mode == 'dark' ? 'rgba(255, 255, 255, 0.1)' : theme.palette.primary.secondary,
      position: 'relative',
      transition: '0.5s all ease',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), 0px 1px 2px rgba(0, 0, 0, 0.1)',
      ...sx
    })}>{children}</Box>
  )
}

export default Block