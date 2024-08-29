'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import {collection, doc, getDoc, getDocs, setDoc} from "firebase/firestore"
import { db } from "@/firebase"

import { useSearchParams } from "next/navigation"
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

  import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function Flashcard() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})

    const searchParams = useSearchParams()
    const search = searchParams.get("id")
    

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user){
                console.log("User not logged in");
                return;
            }
            const colRef = collection (doc(collection(db, 'users'), user.id), search);
            const docs = await getDocs(colRef);
            console.log("docs: ", docs);
            console.log("colRef: ", colRef);
            const flashcards = []
            
            console.log("user.id: ", user.id);
            docs.forEach((doc) => {
                flashcards.push({id: doc.id, ...doc.data()});
            });
            setFlashcards(flashcards);
        }
        getFlashcard()
    }, [user, search]);
    console.log("User: ", user);

    const handleCardClick = (id) => {
        setFlipped((prev) => ({ 
          ...prev, 
          [id]: !prev[id] 
        }))
      }

      if (!isLoaded || !isSignedIn) {
        return <></>;
    }

    return (
        <Container maxWidth='100vw'>
            <AppBar position="static" sx={{ backgroundColor: '#fff', boxShadow:'none' }} >
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: 1, color: '#8365A6', fontSize:'30px'}} href="/">
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
            <h1>{search} Flashcards</h1>

            <Grid container spacing={3} sx={{mt: 4}}>
            
    
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
            
        </Container>
    )
}