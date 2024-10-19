'use client'

import React, { useState } from 'react'
import MDEditor from '@uiw/react-md-editor'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { PenLine } from 'lucide-react'

export default function NewEditorialPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const router = useRouter()
  const { toast } = useToast()
  const [problemIndex, setProblemIndex] = useState("")
  const [problemLink, setProblemLink] = useState("")
  const [content, setContent] = useState("**Hello world!!!**")

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`/api/events/${slug}/editorials`, {
        problemIndex,
        problemLink,
        content
      })
      if (res.status === 200) {
        toast({
          title: "Editorial Created",
          description: "Your new editorial has been successfully created.",
        })
        router.push(`/events/${slug}/editorials/${problemIndex}`)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating the editorial. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="px-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <PenLine className="h-6 w-6" />
            Create New Editorial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="problemIndex">Problem Index</Label>
            <Input
              id="problemIndex"
              placeholder="e.g., A, B, C, or 1, 2, 3"
              value={problemIndex}
              onChange={(e) => setProblemIndex(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="problemLink">Problem Link</Label>
            <Input
              id="problemLink"
              placeholder="https://codeforces.com/problem"
              value={problemLink}
              onChange={(e) => setProblemLink(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <div data-color-mode="light" className="border rounded-md overflow-hidden">
              <MDEditor
                value={content}
                onChange={(newValue) => setContent(newValue || "")}
                height={400}
                preview="edit"
              />
            </div>
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Create Editorial
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}