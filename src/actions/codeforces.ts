import { api } from "@/actions/api";
// import { Submission } from "@/interfaces/codeforces";


export const getContestStatus = async (slug: string) => {
  try {
    console.log(slug)
    const res = await api.get(`events/${slug}/submissions`);
    console.log(res)
    if (res.status === 200) {
      return res.data.codeSubmissions;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching contest ${slug}:`, error);
    return [];
  }
}


// export const getContestStatus = async (contestId: string[]) => {
//   let contests:Submission[]=[];
//   contestId.forEach(async (contest)=>{
//     const res = await api.get(`/codeforces/contest/${contest}/status/`);
//     console.log(res.data.statusData.result);

//     // if(res.data.code===200){
//       // contests.push({statusData:res.data.statusData});
//       contests.concat(res.data.statusData.result);
//       // contests=contests+res.data.statusData.result
//     // }
//     console.log(contests);
//   })
//   console.log(contests);

//   return contests;
// }

// export const getContestStatus = async (contestIds: string[]) => {
//   // Use Promise.all to wait for all asynchronous operations to complete
//   const contestPromises = contestIds.map(async (contestId) => {
//     try {
//       const res = await api.get(`/codeforces/contest/${contestId}/status/`);
//       if (res.data.code === 200) {
//         // Return the result to be used in Promise.all
//         return res.data.statusData.result;
//       }
//       // Return an empty array if the code is not 200
//       return [];
//     } catch (error) {
//       console.error(`Error fetching contest ${contestId}:`, error);
//       // Return an empty array in case of an error
//       return [];
//     }
//   });

//   // Wait for all promises to resolve
//   const contestResults = await Promise.all(contestPromises);

//   // Merge all results into a single array
//   const contests: Submission[] = contestResults.flat();

//   // console.log(contests);
//   return contests;
// };
