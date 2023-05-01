const sum = (a, b) => {
  return a + b
}

const checks = [
  { a: 1, b: 2, result: 3 },
  { a: 2, b: 2, result: 4 },
  { a: 3, b: 2, result: 5 }
]

checks.forEach(check => {
  const { a, b, result } = check
  console.assert(sum(a, b) === result, `sum ${a} + ${b} no da ${result}`)
})

console.log(`${checks.length} checks preformed...`)
