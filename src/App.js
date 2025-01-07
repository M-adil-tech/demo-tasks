import React from 'react';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import StreamingTask from './components/Streaming_task'
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import theme from './theme';
import SocialFeed from './components/SocialFeed';
function App() {
  
    return (
      <ThemeProvider theme={theme}>
        <Router>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                Demo Tasks
              </Typography>
              <Button color="inherit" component={Link} to="/">
              Streaming Task 
              </Button>
              <Button color="inherit" component={Link} to="/social-feed">
                 Social Feed
              </Button>
            </Toolbar>
          </AppBar>
          <Container style={{ marginTop: '20px' }}>
            <Routes>
              <Route path="/" element={<StreamingTask/>} />
              <Route path="/social-feed" element={<SocialFeed/>} />
            </Routes>
          </Container>
        </Router>
      </ThemeProvider>
    );

}

export default App;