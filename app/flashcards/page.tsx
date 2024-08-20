'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';
import { Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material";

interface Flashcard {
  id: string;
  name: string;
}

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;
      const docRef = doc(collection(db, 'users'), user.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data());
        const collections = docSnap.data().flashcards || [];
        console.log(JSON.stringify(collections));
        setFlashcards(collections);
      } else {
        await setDoc(docRef, { flashcards: [] });
      }
    }
    getFlashcards();
  }, [user]);

  // We don't want to display flashcards if the user is not logged in
  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  const handleCardClick = (id: string) => {
    router.push(`/flashcard?id=${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-bold mb-4">Your Flashcards</h1>
        <p className="text-xl mb-8">Click on a flashcard to view its details</p>
      </motion.div>

      <Container maxWidth="lg">
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="bg-white text-gray-800 rounded-lg shadow-xl">
                  <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                    <CardContent>
                      <Typography variant="h6" className="font-bold">
                        {flashcard.name}
                      </Typography>
                      {/* <Typography variant="h6" className="font-bold">
                        Id: {JSON.stringify(flashcard)}
                      </Typography> */}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
