'use client'

import React, { useState } from 'react'
import MDEditor from '@uiw/react-md-editor'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { PenLine } from 'lucide-react'
import { getCodeString } from 'rehype-rewrite';
import katex from "katex";
import 'katex/dist/katex.css';

export default function NewEditorialPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const router = useRouter()
  const [problemIndex, setProblemIndex] = useState("")
  const [problemLink, setProblemLink] = useState("")

  const initialContent = `This is to display the 
\`\$\$\c = \\pm\\sqrt{a^2 + b^2}\$\$\`
 in one line

\`\`\`KaTeX
c = \\pm\\sqrt{a^2 + b^2}
\`\`\`
`;

  const [content, setContent] = useState(initialContent)

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`/api/events/${slug}/editorial`, {
        problemIndex,
        problemLink,
        content
      })
      if (res.status === 200) {
        toast.success("Editorial Created")
        router.push(`/events/${slug}/editorials/${problemIndex}`)
      }
    } catch {
      toast.error("Error creating editorial. Please try again.")
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
                previewOptions={{
                  components: {
                    code: ({ children = [], className, ...props }) => {
                      if (typeof children === 'string' && /^\$\$(.*)\$\$/.test(children)) {
                        const html = katex.renderToString(children.replace(/^\$\$(.*)\$\$/, '$1'), {
                          throwOnError: false,
                        });
                        return <code dangerouslySetInnerHTML={{ __html: html }} style={{ background: 'transparent' }} />;
                      }
                      const code = props.node && props.node.children ? getCodeString(props.node.children) : children;
                      if (
                        typeof code === 'string' &&
                        typeof className === 'string' &&
                        /^language-katex/.test(className.toLocaleLowerCase())
                      ) {
                        const html = katex.renderToString(code, {
                          throwOnError: false,
                        });
                        return <code style={{ fontSize: '150%' }} dangerouslySetInnerHTML={{ __html: html }} />;
                      }
                      return <code className={String(className)}>{children}</code>;
                    },
                  },
                }}
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