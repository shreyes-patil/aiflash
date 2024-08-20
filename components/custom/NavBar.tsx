import { SignIn,SignedIn,SignedOut, UserButton  } from "@clerk/nextjs";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import Link from "next/link";

const NavBar = () => {
  return (
    <AppBar position="static" >
        <Toolbar className="flex justify-between" >
          <Typography variant = "h6"  className="flex-grow:1">
            <Link href="/">
              AiFlash
            </Link>
          </Typography>
          <div className="flex justify-between">
          <SignedOut >
            <Button className="text-inherit" href="/sign-in">Login</Button>
            <Button className="text-inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          </div>
          <SignedIn>
            <UserButton/>
          </SignedIn>
        </Toolbar>
      </AppBar>
  )
}

export default NavBar