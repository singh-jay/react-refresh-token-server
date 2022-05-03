const { Worker } = require('worker_threads')
// Create a new worker
const worker = new Worker('./worker.js')
// console.log(worker)
// Listen for messages from worker
worker.on('message', result => {
  console.log(
    `The prime numbers between 2 and ${result.input} are: ${result.primes}`
  )
})

worker.on('error', error => {
  console.log(error)
})

worker.on('exit', exitCode => {
  console.log(exitCode)
})

// Send messages to the worker
worker.postMessage({ input: 100 })
worker.postMessage({ input: 50 })
