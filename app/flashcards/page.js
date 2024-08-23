"use client";
import { useState, useEffect } from 'react';
import { Container, Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { doc, collection, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '/firebase'; // Make sure db is correctly imported

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const searchParams = useSearchParams();
    const search = searchParams.get('id');
    const router = useRouter();

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`);
    }

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

    return (
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
    );
}
