import work from 'webworkify'

let totalWorkers = 20;
let index = 0;

/*
  Need to keep track of web-workers.
  Can potentially be a max depending on browser support.
  Spinning off too many workers can slow down the computer.
*/
export function createWorker(script, callback) {
  if (index > totalWorkers) {
    throw 'too many workers - make sure to clean them up with terminateWorker'
  }
  let worker = work(script)
  worker.addEventListener('message', callback)
  index++

  return worker
}

export function terminateWorker(worker) {
  worker.terminate()
  index--
}