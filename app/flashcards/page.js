"use client";
import { useState, useEffect } from 'react';
import { Container, Grid, Card, CardActionArea, CardContent, Typography,  AppBar,
    Toolbar, Button } from '@mui/material';
import { doc, collection, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

import { db } from '/firebase'; 

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'


export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const router = useRouter();
    

    useEffect(() => {
        async function getFlashcards() {
            if (!user){
                console.log("User not logged in");
                return;
            }
            const docRef = doc(collection(db, 'users'), user.id);
            const docSnap = await getDoc(docRef);
            console.log("DocSnap: ", docSnap);
            console.log("DocRef: ", docRef);
            
            console.log("user.id: ", user.id);
            if (docSnap.exists()) {
                const collections = docSnap.data().flashcardSets || []
                console.log("Flashcards found: ", collections);
                setFlashcards(collections);
            } else {
                await setDoc(docRef, { flashcardSets: [] });
                console.log("No flashcards found, created empty collection");
            }
        }
        getFlashcards()
    }, [user]);
    console.log("User: ", user);
/*
    useEffect(() => {
        async function getFlashcards() {
            if (!user) {
                console.log("User not logged in");
                return;
            }
            try {
                const docRef = doc(collection(db, 'users'), user.id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const collections = docSnap.data().flashcards || [];
                    setFlashcards(collections);
                } else {
                    await setDoc(docRef, { flashcards: [] });
                    console.log("No flashcards found, created empty collection");
                }
            } catch (error) {
                console.error("Error fetching flashcards: ", error);
            }
        }
        getFlashcards();
    }, [user]);

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) {
                console.log("No search query or user not logged in");
                return;
            }
            try {
                const colRef = collection(doc(collection(db, 'users'), user.id), search);
                const docs = await getDocs(colRef);
                const flashcards = [];
                docs.forEach((doc) => {
                    flashcards.push({ id: doc.id, ...doc.data() });
                });
                setFlashcards(flashcards);
            } catch (error) {
                console.error("Error fetching specific flashcard: ", error);
            }
        }
        getFlashcard();
    }, [search, user]);
    */

    if (!isLoaded || !isSignedIn) {
        return <></>;
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${encodeURIComponent(id)}`);
    }

    return (
        <Container
      maxWidth="lg"
      sx={{
        backgroundColor: '#f6f7fb',
        height: '100vh',
        
        '@media (min-width: 1200px)': {
          maxWidth: '100%', 
          backgroundColor: '#f6f7fb',
        },
        '@media (min-width: 600px)': {
          paddingLeft: '0px',
          paddingRight: '0px',
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
            <Grid container spacing={3} sx={{ mt: 4, marginLeft: '2em',}}>
                {flashcards.length > 0 ? (
                    flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {flashcard.name}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        No flashcards available.
                    </Typography>
                )}
            </Grid>
        </Container>
        /*
        <Container maxWidth="md">
        <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcards.length > 0 ? (
                flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {flashcard.name}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))
            ) : (
                <Typography variant="h6" sx={{ mt: 2 }}>
                    No flashcards available.
                </Typography>
            )}
        </Grid>
    </Container>
    */
    );
    
}
