import '@testing-library/jest-dom/vitest'

// Mock requestAnimationFrame for useCountUp hook
global.requestAnimationFrame = (cb) => {
  return setTimeout(cb, 0)
}
global.cancelAnimationFrame = (id) => {
  clearTimeout(id)
}

// Mock performance.now
global.performance = {
  ...global.performance,
  now: () => Date.now()
}
