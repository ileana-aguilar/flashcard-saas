'use client'

import { useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  AppBar,
  Toolbar,
} from '@mui/material'

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

import Head from 'next/head'
import getStripe from '@/utils/get-stripe'



export default function Home() {
  const handleSubmit = async (subscriptionType) => {
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          origin: 'http://localhost:3000' 
        },
        body: JSON.stringify({ subscriptionType }), // Pass the subscription type (basic or pro)
      })
      const checkoutSessionJson = await response.json()

      if (response.status === 500) {
        console.error(checkoutSessionJson.message)
        return
      }

      const stripe = await getStripe()
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      })

      if (error) {
        console.warn(error.message)
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    }
  }

  return (
    <Container
    maxWidth="100%"
    sx={{
      backgroundColor: '#f6f7fb',
      height: '100%',
      
      '@media (min-width: 1200px)': {
        maxWidth: '100%', 
        backgroundColor: '#f6f7fb',
      },
      '@media (min-width: 600px)': {
        paddingLeft: '0px',
        paddingRight: '0px',
        backgroundColor: '#f6f7fb',
      },
      '@media (max-width: 600px)': {
          paddingLeft: '0px',
          paddingRight: '0px',
          backgroundColor: '#f6f7fb',
          maxWidth: '100%',
      },
      
    }}
  >
      <Head >
        <title>Quizin</title>
        <meta name="description" content="The easiest way to create flashcards from your text." />
      </Head>
      <AppBar position="static" sx={{ backgroundColor: '#fff', boxShadow:'none' }} >
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: 1, color: '#8365A6', fontSize:'30px'}} >
            Quizin
          </Typography>
          <SignedOut>
            <Button variant="text" sx={{ color:'#8365A6' }}  href="/sign-in">Login</Button>
            <Button variant="contained" sx={{ borderRadius: '10px', bgcolor:'#8365A6', boxShadow:'none' }} href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <Button variant="text" sx={{ color:'#8365A6' }}  href="/generate">Generate Flashcards</Button>
            <Button variant="text" sx={{ color:'#8365A6' }}  href="/flashcards"> Library</Button>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
    <Box sx={{textAlign: 'center', my: 4, margin:'0px 0px'}}>
    <Box
          display={'flex'}
          flexDirection={'row'}
          sx={{
            backgroundImage: `url('/study2.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            padding: '40px 0px',
            height: '93vh',
            
          }}
        >
          <Box sx={{ marginTop: '70px', width: '50%', position: 'relative', left: '40px', textAlign:'left',
            '@media (min-width: 2300px)': {
              marginLeft: '10em',
              marginRight: '105em',
              marginTop: '10em',
              
            }
           }}>
            <Typography variant="h2" component="h1" gutterBottom>
              Master your studies with AI-enhanced learning
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              The easiest way to create flashcards from your text.
            </Typography>
            <SignedIn>
              <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2, borderRadius: '10px', bgcolor: '#8365A6', boxShadow: 'none' }} href="/generate">
                Try it out
              </Button>
            </SignedIn>
            <SignedOut>
              <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2, borderRadius: '10px', bgcolor: '#8365A6', boxShadow: 'none' }} href="/sign-up">
                Try it out
              </Button>
            </SignedOut>
            
          </Box>
        </Box>
      
  <Box sx={{my: 6, margin:'3em' }}>
  <Typography variant="h4" component="h2" sx={{ marginBottom:'1em' }} gutterBottom>Features</Typography>
  <Grid container spacing={4} justifyContent="center">
    <Grid item xs={12} md={4}>
    {/* Feature items */}
      <Typography variant='h6'>Easy Text Input</Typography>
      <Typography>Simply input your text and let our software do the rest. Creating flashcards has never been easier.</Typography>


    </Grid>
    <Grid item xs={12} md={4}>
      <Typography variant='h6'>Smart Flashcards</Typography>
      <Typography>  Our AI intelligently breaks down your text into concise flashcards, perfect for studying.</Typography> 
    </Grid>
    <Grid item xs={12} md={4}>
      <Typography variant='h6'>Accessible Anywhere</Typography>
      <Typography> Access your flashcards from any device, at any time. Study on the go with ease</Typography> 
    </Grid>
  </Grid>
</Box>
<Box sx={{my: 6, textAlign: 'center', padding:'3em', margin:'0px'}}>
  <Typography variant="h4" component="h2" sx={{ marginBottom:'1em' }} gutterBottom>Pricing</Typography>
  <Grid container spacing={4} justifyContent="center">
    <Grid item xs={12} md={4}>
    {/* Pricing plans */}
    <Box sx={{p: 3, border: '1px solid', borderColor:'grey.300', borderRadius: 2,}}>
      <Typography variant='h5' gutterBottom>Quizin Basic</Typography>
      <Typography variant='h6' gutterBottom>$5 per month</Typography>
      <Typography>  Access to basic flashcard features and limited storage</Typography> 
      <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2, mr: 2, borderRadius: '10px', bgcolor: '#8365A6', boxShadow: 'none' }} 
              onClick={() => handleSubmit('basic')}
            >
              Try Basic
            </Button>
    </Box>
    </Grid>
    <Grid item xs={12} md={4}>
    <Box sx={{p: 3, border: '1px solid', borderColor:'grey.300', borderRadius: 2,}}>
      <Typography variant='h5' gutterBottom>Quizin Pro</Typography>
      <Typography variant='h6' gutterBottom>$10 per month</Typography>
      <Typography>  Unlimited flashcards and storage, with priority support</Typography> 
      <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2, mr: 2, borderRadius: '10px', bgcolor: '#8365A6', boxShadow: 'none' }} 
              onClick={() => handleSubmit('pro')}
            >
              Try Pro
            </Button>
    </Box>
    </Grid>
  </Grid>
  
</Box>
</Box>
</Container>
  )
}