function throttle(callbackFn: (...args: any[]) => void, delay = 200) {
  let timerId: NodeJS.Timeout | null = null;

  return (...args: any[]): void => {
    if (timerId) {
      return; // Exit if already throttled
    }

    callbackFn(...args);
    timerId = setTimeout(() => {
      timerId = null; // Reset timerId after execution
    }, delay);
  };
}

export default throttle;
