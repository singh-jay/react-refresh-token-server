const { Worker } = require('worker_threads')
const parent = new Worker(__filename)
// console.log(parent)
parent.on('message', data => {
  parent.postMessage({
    input: data.input,
    primes: getPrimes(data.input),
  })
})

function getPrimes(max) {
  const sieve = [],
    primes = []

  for (let i = 2; i <= max; ++i) {
    if (!sieve[i]) {
      primes.push(i)

      for (let j = i << 1; j <= max; j += i) {
        sieve[j] = true
      }
    }
  }

  return primes
}
