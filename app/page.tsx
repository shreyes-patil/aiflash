import Image from "next/image";
import getStripe from '@/utils/get-stripe'
import { SignIn,SignedIn,SignedOut, UserButton  } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import Head from "next/head";

export default function Home() {
  return (
    <Container maxWidth = "xl" >
      <Head>
        <title>AiFlash</title>
        <meta name = "description" content="generate flashcards with AI"/>
      </Head>

      <AppBar position="static" >
        <Toolbar className="flex justify-between" >
          <Typography variant = "h6"  className="flex-grow:1">AiFlash</Typography>
          <div className="flex justify-between">
          <SignedOut >
            <Button className="text-inherit">Login</Button>
            <Button className="text-inherit">Sign Up</Button>
          </SignedOut>
          </div>
          <SignedIn>
            <UserButton/>
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box className="text-center">
        <Typography variant="h2"> Welcome to AIFlash</Typography>
        <Typography variant="h5"> Generate Flash cards with AI</Typography>

        <Button className="bg-blue-700 text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-4">
          Get Started
        </Button>

      </Box>

    </Container>

   
  );
}
