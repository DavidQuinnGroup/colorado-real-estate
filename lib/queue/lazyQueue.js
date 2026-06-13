export function createLazyQueue(factory) {
  let queue = null;

  function getQueue() {
    if (!queue) queue = factory();
    return queue;
  }

  return new Proxy({}, {
    get(_target, property) {
      const activeQueue = getQueue();
      const value = Reflect.get(activeQueue, property);
      return typeof value === 'function' ? value.bind(activeQueue) : value;
    },
  });
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/lazyQueue.js
