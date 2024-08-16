'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import {collection, CollectionReference, doc, getDoc,setDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { useRouter } from "next/navigation"
import { Router } from "next/router"
import { Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material"


interface Flashcard{
    id : string
    name: string
}

export default function Flashcards(){
    const {isLoaded, isSignedIn,  user} = useUser()
    const [flashcards, setFlashcards] = useState<Flashcard[]>([])
    const router = useRouter()
    useEffect(() => {
        async function getFlashcards(){
            if (!user) return 
            const docRef = doc(collection(db,'users'), user.id)
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()){
                const collections= docSnap.data().flashcards || []
                setFlashcards(collections)
            }
            else{
                await setDoc(docRef, {flashcards:[]})
            }
        }
        getFlashcards()
    }, [user])

    // we dont want to display flashcards if user is not loggedin
    if (!isLoaded || !isSignedIn){
        return <></>
    }

    const handleCardClick= (id: String) =>{
        router.push(`/flashcard?id=${id}`)
    }

    return(
        <Container maxWidth='lg'>
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                    <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                        <CardContent>
                            <Typography variant='h6'>{flashcard.name}</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )
    }      