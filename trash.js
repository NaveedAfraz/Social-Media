function sortArray(array) {
  let odd = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i] % 2 !== 0) {
      odd.push(i);
    }
  }
  odd.sort((a, b) => a - b);
  console.log(odd);
}

sortArray([5, 8, 6, 3, 4]);
