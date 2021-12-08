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

export interface JobType {
  job: {
    _id: string;
    name: string;
    lastRunAt: string;
    nextRunAt: string;
    repeatInterval: string;
  };
  status: JobStatusType;
}
