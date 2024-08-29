import React from 'react';
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material';
import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignInPage() {
    return (  
        <Container maxWidth="lg" 
          sx={{
          '@media (min-width: 600px)' :{
                maxWidth: '100%',
        }
        ,
        '@media (min-width: 600px)': {
          
              paddingLeft: '24px',
              paddingRight: '24px',
          
      },
      '.css-yca69d-MuiContainer-root': {
        width: '100%',
        marginLeft: 'auto',
        boxSizing: 'border-box',
        marginRight:' auto',
        display: 'block',
        paddingLeft: '0px',
        paddingRight: '0px',
        
    }
          }}>
            <AppBar position="static" sx={{ backgroundColor: '#fff', boxShadow:'none' }}>
                <Toolbar>
                  <Typography variant="h6" style={{flexGrow: 1, color: '#8365A6', fontSize:'30px'}}>
                      Quizin
                  </Typography>
                    <Button color="inherit">
                        <Link href="/sign-in" passHref>
                            Login
                        </Link>
                    </Button>
                    <Button color="inherit">
                        <Link href="/sign-up" passHref>
                            Sign Up
                        </Link>
                    </Button>
                </Toolbar>
            </AppBar>

            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                sx={{ textAlign: 'center', my: 4 }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Sign In
                </Typography>
                <SignIn />
            </Box>
        </Container>
    );
}
