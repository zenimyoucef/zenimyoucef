import { describe, it, expect } from 'vitest'
import {
  calcBMI,
  bmiCategory,
  navyBFMale,
  navyBFFemale,
  calcLBM,
  calcMuscleMass,
  devineIdealWeight,
  robinsonIdealWeight,
  millerIdealWeight,
  kgToLbs,
  lbsToKg,
  cmToIn,
  inToCm,
  fmt
} from './calculations'

describe('calcBMI', () => {
  it('calculates BMI correctly for standard values', () => {
    // 70kg / (1.75m)² = 22.86
    const result = calcBMI(70, 175)
    expect(result).toBeCloseTo(22.86, 1)
  })

  it('returns correct BMI for 85kg at 180cm', () => {
    const result = calcBMI(85, 180)
    expect(result).toBeCloseTo(26.23, 1)
  })

  it('returns correct BMI for 55kg at 160cm', () => {
    const result = calcBMI(55, 160)
    expect(result).toBeCloseTo(21.48, 1)
  })
})

describe('bmiCategory', () => {
  it('returns Underweight for BMI < 18.5', () => {
    expect(bmiCategory(16).label).toBe('Underweight')
    expect(bmiCategory(16).color).toBe('#3B82F6')
  })

  it('returns Normal for BMI 18.5–24.9', () => {
    expect(bmiCategory(22).label).toBe('Normal')
    expect(bmiCategory(22).color).toBe('#22C55E')
  })

  it('returns Overweight for BMI 25–29.9', () => {
    expect(bmiCategory(27).label).toBe('Overweight')
    expect(bmiCategory(27).color).toBe('#F59E0B')
  })

  it('returns Obese for BMI >= 30', () => {
    expect(bmiCategory(32).label).toBe('Obese')
    expect(bmiCategory(32).color).toBe('#EF4444')
  })

  it('handles boundary values correctly', () => {
    expect(bmiCategory(18.5).label).toBe('Normal')
    expect(bmiCategory(25).label).toBe('Overweight')
    expect(bmiCategory(30).label).toBe('Obese')
  })
})

describe('navyBFMale', () => {
  it('calculates BF% for a lean male', () => {
    // waist 78, neck 38, height 175
    const result = navyBFMale(78, 38, 175)
    expect(result).toBeGreaterThan(5)
    expect(result).toBeLessThan(20)
  })

  it('returns null when waist <= neck (invalid)', () => {
    expect(navyBFMale(35, 40, 175)).toBeNull()
  })

  it('returns null for zero height', () => {
    expect(navyBFMale(80, 38, 0)).toBeNull()
  })

  it('returns higher BF% for larger waist', () => {
    const lean = navyBFMale(78, 38, 175)
    const heavy = navyBFMale(95, 38, 175)
    expect(heavy).toBeGreaterThan(lean)
  })
})

describe('navyBFFemale', () => {
  it('calculates BF% for a female', () => {
    // waist 70, hip 92, neck 34, height 165
    const result = navyBFFemale(70, 92, 34, 165)
    expect(result).toBeGreaterThan(15)
    expect(result).toBeLessThan(35)
  })

  it('returns null when waist+hip < neck (invalid)', () => {
    expect(navyBFFemale(20, 10, 35, 165)).toBeNull()
  })

  it('returns null for zero height', () => {
    expect(navyBFFemale(70, 92, 34, 0)).toBeNull()
  })
})

describe('calcLBM', () => {
  it('calculates lean body mass correctly', () => {
    // 80kg at 15% BF = 68kg LBM
    const result = calcLBM(80, 15)
    expect(result).toBeCloseTo(68, 1)
  })

  it('returns weight when BF% is 0', () => {
    expect(calcLBM(70, 0)).toBeCloseTo(70, 1)
  })

  it('returns 0 when BF% is 100', () => {
    expect(calcLBM(70, 100)).toBeCloseTo(0, 1)
  })
})

describe('calcMuscleMass', () => {
  it('estimates muscle mass correctly', () => {
    // LBM = 68, muscle ≈ 68 × 0.45 = 30.6
    const result = calcMuscleMass(80, 15)
    expect(result).toBeCloseTo(30.6, 0)
  })
})

describe('devineIdealWeight', () => {
  it('calculates Devine for male at 180cm', () => {
    // 180cm = 70.87in. 50 + 2.3 × (70.87 - 60) = 74.99
    const result = devineIdealWeight(180, true)
    expect(result).toBeCloseTo(75.0, 0)
  })

  it('calculates Devine for female at 165cm', () => {
    // 165cm = 64.96in. 45.5 + 2.3 × (64.96 - 60) = 56.91
    const result = devineIdealWeight(165, false)
    expect(result).toBeCloseTo(56.9, 0)
  })
})

describe('robinsonIdealWeight', () => {
  it('calculates Robinson for male at 180cm', () => {
    // 52 + 1.9 × (70.87 - 60) = 72.65
    const result = robinsonIdealWeight(180, true)
    expect(result).toBeCloseTo(72.7, 0)
  })
})

describe('millerIdealWeight', () => {
  it('calculates Miller for male at 180cm', () => {
    // 56.2 + 1.41 × (70.87 - 60) = 71.52
    const result = millerIdealWeight(180, true)
    expect(result).toBeCloseTo(71.5, 0)
  })
})

describe('unit conversions', () => {
  it('converts kg to lbs', () => {
    expect(kgToLbs(1)).toBeCloseTo(2.20462, 2)
  })

  it('converts lbs to kg', () => {
    expect(lbsToKg(2.20462)).toBeCloseTo(1, 2)
  })

  it('converts cm to inches', () => {
    expect(cmToIn(2.54)).toBeCloseTo(1, 2)
  })

  it('converts inches to cm', () => {
    expect(inToCm(1)).toBeCloseTo(2.54, 2)
  })
})

describe('fmt', () => {
  it('formats a number to 1 decimal place', () => {
    expect(fmt(75.456)).toBe('75.5')
  })

  it('returns em dash for null', () => {
    expect(fmt(null)).toBe('—')
  })

  it('returns em dash for undefined', () => {
    expect(fmt(undefined)).toBe('—')
  })

  it('returns em dash for NaN', () => {
    expect(fmt(NaN)).toBe('—')
  })
})
