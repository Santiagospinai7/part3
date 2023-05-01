const palindrome = (string) => {
  if (typeof string === 'undefined') return

  return string.split('').reverse().join('')
}

const average = (array) => {
  let sum = 0
  array.forEach(number => { sum += number })
  return sum / array.length
}

module.exports = {
  palindrome,
  average
}
