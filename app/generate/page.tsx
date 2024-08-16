'use client'

import { db } from "@/firebase"
import { useUser } from "@clerk/nextjs"
import { Box, Button, Card, CardActionArea, CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, TextField, Typography } from "@mui/material"
import { collection, doc, getDoc, writeBatch } from "firebase/firestore"
import { useRouter } from "next/navigation"
import OpenAI from "openai"
import { useLayoutEffect, useState } from "react"

interface Flashcard {
  name: String
  front: String
  back: String
}

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [flipped, setFlipped] = useState<{ [key: number]: boolean }>([])
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)
  const router = useRouter()

  
  // Post the text to api and parse the response from api, set flashcards with data
  const handleSubmit = async () => {
    setLoading(true);
    try {

      const res = await fetch('api/generate', {
        method: 'POST',
        body: text,
      });

      const data = await res.json();
      setFlashcards(data);
      setFlipped(new Array(data.length).fill(false));

    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }

  };

  // toggle flip state for given id
  const handleCardClick = (id: number) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // save flashcards to firestore
  const saveFlashcards = async () => {
    if (!name) {
      alert('please enter your name')
      return
    }
    const batch = writeBatch(db)
    const userDocRef = doc(collection(db, 'users'), user?.id)
    const docSnap = await getDoc(userDocRef)

    // check if user has documents, if yes search if same name flashcard exists
    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || []
      if (collections.find((f: Flashcard) => f.name === name)) {
        alert('Flashcard already exists')
        return
      }
      else {
        collections.push({ name })
        batch.set(userDocRef, { flashcards: collections }, { merge: true })
      }
    }
    else {
      batch.set(userDocRef, { flashcards: [{ name }] })
    }

    // reference to subcollections for storing individual flashcard documents
    const colRef = collection(userDocRef, name)
    flashcards.forEach((flashcard) => {
      // create reference to each flashcard doc
      const cardDocRef = doc(colRef)
      // add flashacard to the batch
      batch.set(cardDocRef, flashcard)

    })
    await batch.commit()
    handleClose
    router.push('/flashcards')
  }

  useLayoutEffect(() => {
    if (!isSignedIn && isLoaded) {
      router.push('/sign-in')
    }
  })


  return (
    <Container maxWidth="md">
      <Box className="mt-4 mb-6 flex flex-col items-center">
        <Typography variant="h4">Generate Flashcards</Typography>
        <Box className="w-full grid grid-cols-3 ">
          <Paper className=" col-span-2">
            <TextField value={text} onChange={(e) => setText(e.target.value)} label="Enter Text" className="w-full" multiline rows={1} variant="outlined" />
          </Paper>
          <Box className="flex justify-center items-center">
            <Button variant="contained" className=" text-white font-medium rounded-lg text-sm px-5 py-2.5 mt-4" onClick={handleSubmit}>Submit</Button>
          </Box>
        </Box>
      </Box>

      {
        loading ? (
          <div>Loading...</div>
        ) :
          (
            <>
              {flashcards.length > 0 ? (
                <Box className="mt-4">
                  <Typography variant="h5">Flashcards</Typography>
                  <Grid className="grid gap-3  grid-cols-1 md:grid-cols-3 ">
                    {flashcards.map((flashcard, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                          <CardActionArea onClick={() => handleCardClick(index)} className="border-2">
                            <CardContent>
                              <Box sx={{
                                perspective: '1000px',
                                '&> div': {
                                  transition: 'transform 0.6s',
                                  transformStyle: 'preserve-3d',
                                  position: 'relative',
                                  width: '100%',
                                  height: '200px',
                                  boxShadow: 'inherit',
                                  transform: flipped[index]
                                    ? 'rotateY(180deg)'
                                    : 'rotateY(0deg)'

                                },
                                '&> div > div': {
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
                                '&> div > div:nth-of-type(2)': {
                                  transform: 'rotateY(180deg)'
                                }
                              }}><div>
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
                    )

                    )}
                  </Grid>
                  <Box className="mt-4 flex justify-center ">
                    <Button className="bg-blue-700 text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-4" onClick={handleOpen}>Save</Button>

                  </Box>
                </Box>
              ) :
                (
                  <div>No flashcards to display</div>
                )

              }
            </>
          )
      }



      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save flashcards!</DialogTitle>
        <DialogContent>
          <DialogContentText>Name your flashcard!</DialogContentText>
          <TextField autoFocus margin="dense" label="collection name" type="text" fullWidth value={name} onChange={(e) => setName(e.target.value)} variant="outlined" />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveFlashcards}>Save</Button>

        </DialogActions>
      </Dialog>
    </Container>

  )
}