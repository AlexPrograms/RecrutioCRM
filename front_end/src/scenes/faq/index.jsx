import { Box, useTheme, IconButton, CircularProgress, Fade, Typography, Container, Paper } from "@mui/material";
import Header from "../../components/header";
import { tokens } from "../../theme";
import { useState, useRef, useEffect } from "react";
import SendIcon from '@mui/icons-material/Send';
import ChatMessage from "../../components/ChatMessage";
import { ragApi } from "../../utils/api";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [inputFocused, setInputFocused] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage = {
      id: Date.now(),
      content: trimmedInput,
      isUser: true,
      timestamp: new Date(),
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      console.log('Sending query to RAG API:', trimmedInput);
      const accessToken = localStorage.getItem('access_token');
      console.log('Auth status:', accessToken ? 'Authenticated' : 'Not authenticated');
      
      // Check if user is authenticated
      if (!accessToken) {
        throw new Error('Authentication required. Please log in to use the AI assistant.');
      }
      
      // Call RAG API
      const response = await ragApi.query(trimmedInput);
      console.log('RAG API response:', response);
      
      if (!response) {
        throw new Error('No response from server');
      }
      
      // Format sources if they exist
      let formattedSources = [];
      if (response.sources && Array.isArray(response.sources)) {
        formattedSources = response.sources.map(source => ({
          id: source.id || `source-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: source.title || 'Data Source',
          content: source.content || 'No content available',
        }));
      }
      
      // Add AI response to chat
      setMessages(prev => [
        ...prev, 
        {
          id: Date.now() + 1,
          content: response.answer || 'I processed your question but found no specific answer.',
          isUser: false,
          timestamp: new Date(),
          sources: formattedSources
        }
      ]);
    } catch (error) {
      console.error('AI Assistant API Error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage;
      
      // Handle different error types
      if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again to continue.';
        // Redirect to login after short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else if (error.response?.data?.error) {
        errorMessage = `Error: ${error.response.data.error}`;
      } else if (error.message) {
        errorMessage = `${error.message}`;
      } else {
        errorMessage = 'Sorry, I encountered an error while processing your request. Please try again later.';
      }
      
      setMessages(prev => [
        ...prev, 
        {
          id: Date.now() + 1,
          content: errorMessage,
          isUser: false,
          timestamp: new Date(),
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  return (
    <Container maxWidth="xl" disableGutters>
      <Box 
        sx={{ 
          height: 'calc(100vh - 120px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          p: { xs: '10px', sm: '20px' },
          boxSizing: 'border-box',
        }}
      >
      <Box sx={{ flexShrink: 0, mb: 1 }}>
        <Header title="AI Assistant" subtitle="Ask me anything about your company" />
      </Box>

      {/* Chat Messages */}
      <Box 
        sx={{
          flex: '1 1 auto',
          overflowY: 'auto',
          mb: 2,
          p: 1,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: colors.primary[400],
            borderRadius: '3px',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {messages.map((message) => (
            <Fade in={true} key={message.id} timeout={300}>
              <div>
                <ChatMessage message={message} isUser={message.isUser} />
              </div>
            </Fade>
          ))}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', pl: 8, pr: 2 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: colors.primary[600],
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <CircularProgress size={16} thickness={5} style={{ color: colors.grey[100] }} />
                <Typography variant="body2" sx={{ color: colors.grey[200] }}>
                  Thinking...
                </Typography>
              </Box>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>
      </Box>

      {/* Input Area */}
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '900px',
          mx: 'auto',
          mb: 1,
          transition: 'all 0.3s ease',
          opacity: inputFocused ? 1 : 0.9,
          '&:hover': {
            opacity: 1,
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: colors.primary[400],
            borderRadius: '24px',
            boxShadow: 3,
            px: 2,
            py: 1,
            transition: 'all 0.2s',
            border: `1px solid ${inputFocused ? colors.blueAccent[500] : 'transparent'}`,
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder="Ask me anything..."
            disabled={isLoading}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              color: colors.grey[100],
              fontSize: '1rem',
              padding: '10px 0',
              outline: 'none',
              resize: 'none',
              fontFamily: 'inherit',
              minHeight: '24px',
              maxHeight: '200px',
              overflowY: 'auto',
            }}
          />
          <IconButton
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            sx={{
              color: colors.grey[100],
              backgroundColor: inputValue.trim() ? colors.greenAccent[600] : colors.grey[700],
              '&:hover': {
                backgroundColor: inputValue.trim() ? colors.greenAccent[700] : colors.grey[600],
              },
              '&:disabled': {
                backgroundColor: colors.grey[800],
                color: colors.grey[600],
              },
              transition: 'all 0.2s',
              ml: 1,
              width: '40px',
              height: '40px',
            }}
          >
            {isLoading ? (
              <CircularProgress size={20} />
            ) : (
              <SendIcon />
            )}
          </IconButton>
        </Box>
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            textAlign: 'center', 
            mt: 1, 
            color: colors.grey[500],
            fontSize: '0.75rem',
          }}
        >
          Press Enter to send • Shift+Enter for new line
        </Typography>
      </Box>
      </Box>
    </Container>
  );
};

export default FAQ;