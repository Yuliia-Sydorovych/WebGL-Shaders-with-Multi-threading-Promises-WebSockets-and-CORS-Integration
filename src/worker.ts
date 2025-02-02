import { parentPort } from 'worker_threads';

function calculateSquareRootSum(n: number): number
{
    let result = 0;

    for (let i = 0; i < n; i++)
    {
        result += Math.sqrt(i);
    }
    return result;
}

function getFactorial(n: number): number
{
    if (n === 0 || n === 1) return 1;
    
    let result = 1;

    for (let i = 2; i <= n; i++)
    {
        result *= i;
    }
    return result;
}

function generatePrimeNumbers(limit: number): number[]
{
    const primes: number[] = [];
    for (let i = 2; i <= limit; i++)
    {
        let isPrime = true;

        for (let j = 2; j <= Math.sqrt(i); j++)
        {
            if (i % j === 0)
            {
                isPrime = false;
                break;
            }
        }

        if (isPrime) primes.push(i);
    }
    return primes;
}

parentPort?.on('message', (data: { task: string; value: number }) =>
{
    let result;

    switch (data.task)
    {
        case 'expensive':
        {
            result = calculateSquareRootSum(data.value);
            break;
        }
        case 'factorial':
        {
            result = getFactorial(data.value);
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

    parentPort?.postMessage(result);
});
