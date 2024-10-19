"use client"

import React, { useState } from 'react'
import MDEditor from '@uiw/react-md-editor';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const NewEditorialPage = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const router = useRouter();
  const [problemIndex, setProblemIndex] = useState("");
  const [problemLink, setProblemLink] = useState("");
  const [content, setContent] = useState("**Hello world!!!**");

  const handleSubmit = async () => {
    const res = await axios.post(`/api/events/${slug}/editorial`, {
      problemIndex,
      problemLink,
      content
    })
    if (res.status === 200) {
      router.push(`/events/${slug}/editorial/${problemIndex}`)
    }
  }

  return (
    <div>
      <h1>New Editorial</h1>
      <div>
        <label>Problem Index</label>
        <Input type="text" value={problemIndex} onChange={(e) => setProblemIndex(e.target.value)} />
      </div>
      <div>
        <label>Problem Link</label>
        <Input type="text" value={problemLink} onChange={(e) => setProblemLink(e.target.value)} />
      </div>
      <div>
        <label>Content</label>
        <div data-color-mode="light">
          <MDEditor
            value={content}
            onChange={(newValue) => setContent(newValue || "")}
            height={500}
          />
        </div>
      </div>
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  )
}

export default NewEditorialPage
