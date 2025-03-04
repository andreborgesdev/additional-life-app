"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

export default function UserSettingsPage() {
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john.doe@example.com")
  const [bio, setBio] = useState("I love sharing and reusing items to help the environment!")
  const [notifications, setNotifications] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send this data to your backend
    console.log("Settings updated:", { name, email, bio, notifications })
    toast({
      title: "Settings updated",
      description: "Your user settings have been saved successfully.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
          <Label htmlFor="notifications">Receive email notifications</Label>
        </div>
        <Button type="submit">Save Settings</Button>
      </form>
    </div>
  )
}

