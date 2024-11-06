import { getProblemsData } from '@/actions/events';
import React from 'react'

async function Page({ params:{slug}}: { params: { slug: string } }) {

  const problemsData= await getProblemsData(slug);
  // const problemNames = problemsData?.editorials?.map((problem)=>problem.content.split("\n\n")[0].slice(2).slice(0,-1))

  return (
    <div>
      {/* {JSON.stringify(problemsData?.editorials[0].problemLink)}
      {JSON.stringify(problemsData?.editorials[0].problemLink)} */}
      {JSON.stringify(problemsData)}
    </div>
  )
}

export default Page;
