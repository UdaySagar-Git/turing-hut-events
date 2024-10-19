"use client"
import MDEditor from '@uiw/react-md-editor';


const MarkdownPreview = ({
  content
}: {
  content: string
}) => {
  return (
    <div data-color-mode="light">
      <MDEditor.Markdown source={content} />
    </div>
  )
}

export default MarkdownPreview