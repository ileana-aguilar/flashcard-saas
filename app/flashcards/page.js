"use client";
import { useState, useEffect } from 'react';
import { Box, Container, Grid, Card, CardActionArea, CardContent, Typography,  AppBar,
    Toolbar, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField  } from '@mui/material';
import { doc, collection, getDoc, getDocs, setDoc,  updateDoc, deleteDoc } from 'firebase/firestore';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

import { db } from '/firebase'; 

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Head from 'next/head';  


export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [currentIndex, setCurrentIndex] = useState(null);


   
    const handleClickOpen = (index) => {
        if (index >= 0 && index < flashcards.length) {
            setCurrentIndex(index);
            setNewName(flashcards[index].name || ''); 
            setOpen(true);
        } else {
            console.error('Invalid flashcard set index');
        }
    };

    
    const handleClose = () => {
        setOpen(false);
    };

   
    const updateFlashcardSetName = async () => {
        if (currentIndex !== null && newName.trim() !== '') {
            const docRef = doc(collection(db, 'users'), user.id);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const flashcardSets = docSnap.data().flashcardSets || [];
                const oldName = flashcardSets[currentIndex].name;
                const newCollectionName = newName.trim();
                
                if (oldName !== newCollectionName) {
                    
                    const oldCollectionRef = collection(docRef, oldName);
                    const newCollectionRef = collection(docRef, newCollectionName);
                    const snapshot = await getDocs(oldCollectionRef);
                    
                
                    for (const document of snapshot.docs) {
                        const newDocRef = doc(newCollectionRef, document.id);
                        await setDoc(newDocRef, document.data());
                    }
                    
                    
                    for (const document of snapshot.docs) {
                        await deleteDoc(document.ref);
                    }
                    
                   
                    flashcardSets[currentIndex].name = newCollectionName;
                    await updateDoc(docRef, { flashcardSets });
    
                    
                    setFlashcards(flashcardSets);
                }
            }
            handleClose();
        }
    };
    

    
    const deleteFlashcardSet = async (index) => {
        if (user) {
            const docRef = doc(collection(db, 'users'), user.id);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                const flashcardSets = docSnap.data().flashcardSets || [];
                
                if (index >= 0 && index < flashcardSets.length) {
                    const flashcardSetName = flashcardSets[index]?.name;
    
                    if (flashcardSetName) {
                        const updatedFlashcards = flashcards.filter((_, i) => i !== index);
    
                        
                        await updateDoc(docRef, { flashcardSets: updatedFlashcards });
    
                        
                        const flashcardSetRef = collection(docRef, flashcardSetName);
                        const querySnapshot = await getDocs(flashcardSetRef);
    
                        
                        querySnapshot.forEach(async (doc) => {
                            await deleteDoc(doc.ref);
                        });
    
                        
                        setFlashcards(updatedFlashcards);
                    } else {
                        console.error('Invalid flashcard set name');
                    }
                } else {
                    console.error('Invalid index or flashcard set not found');
                }
            } else {
                console.error('User document does not exist');
            }
        }
    };
    
      
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


    if (!isLoaded || !isSignedIn) {
        return <></>;
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${encodeURIComponent(id)}`);
    }

    return (
        <Container
      maxWidth="100%"
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
        '@media (max-width: 600px)': {
            paddingLeft: '0px',
            paddingRight: '0px',
            backgroundColor: '#f6f7fb',
            maxWidth: '100%',
        },
        
      }}
    >
          <Head>
                <title>Quizin | Library</title>
            </Head>
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
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, textAlign: 'left', marginLeft:'2em' }}>Library</Typography>
            <Grid container spacing={3} sx={{ mt: 4, marginLeft: '2em',}}>
                {flashcards.length > 0 ? (
                    flashcards.map((flashcard, index) => (
                        <Grid item xs={5} sm={4} md={4} lg={3} key={index}>
                            <Card>
                                <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {flashcard.name}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <Button sx={{color:'#8365A6'}} onClick={() => handleClickOpen(index)}>
                                    Edit Name
                                </Button>
                                <Button sx={{color:'#8365A6'}} onClick={() => deleteFlashcardSet(index)}>
                                    Delete
                                </Button>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Box sx={{ marginLeft:'2em', marginRigt:'2em',
                    '@media (max-width: 600px)': {
                        
                        maxWidth: '27em',
                    },
                    '@media (min-width: 601px)': {
                        
                        maxWidth: '50em',
                    },
                    '@media (max-width: 888px)': {
                        
                        maxWidth: '45em',
                    },
                    '@media (max-width: 832px)': {
                        
                        maxWidth: '40em',
                    },
                    '@media (max-width: 742px)': {
                        
                        maxWidth: '37em',
                    },
                    '@media (max-width: 677px)': {
                        
                        maxWidth: '35em',
                    },
                    '@media (max-width: 515px)': {
                        
                        maxWidth: '25em',
                    },
                    '@media (min-width: 1100px)': {
                        
                        maxWidth: '70em',
                    },

                      }}>
                    <Typography variant="h6" sx={{ mt: 2}}>
                        You have no flashcard sets. Click on the "Generate Flashcards" button to create a new set.
                    </Typography>
                    
                    <Button variant="contained" sx={{ borderRadius: '10px', bgcolor:'#8365A6', boxShadow:'none', marginTop:'2em' }} href="/generate">Generate Flashcards</Button>
                    </Box>
                )}
            </Grid>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Flashcard Set Name</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a new name for your flashcard set.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Set Name"
                        type="text"
                        fullWidth
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{ color: '#000000' }}>Cancel</Button>
                    <Button onClick={updateFlashcardSetName} sx={{ bgcolor: '#8365A6', color: '#FFF' }}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
        
    );
    
}
