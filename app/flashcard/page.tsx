'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDocs } from 'firebase/firestore'
import { db } from "@/firebase"
import { useSearchParams } from "next/navigation"
import { Box, Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material"

interface Flashcard {
  id: string;
  front: string;
  back: string;
  name: string;  
}

export default function Flashcard(){
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState<Flashcard[]>([])
    const [flipped, setFlipped] = useState<{ [key: string]: boolean }>({})
    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(() => {
        async function getFlashcards(){
            if (!search || !user) return 
            try {
                const colRef = collection(doc(collection(db, 'users'), user.id), search)
                const docs = await getDocs(colRef)
                const fetchedFlashcards: Flashcard[] = []
                docs.forEach((doc) => {
                    const data = doc.data()
                    console.log("Document Data:", data)
                    fetchedFlashcards.push({ id: doc.id, ...data } as Flashcard)
                })
                console.log("Fetched Flashcards:", fetchedFlashcards)
                setFlashcards(fetchedFlashcards)
            } catch (error) {
                console.error("Error fetching flashcards:", error)
            }
        }
        getFlashcards()
    }, [user, search])
    
    const handleCardClick = (name: string) => {
        setFlipped((prev) => ({
          ...prev,
          [name]: !prev[name],
        }));
    };
    
    if (!isLoaded || !isSignedIn){
        return <></>
    }

    return (
        <Container maxWidth="lg">
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.length > 0 ? (
                    <Box className="mt-4">
                        <Typography variant="h5">Flashcards</Typography>
                        <Grid container spacing={3}>
                            {flashcards.map((flashcard, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card>
                                        <CardActionArea onClick={() => handleCardClick(flashcard.name)} className="border-2">
                                            <CardContent>
                                                <Box sx={{
                                                    perspective: '1000px',
                                                    '& > div': {
                                                        transition: 'transform 0.6s',
                                                        transformStyle: 'preserve-3d',
                                                        position: 'relative',
                                                        width: '100%',
                                                        height: '200px',
                                                        boxShadow: 'inherit',
                                                        transform: flipped[flashcard.name]
                                                            ? 'rotateY(180deg)'
                                                            : 'rotateY(0deg)'

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
                                                        boxSizing: 'border-box'

                                                    },
                                                    '& > div > div:nth-of-type(2)': {
                                                        transform: 'rotateY(180deg)'
                                                    }
                                                }}>
                                                    <div>
                                                        <div>
                                                            <Typography variant="h5" component="div">{flashcard.front}</Typography>
                                                        </div>
                                                        <div>
                                                            <Typography variant="h5" component="div">{flashcard.back}</Typography>
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
                ) : (
                    <Typography>No flashcards available.</Typography>
                )}
            </Grid>
        </Container>
    )
}
