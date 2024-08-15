import { SignIn, SignUp } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <Container maxWidth="sm">

      <AppBar position="sticky" className="bg-blue">
        <Toolbar className="flex flex-row justify-between">
          <Typography variant="h6" className="flexGrow:1">Welcome to Ai Flash</Typography>
          <div className="flex justify-around px-5">
          <Button className="bg-blue-700 text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-4">
            <Link href = "/sign-in" passHref>
            Login
            </Link>
          </Button>
          <Button className="bg-blue-700 text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-4">
            <Link href = "/sign-up" passHref>
            Sign Up
            </Link>
          </Button>
          </div>
        </Toolbar>
      </AppBar>

      <Box className = "flex flex-col items-center justify-center  ">
        <Typography variant="h4">Sign Up</Typography>
        <SignUp />
        
      </Box>

    </Container>
  );
}
