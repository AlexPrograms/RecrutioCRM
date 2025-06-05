import { Box, useTheme } from "@mui/material";
import Header from "../../components/header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";
import { useState } from "react";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <Box 
      sx={{ 
        height: 'calc(100vh - 120px)', 
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        p: '20px',
        boxSizing: 'border-box'
      }}
    >
      <Box sx={{ flexShrink: 0, mb: 1 }}>
        <Header title="FAQ" subtitle="Frequently Asked Questions Page" />
      </Box>
      {/* Search Bar - Centered vertically and wider */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ 
          flex: expanded ? '1 1 auto' : '2 1 auto', 
          minHeight: expanded ? '60px' : 'auto',
          maxHeight: expanded ? '100px' : '60%', 
          width: '100%',
          transition: 'all 0.3s ease-in-out',
          mb: 1
        }}
      >
        <Box
          component="form"
          sx={{
            display: 'flex',
            alignItems: 'center',
            background: colors.primary[400],
            borderRadius: '2rem',
            boxShadow: 3,
            px: 2,
            py: 1.2,
            minWidth: { xs: '95%', sm: '80%', md: '70%' }, 
            maxWidth: '1000px', 
            transition: 'box-shadow 0.3s',
            '&:focus-within': {
              boxShadow: 6,
            },
          }}
        >
          <input
            type="text"
            placeholder="Ask AI about your company"
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              flex: 1,
              fontSize: '1.1rem',
              padding: '0.6rem',
              color: colors.grey[100],
              borderRadius: '2rem',
              transition: 'background 0.2s',
            }}
          />
          <button
            type="submit"
            style={{
              marginLeft: 8,
              background: colors.greenAccent[600],
              border: 'none',
              borderRadius: '50%',
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s, transform 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.grey[900]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="17 11 12 6 7 11" />
              <line x1="12" y1="18" x2="12" y2="6" />
            </svg>
          </button>
        </Box>
      </Box>

      {/* FAQ Accordions - Controlled expansion with smooth animations */}
      <Box sx={{ 
        flex: '0 0 auto',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: colors.primary[300],
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: colors.primary[200],
        },
      }}>
        <Accordion 
          expanded={expanded === 'panel1'} 
          onChange={handleChange('panel1')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={colors.greenAccent[500]} variant="h5">
              An Important Question
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
              malesuada lacus ex, sit amet blandit leo lobortis eget. Donec
              consequat, nulla nec fermentum tempor, nulla nunc cursus nulla,
              vel cursus nulla nulla nec nulla. Sed nec nulla nec nulla
              consectetur adipiscing elit.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion 
          expanded={expanded === 'panel2'} 
          onChange={handleChange('panel2')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={colors.greenAccent[500]} variant="h5">
              Another Important Question
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
              malesuada lacus ex, sit amet blandit leo lobortis eget. Vestibulum
              ante ipsum primis in faucibus orci luctus et ultrices posuere
              cubilia curae; Mauris viverra veniam sit amet lacus cursus.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion 
          expanded={expanded === 'panel3'} 
          onChange={handleChange('panel3')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={colors.greenAccent[500]} variant="h5">
              Your Favorite Question
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
              malesuada lacus ex, sit amet blandit leo lobortis eget. Proin
              congue erat at massa. Sed cursus turpis a purus aliquam cursus.
              Aliquam erat volutpat.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion 
          expanded={expanded === 'panel4'} 
          onChange={handleChange('panel4')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={colors.greenAccent[500]} variant="h5">
              Some Random Question
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
              malesuada lacus ex, sit amet blandit leo lobortis eget. Integer
              posuere erat a ante venenatis dapibus posuere velit aliquet.
              Cras mattis consectetur purus sit amet fermentum.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion 
          expanded={expanded === 'panel5'} 
          onChange={handleChange('panel5')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={colors.greenAccent[500]} variant="h5">
              The Final Question
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
              malesuada lacus ex, sit amet blandit leo lobortis eget. Nullam
              quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque
              penatibus et magnis dis parturient montes.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default FAQ;