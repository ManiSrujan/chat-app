function debounce<T>(callbackFn: (...args: any[]) => Promise<T>, delay = 200) {
  let timerId: NodeJS.Timeout | undefined;

  return (...args: any[]): Promise<T> => {
    return new Promise((resolve, reject) => {
      if (timerId) {
        clearTimeout(timerId);
      }

      timerId = setTimeout(async () => {
        try {
          const result = await callbackFn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}

export default debounce;
