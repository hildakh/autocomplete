export const debounce = (callback: (arg: string) => void, delay: number) => {
  let timer: NodeJS.Timer;

  const debouncedFunction = (arg: string) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(arg), delay);
  }

  debouncedFunction.cancel = () => {
    clearTimeout(timer);
  }

  return debouncedFunction;
}