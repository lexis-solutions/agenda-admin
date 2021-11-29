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
