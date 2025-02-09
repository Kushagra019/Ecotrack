"use client"

import { useState } from "react"
import Signup from "../components/Signup"
import Login from "../components/Login"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [isSignup, setIsSignup] = useState(true)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-md items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">{isSignup ? "Sign Up" : "Log In"}</h1>
        {isSignup ? <Signup /> : <Login />}
        <Button onClick={() => setIsSignup(!isSignup)} variant="link" className="mt-4 w-full">
          {isSignup ? "Already have an account? Log In" : "Need an account? Sign Up"}
        </Button>
      </div>
    </main>
  )
}

