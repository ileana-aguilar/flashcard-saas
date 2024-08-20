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
  SignedIn,
  SignedOut,
  UserButton,
} from '@mui/material'

export default function Generate() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })
    const checkoutSessionJson = await checkoutSession.json()
  
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
  
    if (error) {
      console.warn(error.message)
    }
  }
  return (
    
    <Box sx={{textAlign: 'center', my: 4}}>
      
  <Typography variant="h2" component="h1" gutterBottom>
    Welcome to Flashcard SaaS
  </Typography>
  <Typography variant="h5" component="h2" gutterBottom>
    The easiest way to create flashcards from your text.
  </Typography>
  <Button variant="contained" color="primary" sx={{mt: 2, mr: 2}} href="/generate">
    Get Started
  </Button>
  <Button variant="outlined" color="primary" sx={{mt: 2}}>
    Learn More
  </Button>
  <Box sx={{my: 6}}>
  <Typography variant="h4" component="h2" gutterBottom>Features</Typography>
  <Grid container spacing={4}>
    {/* Feature items */}
  </Grid>
</Box>
<Box sx={{my: 6, textAlign: 'center'}}>
  <Typography variant="h4" component="h2" gutterBottom>Pricing</Typography>
  <Grid container spacing={4} justifyContent="center">
    {/* Pricing plans */}
  </Grid>
</Box>
</Box>
  )
}