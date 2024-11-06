import { getProblemsData } from '@/actions/events';
import Link from 'next/link';
import React from 'react'

async function Page({ params:{slug}}: { params: { slug: string } }) {

  const problemsData= await getProblemsData(slug);

  return (
    <div>
      <table>
        <thead>
          <th>
            <td>#</td>
            <td>Name</td>
            <td>Editorials</td>
          </th>
        </thead>
        <tbody>
          {
            problemsData?.editorials.map((problem,index)=>(
              <tr key={index}>
                <td>{problem.problemIndex}</td>
                <td>{problem.content.split("*")[0].slice(2).slice(0,-2)}</td>
                <td>
                <Link
                  href={`/events/${slug}/editorials/${"A"}`}>
                      {problem.problemIndex}
                    </Link>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default Page;
