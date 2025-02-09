"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const Signup = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      if (response.ok) {
        alert(data.message)
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred during signup")
    }
  }

  return (
    <form onSubmit={handleSignup} className="space-y-4 w-full max-w-md">
      <div>
        <Label htmlFor="username">Username</Label>
        <Input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full">
        Sign Up
      </Button>
    </form>
  )
}

export default Signup

