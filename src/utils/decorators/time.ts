import { decorate } from './utils';

const labels = {};

// Exported for mocking in tests
export const defaultConsole = {
  time: console.time
    ? console.time.bind(console)
    : (label: string) => {
        labels[label] = Date.now();
      },
  timeEnd: console.timeEnd
    ? console.timeEnd.bind(console)
    : (label: string) => {
        const timeTaken = Date.now() - labels[label];
        delete labels[label];
        console.log(`${label}: ${timeTaken}ms`);
      },
};

let count = 0;

function handleDescriptor(
  target: Object,
  key: string,
  descriptor: PropertyDescriptor,
  [prefix = null, console = defaultConsole],
) {
  let fn;
  let patchedFn;
  const pf = prefix || `${target.constructor.name}.${key}`;

  let configurable: boolean | undefined = true;
  let enumerable: boolean | undefined = false;
  if (descriptor) {
    fn = descriptor.value;
    configurable = descriptor.configurable;
    enumerable = descriptor.enumerable;
    if (typeof fn !== 'function') {
      throw new SyntaxError(`@time can only be used on functions, not: ${fn}`);
    }
  }

  return {
    configurable,
    enumerable,
    get() {
      if (!patchedFn) {
        patchedFn = () => {
          const label = `${pf}-${count}`;
          count++;
          console.time(label);

          try {
            return fn.apply(this, arguments);
          } finally {
            console.timeEnd(label);
          }
        };
      }
      return patchedFn;
    },
    set(newFn: any) {
      patchedFn = undefined;
      fn = newFn;
    },
  };
}

export default function time(...args: any[]) {
  return decorate(handleDescriptor, args);
}
