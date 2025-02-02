"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
function calculateSquareRootSum(n) {
    let result = 0;
    for (let i = 0; i < n; i++) {
        result += Math.sqrt(i);
    }
    return result;
}
function factorial(n) {
    if (n === 0 || n === 1)
        return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}
function generatePrimeNumbers(limit) {
    const primes = [];
    for (let i = 2; i <= limit; i++) {
        let isPrime = true;
        for (let j = 2; j <= Math.sqrt(i); j++) {
            if (i % j === 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime)
            primes.push(i);
    }
    return primes;
}
worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.on('message', (data) => {
    let result;
    switch (data.task) {
        case 'expensive':
            {
                result = calculateSquareRootSum(data.value);
                break;
            }
        case 'factorial':
            {
                result = factorial(data.value);
                break;
            }
        case 'prime':
            {
                result = generatePrimeNumbers(data.value);
                break;
            }
        default:
            {
                result = 'Unknown task';
                break;
            }
    }
    worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage(result);
});
