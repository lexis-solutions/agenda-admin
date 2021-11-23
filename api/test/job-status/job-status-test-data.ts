export type StatusType =
  | 'repeating'
  | 'scheduled'
  | 'queued'
  | 'completed'
  | 'failed'
  | 'running';

export interface InputType {
  attrs: {
    lastFinishedAt?: any;
    nextRunAt?: any;
    lastRunAt?: any;
    repeatInterval?: any;
    failedAt?: any;
  };
}

export interface OutputType {
  repeating?: boolean;
  scheduled?: boolean;
  queued?: boolean;
  completed?: boolean;
  failed?: boolean;
  running?: boolean;
}

const testData: {
  description: string;
  input: InputType;
  output: OutputType;
}[] = [
  {
    description: 'Should be a repeating task',
    input: {
      attrs: {
        repeatInterval: '1 second',
      },
    },
    output: {
      repeating: true,
    },
  },
  {
    description: 'Should be a scheduled task',
    input: {
      attrs: {
        nextRunAt: new Date(new Date().getTime() + 10000),
      },
    },
    output: {
      scheduled: true,
    },
  },
  {
    description: 'Should be a failed task',
    input: {
      attrs: {
        failedAt: new Date(2021, 1, 1, 0, 0, 0),
        lastFinishedAt: new Date(2021, 1, 1, 0, 0, 0),
      },
    },
    output: {
      failed: true,
    },
  },
  {
    description: 'Should be a completed task',
    input: {
      attrs: {
        lastFinishedAt: new Date(new Date().getTime() - 1000),
      },
    },
    output: {
      completed: true,
    },
  },
  {
    description: 'Should be a running task',
    input: {
      attrs: {
        lastRunAt: new Date(new Date().getTime() + 1000),
        lastFinishedAt: new Date(),
      },
    },
    output: {
      running: true,
    },
  },
  {
    description: 'Should be a queued task',
    input: {
      attrs: {
        nextRunAt: new Date(new Date().getTime() - 1000),
        lastFinishedAt: new Date(new Date().getTime() - 2000),
      },
    },
    output: {
      queued: true,
    },
  },
];

export default testData;
