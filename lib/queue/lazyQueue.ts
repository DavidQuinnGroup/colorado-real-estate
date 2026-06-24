type QueueFactory<TQueue extends object> = () => TQueue;

export type LazyQueueDiagnostics = {
  module: 'lazyQueue';
  factoryCallsBeforeAccess: number;
  factoryCallsAfterPropertyAccess: number;
  factoryCallsAfterMethodCall: number;
  propertyValue: string;
  methodValue: string;
  sameInstance: boolean;
  methodBound: boolean;
};

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

export function getLazyQueueDiagnostics(): LazyQueueDiagnostics {
  let factoryCalls = 0;
  let firstInstanceLabel: string | null = null;

  const lazyQueue = createLazyQueue(() => {
    factoryCalls += 1;

    const queue = {
      label: `lazy-queue-${factoryCalls}`,
      getLabel() {
        return this.label;
      },
    };

    firstInstanceLabel = firstInstanceLabel || queue.label;
    return queue;
  });

  const factoryCallsBeforeAccess = factoryCalls;
  const propertyValue = lazyQueue.label;
  const factoryCallsAfterPropertyAccess = factoryCalls;
  const methodValue = lazyQueue.getLabel();
  const factoryCallsAfterMethodCall = factoryCalls;

  return {
    module: 'lazyQueue',
    factoryCallsBeforeAccess,
    factoryCallsAfterPropertyAccess,
    factoryCallsAfterMethodCall,
    propertyValue,
    methodValue,
    sameInstance: firstInstanceLabel === propertyValue,
    methodBound: methodValue === propertyValue,
  };
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/lazyQueue.ts
