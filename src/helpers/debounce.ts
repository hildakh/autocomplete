export const debounce = (callback: (...args: any[]) => void, delay: number ) => {
  let timer: NodeJS.Timeout;

  const debouncedFn = (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };

  debouncedFn.cancel = () => {
    clearTimeout(timer);
  };

  return debouncedFn;
}