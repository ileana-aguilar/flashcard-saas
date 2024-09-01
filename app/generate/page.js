'use client'

import { useUser } from "@clerk/nextjs"
import { db } from "@/firebase"
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  AppBar,
    Toolbar,
} from '@mui/material'
import { useState } from 'react'
import { writeBatch, doc, collection, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function Generate() {
  const {isLoaded, isSignedIn, user} = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.')
      return
    }
  
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: text,
      })
  
      if (!response.ok) {
        throw new Error('Failed to generate flashcards')
      }
  
      const data = await response.json()
      setFlashcards(data)
    } catch (error) {
      console.error('Error generating flashcards:', error)
      alert('An error occurred while generating flashcards. Please try again.')
    }
  }


  const handleCardClick = (id) => {
    setFlipped((prev) => ({ 
      ...prev, 
      [id]: !prev[id] 
    }))
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const saveFlashcards = async () => {
    if (!name) {
      alert('Please enter a name for your flashcard set.')
      return
    }
    const batch = writeBatch(db)
    const userDocRef = doc(collection(db, 'users'), user.id)
    const userDocSnap = await getDoc(userDocRef)

    if (userDocSnap.exists()) {
      const collections = userDocSnap.data().flashcardSets || []
      if (collections.find((f) => f.name === name)) {
        alert('A flashcard set with that name already exists.')
        return
      }else{
        collections.push({ name })
        batch.set(userDocRef, { flashcardSets: collections }, { merge: true })
      }
    }else{
      batch.set(userDocRef, { flashcardSets: [{ name }] })
    }

    const colRef = collection(userDocRef, name)
      flashcards.forEach((flashcard) => {
        const cardDocRef = doc(colRef)
        batch.set(cardDocRef, flashcard)
      })

    await batch.commit()
    handleClose()
    router.push('/flashcards')

      
}
return(
  <Container
      maxWidth="lg"
      sx={{
        backgroundColor: '#f6f7fb',
        height: flashcards.length > 0 ? '100%' : '100vh',
        
        '@media (min-width: 1200px)': {
          maxWidth: '100%',
          maxHeight: '100%', 
          backgroundColor: '#f6f7fb',
        },
        '@media (min-width: 600px)': {
          paddingLeft: '0px',
          paddingRight: '0px',
          maxWidth: '100%',
          maxHeight: '100%',
          backgroundColor: '#f6f7fb',
        },
        '@media (max-width: 600px)': {
          paddingLeft: '0px',
          paddingRight: '0px',
          maxWidth: '100%',
          maxHeight: '100%',
          backgroundColor: '#f6f7fb',
        },
        '.css-12waxkz' :{
          textAlign: 'center',
          marginTop: '0px',
          marginBottom: '0px',
          padding: '0px 0px',
          backgroundColor: '#f6f7fb',
      },
      
      
        
      }}
    >
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
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',}}>
      <Box sx={{ my: 4, maxWidth: '90em', justifyContent:'center', margin:'4em auto ' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Flashcards
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          sx={{ bgcolor:'#8365A6', boxShadow: 'none' }}
          onClick={handleSubmit}
          fullWidth
        >
          Generate Flashcards
        </Button>
      </Box>
      
      <Box>
      {/* We'll add flashcard display here */}
      {flashcards.length > 0 && (
  <Box sx={{ mt: 4 , margin: "1em 3em"}}>
    <Typography variant="h5" component="h2" gutterBottom>
      Generated Flashcards
    </Typography>
    <Grid container spacing={3}>
      {flashcards.map((flashcard, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardActionArea onClick={() => handleCardClick(index)}>
              <CardContent>
                <Box 
                  sx={{
                    perspective: '1000px',
                    '& > div' : {
                        transition: 'transform 0.5s',
                        transformStyle: 'preserve-3d',
                        position: 'relative',
                        width: '100%',
                        height: '200px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      },
                      '& > div > div' : {
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 2,
                        boxSizing: 'border-box',
                      },
                      '& > div > div:nth-of-type(2)' : {
                        transform: 'rotateY(180deg)' ,
                      },
                    }}
                  >
                  <div>
                    <div>
                      <Typography>{flashcard.front}</Typography>
                    </div>
                    <div>
                      <Typography>{flashcard.back}</Typography>
                    </div>
                  </div>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
      
    </Grid>
  </Box>
)}
{flashcards.length > 0 && (
  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', marginBottom:'7em' }}>
    <Button variant="contained" sx={{ bgcolor:'#8365A6', boxShadow: 'none' }} onClick={handleOpen}>
      Save Flashcards
    </Button>
  </Box>
)}
</Box>
</Box>
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Save Flashcard Set</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Please enter a name for your flashcard set.
    </DialogContentText>
    <TextField
      autoFocus
      margin="dense"
      label="Set Name"
      type="text"
      fullWidth
      value={name}
      onChange={(e) => setName(e.target.value)}
      variant="outlined"
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} sx={{ color:'#000000'}} >Cancel</Button>
    <Button onClick={saveFlashcards} sx={{ bgcolor:'#8365A6', color:'#FFF'}} >
      Save
    </Button>
  </DialogActions>
</Dialog>

    </Container>
)
}
