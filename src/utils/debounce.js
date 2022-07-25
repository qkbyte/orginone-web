// 防抖
export const DebounceBy = (fn, t) => {
  let delay = t || 500;
  let timer;
  return function() {
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }

    let callNow = !timer;

    timer = setTimeout(() => {
      timer = null;
    }, delay);

    if (callNow) fn.apply(this, args);
  };
};
// 节流
export function Debounce(func, delay) {
  let timer;
  return (...args) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
