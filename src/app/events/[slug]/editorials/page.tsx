import React from 'react'
import { getEventEditorials } from '@/actions/events';
import Link from 'next/link';

const page = async ({
  params
}: {
  params: { slug: string }
}) => {
  const editorials = await getEventEditorials(params.slug);
  return (
    <div>
      {editorials.map((editorial) => (
        <Link href={`/events/${params.slug}/editorials/${editorial.problemIndex}`}>{editorial.problemIndex}</Link>
      ))}
    </div>
  )
}

export default page