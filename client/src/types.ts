export type SortType = 'lastRunAt' | 'nextRunAt';

export type StatusType =
  | 'repeating'
  | 'scheduled'
  | 'queued'
  | 'completed'
  | 'failed'
  | 'running';

export interface JobStatusType {
  repeating: boolean;
  scheduled: boolean;
  queued: boolean;
  completed: boolean;
  failed: boolean;
  running: boolean;
}

export interface JobOverviewType {
  repeating: number;
  scheduled: number;
  queued: number;
  completed: number;
  failed: number;
  running: number;
}

export interface JobType {
  job: {
    _id: string;
    name: string;
    lastRunAt: string;
    nextRunAt: string;
    repeatInterval: string;
    data?: any;
    failCount?: number;
    failReason?: string;
    failedAt?: string;
  };
  status: JobStatusType;
}

export type GetJobsResponseType = {
  pages: {
    pagesCount: number;
    itemsCount: number;
  }[];
  jobs: JobType[];
}[];

export type JobsOverviewResponseType = {
  data: JobOverviewType[];
};
