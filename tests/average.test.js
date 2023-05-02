const { average } = require('../utils/for_testing')

describe.skip('average', () => {
  test('of one value is the value itself', () => {
    expect(average([1])).toBe(1)
  })

  test('of many value is calculated correctly', () => {
    expect(average([1, 2, 3, 4, 4, 6])).toBe(3.3333333333333335)
  })

  test('of empty array', () => {
    expect(average([])).toBe(0)
  })

  test('of undefine', () => {
    expect(average()).toBeUndefined()
  })
})
