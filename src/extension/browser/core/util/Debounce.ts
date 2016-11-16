
export class Debounce {

  static debounce(target: any, key: string, descriptor: any): void {

    let queue: any = [];

    let updateDebounce = function (method: any, that: any) {
      let diff = new Date().getTime() - method._lastBounced.getTime();

      if (queue.length > 0) {
        if (diff > 500) {
          let result = method.apply(that, queue[queue.length - 1].args);
          queue = [];
          method._lastBounced = new Date();
          return result;
        }
        else {
          setTimeout(function () {
            updateDebounce(method, that);
          }, diff);
        }
      }
      return null;
    };

    // Method value original
    let originalMethod = descriptor.value;
    originalMethod._lastBounced = new Date();

    // Edit the descriptor/value parameter
    descriptor.value = function (...args: any[]) {
      queue.push({'args': args});

      return updateDebounce(originalMethod, this);
    };

    return descriptor;
  }
}
