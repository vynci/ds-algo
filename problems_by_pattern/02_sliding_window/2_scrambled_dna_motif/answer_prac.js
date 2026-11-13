/**
 * Problem: Given an array of numbers and a number k, find the largest sum of any k consecutive elements.
 *
 * nums = [2, 1, 5, 1, 3, 2],  k = 3
 * Answer: 9   (from [5, 1, 3])
 *
 */

function maxSumSubarray(input, k) {
  let result = 0;

  for (let i = 0; i < input.length; i++) {
    const window = input.slice(i, i + k);
    console.log("window", window, window.length);
    if (window.length < k) break;

    const currentSum = window.reduce((acc, current) => {
      return acc + current;
    }, 0);

    result = currentSum > result ? currentSum : result;
  }

  return result;
}

console.log(maxSumSubarray([2, 1, 5, 1, 3, 2], 3));
