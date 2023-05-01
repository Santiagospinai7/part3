const palindrome = (string) => {
  if (typeof string === 'undefined') return

  return string.split('').reverse().join('')
}

const average = (array) => {
  if (typeof array === 'undefined') return
  if (array.length === 0) return 0

  let sum = 0
  array.forEach(number => { sum += number })
  return sum / array.length
}

module.exports = {
  palindrome,
  average
}
