import work from 'webworkify'


/*
  Need to keep track of web-workers.
  Can potentially be a max depending on browser support.
  Spinning off too many workers can slow down the computer.
*/
const maxWorkers = window.navigator.hardwareConcurrency || 4

// keep track of workers in use
let workerMap = new Map()

export function createWorker(script, callback = (m) => {}) {
  if (workerMap.size === maxWorkers) {
    throw 'too many workers max: ' + maxWorkers +' - make sure to clean them up with terminateWorker'
  }
  let worker = work(script)
  worker.addEventListener('message', callback)
  workerMap.set(worker, true)

  return worker
}

export function terminateWorker(worker) {
  worker.addEventListener('message', () => {})
  worker.terminate()
  workerMap.delete(worker)
}