import { getEventName, getProblemsData } from '@/actions/events';
import { BarChart, Home } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

async function Page({ params:{slug}}: { params: { slug: string } }) {

  const problemsData= await getProblemsData(slug);
  const eventName= await getEventName(slug);

  if(!problemsData){
    return <div className="">No Data</div>
  }

  const sortedProblemData=problemsData.editorials.sort((editorial1, editorial2) => {
    if (editorial1.problemIndex < editorial2.problemIndex) {
      return -1;
    }
    if (editorial1.problemIndex > editorial2.problemIndex) {
      return 1;
    }
    return 0;
  });

  return (
    <div className="">
      <div className="ms-5 mt-8 flex space-x-8 ">
        <Link href="/">
          <Home className="h-12 w-12 hover:bg-gray-200 hover:shadow-md hover:shadow-gray-300 bg-gray-100 rounded-md p-2" />
        </Link>
        <Link href={`/events/${slug}/leaderboard`}>
          <BarChart className="h-12 w-12 hover:bg-gray-200 hover:shadow-md hover:shadow-gray-300 bg-gray-100 rounded-md p-2" />
        </Link>
      </div>
      <h1 className='text-center text-4xl mt-5 font-semibold mb-3 text-[#114f3e]'>{eventName?.name}</h1>
      <div className="mt-20 pt-1 max-w-[800px] min-w-[500px] px-[3px] pb-[3px] overflow-x-auto mx-auto mb-5 text-center bg-[#E1E1E1] rounded-lg">
        <h1 className='text-left ps-2 font-medium'>Problems</h1>
        <table className="w-full table-auto border-collapse border font text-sm border-gray-100">
          <thead className="h-[20px] bg-white">
            <tr className="text-gray-700 border-b">
              <th className="w-16 border-r border-[#E1E1E1] text-center">#</th>
              <th className="pe-2 ps-3 border-r border-[#E1E1E1] text-left">Name</th>
              <th className="w-20 border-r border-[#E1E1E1] text-center">Editorials</th>
            </tr>
          </thead>
          <tbody>
            {sortedProblemData?.map((problem, index) => (
              <tr
                key={index}
                className={`text-[#0000CC] underline h-10 border-b border-[#E1E1E1] text-center ${
                  index % 2 !== 0 ? 'bg-white' : 'bg-[#f8f6f6]'
                }`}
              >
                <td className="w-16 border-r border-[#E1E1E1] text-center">
                  <a href={problem.problemLink ?? "#"} target='_blank' >{problem.problemIndex}</a>
                </td>
                <td className="pe-2 ps-3 border-r border-[#E1E1E1] text-left">
                  <a href={problem.problemLink ?? "#"} target='_blank' >{problem.content.split('*')[0].slice(2).slice(0, -2)}</a>
                </td>
                <td className="w-20 border-r border-[#E1E1E1] text-center">
                  <Link href={`/events/${slug}/editorials/${problem.problemIndex}`}>
                    {problem.problemIndex}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  )
}

export default Page;
