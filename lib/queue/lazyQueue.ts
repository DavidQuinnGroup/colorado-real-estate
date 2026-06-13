type QueueFactory<TQueue extends object> = () => TQueue;

export function createLazyQueue<TQueue extends object>(factory: QueueFactory<TQueue>): TQueue {
  let queue: TQueue | null = null;

  function getQueue() {
    if (!queue) queue = factory();
    return queue;
  }

  return new Proxy({} as TQueue, {
    get(_target, property) {
      const activeQueue = getQueue();
      const value = Reflect.get(activeQueue, property);
      return typeof value === 'function' ? value.bind(activeQueue) : value;
    },
  });
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/lazyQueue.ts
