import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/material';

function AccordionUsage( {data = null} ) {
    return (
        <Box sx={{ borderRadius: '15px', paddingBottom: { xs: '45px', xl: '68px' }}}>
        {
          data && data.map((data, zIndex) => (
            <Accordion key={data?.id} defaultExpanded = {zIndex == 0} sx = {{ color: '#000', 
              background: theme => theme.palette.mode == 'dark' ? '#c7d3ff' : '#fff', 
              margin: '16px 0', borderRadius: '15px !important', 
              '& .MuiAccordionSummary-expandIconWrapper': { color: 'inherit' } }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx = {{  color: 'inherit' }} />}
                aria-controls={data.id}
                id={data.id}
                sx = {{ fontWeight: '600', fontSize: { xs: '1rem', xl: '1.425rem' } }}
              >
                {data?.summary}
              </AccordionSummary>
              <AccordionDetails sx = {{ fontWeight: '400', fontSize: { xs: '0.875rem', xl: '1.275rem' }, textAlign: 'justify' }}>
                {data?.detail}
              </AccordionDetails>
            </Accordion>
          ))
        }
        </Box>
    )
}

export default AccordionUsage