import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function AccordionUsage( {data = null} ) {
    return (
        <div style={{ borderRadius: '15px', paddingBottom: '45px'}}>
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
                sx = {{ fontWeight: '600', fontSize: '1rem' }}
              >
                {data?.summary}
              </AccordionSummary>
              <AccordionDetails sx = {{ fontWeight: '400', fontSize: '0.875rem', textAlign: 'justify' }}>
                {data?.detail}
              </AccordionDetails>
            </Accordion>
          ))
        }
        </div>
    )
}

export default AccordionUsage