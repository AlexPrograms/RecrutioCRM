import React, { useState } from 'react';
import { Box, Typography, Avatar, Paper, useTheme, Collapse, IconButton, Tooltip, Chip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { tokens } from '../theme';

const ChatMessage = ({ message, isUser }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [sourcesExpanded, setSourcesExpanded] = useState(false);
  
  return (
    <Box 
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          maxWidth: { xs: '95%', sm: '85%', md: '75%' },
        }}
      >
        <Avatar
          sx={{
            bgcolor: isUser ? colors.blueAccent[500] : colors.greenAccent[500],
            width: 36,
            height: 36,
            ml: isUser ? 1 : 0,
            mr: isUser ? 0 : 1,
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}
        >
          {isUser ? 'U' : 'AI'}
        </Avatar>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: isUser 
              ? colors.blueAccent[700] 
              : message.isError 
                ? colors.redAccent[900] 
                : colors.primary[600],
            color: colors.grey[100],
            maxWidth: '100%',
            wordWrap: 'break-word',
          }}
        >
          <Typography 
            variant="body1" 
            sx={{
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap'
            }}
          >
            {message.content}
          </Typography>
          
          {/* Sources section */}
          {message.sources && message.sources.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  borderTop: `1px solid ${colors.grey[700]}`,
                  pt: 1,
                  mt: 1
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: colors.grey[300], 
                      fontWeight: 'bold',
                      mr: 1
                    }}
                  >
                    Sources ({message.sources.length}):
                  </Typography>
                  <Chip 
                    label={sourcesExpanded ? "Hide" : "Show"}
                    size="small"
                    variant="outlined"
                    onClick={() => setSourcesExpanded(!sourcesExpanded)}
                    sx={{ 
                      fontSize: '0.7rem',
                      height: '20px',
                      color: colors.grey[300],
                      borderColor: colors.grey[600],
                      '&:hover': {
                        backgroundColor: colors.grey[800],
                      }
                    }}
                  />
                </Box>
                <IconButton 
                  size="small" 
                  onClick={() => setSourcesExpanded(!sourcesExpanded)}
                  sx={{ color: colors.grey[400], p: 0 }}
                >
                  {sourcesExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                </IconButton>
              </Box>
              
              <Collapse in={sourcesExpanded}>
                <Box 
                  sx={{ 
                    mt: 1, 
                    pt: 1, 
                    borderTop: `1px dashed ${colors.grey[800]}`,
                    fontSize: '0.8rem' 
                  }}
                >
                  {message.sources.map((source, index) => (
                    <Paper
                      key={source.id || index}
                      elevation={1}
                      sx={{ 
                        p: 1.5, 
                        mb: 1, 
                        backgroundColor: colors.primary[700],
                        borderLeft: `3px solid ${colors.blueAccent[400]}`,
                      }}
                    >
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          color: colors.blueAccent[200],
                          fontWeight: 'bold',
                          mb: 0.5
                        }}
                      >
                        {source.title || `Source ${index+1}`}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: colors.grey[300],
                          display: 'block',
                          whiteSpace: 'pre-wrap',
                          fontSize: '0.75rem',
                          lineHeight: 1.4 
                        }}
                      >
                        {source.content || 'No content provided'}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Collapse>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatMessage;
