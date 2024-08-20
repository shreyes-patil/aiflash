'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDocs } from 'firebase/firestore'
import { db } from "@/firebase"
import { useSearchParams } from "next/navigation"
import { Box, Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material"
import { motion } from 'framer-motion'

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export default function Flashcard(){
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState<Flashcard[]>([])
    const [flipped, setFlipped] = useState<{ [key: string]: boolean }>({})
    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(() => {
        async function getFlashcards(){
            if (!search || !user || !db) {
                console.log("Search, user, or db not available", { search, user, db })
                return 
            }
            try {
                const colRef = collection(doc(collection(db, 'users'), user.id), search)
                console.log("Collection reference:", colRef)
                const docs = await getDocs(colRef)
                console.log("Fetched documents:", docs.size)
                const fetchedFlashcards: Flashcard[] = []
                docs.forEach((doc) => {
                    const data = doc.data() as Omit<Flashcard, 'id'>
                    console.log("Document Data:", data)
                    fetchedFlashcards.push({ ...data, id: doc.id })
                })
                console.log("Fetched Flashcards:", fetchedFlashcards)
                setFlashcards(fetchedFlashcards)
            } catch (error) {
                console.error("Error fetching flashcards:", error)
            }
        }
        getFlashcards()
    }, [user, search, db])
    
    const handleCardClick = (id: string) => {
        setFlipped((prev) => ({
          ...prev,
          [id]: !prev[id],
        }));
    };
    
    if (!isLoaded || !isSignedIn){
        return <div>Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-8">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
            >
                <h1 className="text-5xl font-bold mb-4">Flashcards</h1>
                <p className="text-xl mb-8">Click on a flashcard to flip it</p>
            </motion.div>

            <Container maxWidth="lg">
                <Grid container spacing={3} sx={{ mt: 4 }}>
                    {flashcards.length > 0 ? (
                        <Box className="mt-4 w-full">
                            <Grid container spacing={3}>
                                {flashcards.map((flashcard) => (
                                    <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 50 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8, delay: flashcards.indexOf(flashcard) * 0.1 }}
                                        >
                                            <Card className="bg-white text-gray-800 rounded-lg shadow-xl">
                                                <CardActionArea onClick={() => handleCardClick(flashcard.id)} className="border-2">
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
                                                                transform: flipped[flashcard.id]
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
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    ) : (
                        <Typography variant="h6" className="w-full text-center mt-8">No flashcards available.</Typography>
                    )}
                </Grid>
            </Container>
        </div>
    )
}
