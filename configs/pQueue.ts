// queueManager.ts
import PQueue from "p-queue";

export class TaskQueue {
  private queue: PQueue;

  constructor(concurrency: number = 3) {
    this.queue = new PQueue({ concurrency });
  }

  /**
   * Add a task to the queue.
   * @param task Async function to run.
   * @returns Promise resolving to the task's result.
   */
  public add<T>(task: () => Promise<T>): Promise<T> {
    return this.queue.add(task) as Promise<T>;
  }

  /** Returns number of tasks currently running */
  public get pending(): number {
    return this.queue.pending;
  }

  /** Returns number of tasks waiting in the queue */
  public get size(): number {
    return this.queue.size;
  }
}
