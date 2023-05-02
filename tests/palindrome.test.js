const { palindrome } = require('../utils/for_testing')

// Write test
test.skip('palindrome of app', () => {
  const result = palindrome('app')

  expect(result).toBe('ppa')
})

test.skip('palindrome of app', () => {
  const result = palindrome('')

  expect(result).toBe('')
})

test.skip('palindrome of app undefine', () => {
  const result = palindrome()

  expect(result).toBeUndefined()
})
