export interface Submission {
  contestId:number;
  relativeTimeSeconds: number;
  problem: {
    index: string;
  };
  author: {
    participantType: string,
    members: [
      {
        handle: string;
      }
    ];
  };
  verdict: string;
  passedTestCount: number;
  teamName: string;
}

export interface ContestStatus {
  statusData: {
    result: Submission[];
  };
}

export interface IUser {
  [handle: string]: {
    teamName: string;
    acceptedCount: number;
    totalSubmissionTime: number;
    totalPenality: number;
    totalWrongs: number;
    submissions: {
      [problem: string]: {
        contestId:number;
        accepted: boolean;
        wrongs: number;
        time: number;
      }
    }
  }
}
