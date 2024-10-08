import React from 'react';
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material';
import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export const metadata = {
  title: 'Sign In',
  description: 'Sign in for Quizin',
  icons: {
    icon: '/vercel.svg',
  },
};

export default function SignInPage() {
    return (  
      <Container maxWidth="100vh" 
      sx={{
    '@media (min-width: 600px)': {
          maxWidth: '100%',
          paddingLeft: '0px',
          paddingRight: '0px',
          margin: '0px',
      
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
            <Toolbar sx={{display:'flex', justifyContent: 'space-between'}} >
                <Link href="/" passHref style={{textDecoration: 'none'}}>
                    <Typography variant="h6" style={{flexGrow: 1, color: '#8365A6', fontSize:'30px', textDecoration: 'none'}}>
                        Quizin
                    </Typography>
                </Link>
                <Box>
                    <Button variant="text" sx={{ color:'#8365A6' }}  href="/sign-in">Login</Button>
                    <Button variant="contained" sx={{ borderRadius: '10px', bgcolor:'#8365A6', boxShadow:'none' }} href="/sign-up">Sign Up</Button>
                </Box>
                   { /*<Button color="inherit">
                      
                        <Link href="/sign-in" passHref>
                            Login
                        </Link>
                    </Button>
                    <Button color="inherit">
                        <Link href="/sign-up" passHref>
                            Sign Up
                        </Link>
                        
                    </Button>
                    */}
                </Toolbar>
            </AppBar>

            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                sx={{ textAlign: 'center', my: 4, mt:10 }}
            >
                
                <SignIn afterSignInUrl="/flashcards" />
            </Box>
        </Container>
    );
}
