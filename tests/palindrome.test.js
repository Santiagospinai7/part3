const { palindrome } = require('../utils/for_testing')

// Write test
test('palindrome of app', () => {
  const result = palindrome('app')

  expect(result).toBe('ppa')
})

test('palindrome of app', () => {
  const result = palindrome('')

  expect(result).toBe('')
})

test('palindrome of app undefine', () => {
  const result = palindrome()

  expect(result).toBeUndefined()
})
