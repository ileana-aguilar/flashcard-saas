'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { useSearchParams } from "next/navigation"
import {
    Container,
    Button,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CardActionArea,
    AppBar,
    Toolbar,
} from '@mui/material'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})
    const [viewMode, setViewMode] = useState('grid') 
    const [currentCardIndex, setCurrentCardIndex] = useState(0)

    const searchParams = useSearchParams()
    const search = searchParams.get("id")

    useEffect(() => {
        async function getFlashcards() {
            if (!search || !user) {
                console.log("User not logged in")
                return
            }
            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colRef)
            const flashcards = []
            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() })
            })
            setFlashcards(flashcards)
        }
        getFlashcards()
    }, [user, search])

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const handleNextCard = () => {
        setCurrentCardIndex((prev) => (prev + 1) % flashcards.length)
    }

    const handlePreviousCard = () => {
        setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
    }

    const handleViewModeChange = (mode) => {
        setViewMode(mode)
    }

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    return (
        <Container maxWidth='100vw' 
            sx={{
                backgroundColor: '#f6f7fb',
                height: viewMode === 'grid' ? '100%' : '100vh',
                '@media (min-width: 1200px)': {
                    maxWidth: '100%',
                    backgroundColor: '#f6f7fb',
                },
                '@media (min-width: 600px)': {
                    paddingLeft: '0px',
                    paddingRight: '0px',
                    backgroundColor: '#f6f7fb',
                    maxWidth: '100%',
                },
                '@media (max-width: 600px)': {
                    paddingLeft: '0px',
                    paddingRight: '0px',
                    backgroundColor: '#f6f7fb',
                    maxWidth: '100%',
                },
                
            }}
        >
            <AppBar position="static" sx={{ backgroundColor: '#fff', boxShadow: 'none' }}>
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1, color: '#8365A6', fontSize: '30px' }} href="/">
                        Quizin
                    </Typography>
                    <SignedOut>
                        <Button variant="text" sx={{ color: '#8365A6' }} href="/sign-in">Login</Button>
                        <Button variant="contained" sx={{ borderRadius: '10px', bgcolor: '#8365A6', boxShadow: 'none' }} href="/sign-up">Sign Up</Button>
                    </SignedOut>
                    <SignedIn>
                        <Button variant="text" sx={{ color: '#8365A6' }} href="/generate">Generate Flashcards</Button>
                        <Button variant="text" sx={{ color: '#8365A6' }} href="/flashcards"> Library</Button>
                        <UserButton />
                    </SignedIn>
                </Toolbar>
            </AppBar>
            <Box sx={{ padding: '2em' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h1>{search} Flashcards</h1>
                    <Box sx={{ display: 'flex', gap: '1em' }}>
                        <Button variant="contained" sx={{ borderRadius: '10px', bgcolor: '#8365A6', boxShadow: 'none' }} onClick={() => handleViewModeChange('grid')}>Grid View</Button>
                        <Button variant="contained" sx={{ borderRadius: '10px', bgcolor: '#8365A6', boxShadow: 'none' }} onClick={() => handleViewModeChange('card')}>Card View</Button>
                    </Box>
                </Box>
                {viewMode === 'grid' ? (
                    <Grid container spacing={3} sx={{ mt: 4 }}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardActionArea onClick={() => handleCardClick(index)}>
                                        <CardContent>
                                            <Box
                                                sx={{
                                                    perspective: '1000px',
                                                    '& > div': {
                                                        transition: 'transform 0.5s',
                                                        transformStyle: 'preserve-3d',
                                                        position: 'relative',
                                                        width: '100%',
                                                        height: '200px',
                                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                                        transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                    },
                                                    '& > div > div': {
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
                                                    '& > div > div:nth-of-type(2)': {
                                                        transform: 'rotateY(180deg)',
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
                ) : (
                    flashcards.length > 0 && (
                        <Box sx={{  display:'flex', justifyContent: "center", alignItems: "center", height:' 90vh', width:'100%',margin:'0px 0px'}}>
                        <Box sx={{ mt: 4, textAlign: 'center', display:'flex', flexDirection:'column' , width:'100%'}}>
                            
                            <Grid container alignItems="center" justifyContent="center" maxWidth= '55em' margin='auto'>
                                <Grid item xs={2} sx={{ textAlign: 'right' }}>
                                    <Button variant="contained" sx={{ borderRadius: '10px', bgcolor: '#8365A6', boxShadow: 'none' }} onClick={handlePreviousCard}>Back</Button>
                                </Grid>
                                <Grid item xs={8}>
                                <Card >
                                        <CardActionArea onClick={() => handleCardClick(currentCardIndex)}>
                                            <CardContent>
                                                <Box
                                                    sx={{
                                                        perspective: '1000px',
                                                        '& > div': {
                                                            transition: 'transform 0.5s',
                                                            transformStyle: 'preserve-3d',
                                                            position: 'relative',
                                                            width: '100%',
                                                            height: '200px',
                                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                                            transform: flipped[currentCardIndex] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                        },
                                                        '& > div > div': {
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
                                                        '& > div > div:nth-of-type(2)': {
                                                            transform: 'rotateY(180deg)',
                                                        },
                                                    }}
                                                >
                                                    <div>
                                                        <div>
                                                            <Typography>{flashcards[currentCardIndex].front}</Typography>
                                                        </div>
                                                        <div>
                                                            <Typography>{flashcards[currentCardIndex].back}</Typography>
                                                        </div>
                                                    </div>
                                                </Box>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                                <Grid item xs={2} sx={{ textAlign: 'left' }}>
                                    <Button variant="contained" sx={{ borderRadius: '10px', bgcolor: '#8365A6', boxShadow: 'none' }} onClick={handleNextCard}>Next</Button>
                                </Grid>
                            </Grid>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                {currentCardIndex + 1} / {flashcards.length}
                            </Typography>
                        </Box>
                        </Box>
                    )
                )}
            </Box>
        </Container>
    )
}
