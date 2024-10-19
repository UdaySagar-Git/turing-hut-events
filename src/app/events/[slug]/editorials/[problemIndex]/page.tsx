import React from 'react'
import { getEditorial } from '@/actions/events';
import MarkdownPreview from './MarkdownPreview';

const page = async ({
  params
}: {
  params: { slug: string, problemIndex: string }
}) => {
  const { slug, problemIndex } = params;

  const editorial = await getEditorial(slug, problemIndex);
  return (
    <div>
      <span>Link : <a href={editorial?.problemLink || ""} target='_blank'>{editorial?.problemLink}</a></span>
      <MarkdownPreview content={editorial?.content || ""} />
    </div>
  )
}

export default page