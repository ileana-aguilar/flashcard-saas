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

} from '@mui/material'
import { useState } from 'react'
import { writeBatch, doc, collection, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'


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
  <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
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
      
      {/* We'll add flashcard display here */}
      {flashcards.length > 0 && (
  <Box sx={{ mt: 4 }}>
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
  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
    <Button variant="contained" color="primary" onClick={handleOpen}>
      Save Flashcards
    </Button>
  </Box>
)}
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Save Flashcard Set</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Please enter a name for your flashcard set.
    </DialogContentText>
    <TextField
      autoFocus
      margin="dense"
      label="Collection Name"
      type="text"
      fullWidth
      value={name}
      onChange={(e) => setName(e.target.value)}
      variant="outlined"
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button onClick={saveFlashcards} color="primary">
      Save
    </Button>
  </DialogActions>
</Dialog>

    </Container>
)
}
