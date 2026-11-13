/**
 * Problem: Given a sorted array and a target, return the target’s index, or -1 if it isn’t there.
 *
 * nums = [1, 3, 5, 7, 9, 11],  target = 7
 * Answer: 3
 *
 */

function search(input, target) {
  let result = -1;
  let left = 0;
  let right = input.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (input[mid] === target) return mid;
    else if (input[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return result;
}

console.log(search([1, 3, 5, 7, 9, 11, 17, 23, 28], 28));
