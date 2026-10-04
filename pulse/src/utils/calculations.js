/**
 * PULSE — Calculations Module
 * All formulas isolated and documented.
 * Sources:
 *   - Navy Method: U.S. Navy / Hodgdon & Beckett (1984)
 *   - Devine Formula: Devine BJ (1974)
 *   - Robinson Formula: Robinson JD (1983)
 *   - Miller Formula: Miller DR (1985)
 */

/**
 * BMI = weight(kg) / height(m)²
 */
export function calcBMI(weightKg, heightCm) {
  const heightM = heightCm / 100
  return weightKg / (heightM * heightM)
}

/**
 * BMI Category
 */
export function bmiCategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: '#3B82F6' }
  if (bmi < 25) return { label: 'Normal', color: '#22C55E' }
  if (bmi < 30) return { label: 'Overweight', color: '#F59E0B' }
  return { label: 'Obese', color: '#EF4444' }
}

/**
 * Navy Body Fat % — Male
 * 495 / (1.0324 - 0.19077×log10(waist-neck) + 0.15456×log10(height)) - 450
 * All measurements in cm.
 */
export function navyBFMale(waistCm, neckCm, heightCm) {
  const diff = waistCm - neckCm
  if (diff <= 0 || heightCm <= 0) return null
  const logDiff = Math.log10(diff)
  const logHt = Math.log10(heightCm)
  const denominator = 1.0324 - 0.19077 * logDiff + 0.15456 * logHt
  return 495 / denominator - 450
}

/**
 * Navy Body Fat % — Female
 * 495 / (1.29579 - 0.35004×log10(waist+hip-neck) + 0.22100×log10(height)) - 450
 */
export function navyBFFemale(waistCm, hipCm, neckCm, heightCm) {
  const diff = waistCm + hipCm - neckCm
  if (diff <= 0 || heightCm <= 0) return null
  const logDiff = Math.log10(diff)
  const logHt = Math.log10(heightCm)
  const denominator = 1.29579 - 0.35004 * logDiff + 0.22100 * logHt
  return 495 / denominator - 450
}

/**
 * Lean Body Mass (LBM)
 */
export function calcLBM(weightKg, bodyFatPercent) {
  return weightKg * (1 - bodyFatPercent / 100)
}

/**
 * Muscle mass estimate ≈ LBM × 0.45
 */
export function calcMuscleMass(weightKg, bodyFatPercent) {
  return calcLBM(weightKg, bodyFatPercent) * 0.45
}

/**
 * Ideal Weight — Devine Formula
 * Male:   50 + 2.3 × (height_in - 60)
 * Female: 45.5 + 2.3 × (height_in - 60)
 */
export function devineIdealWeight(heightCm, isMale) {
  const heightIn = heightCm / 2.54
  const base = isMale ? 50 : 45.5
  return base + 2.3 * (heightIn - 60)
}

/**
 * Ideal Weight — Robinson Formula
 * Male:   52 + 1.9 × (height_in - 60)
 * Female: 49 + 1.7 × (height_in - 60)
 */
export function robinsonIdealWeight(heightCm, isMale) {
  const heightIn = heightCm / 2.54
  const base = isMale ? 52 : 49
  const factor = isMale ? 1.9 : 1.7
  return base + factor * (heightIn - 60)
}

/**
 * Ideal Weight — Miller Formula
 * Male:   56.2 + 1.41 × (height_in - 60)
 * Female: 53.1 + 1.36 × (height_in - 60)
 */
export function millerIdealWeight(heightCm, isMale) {
  const heightIn = heightCm / 2.54
  const base = isMale ? 56.2 : 53.1
  const factor = isMale ? 1.41 : 1.36
  return base + factor * (heightIn - 60)
}

/**
 * Convert kg to lbs / lbs to kg
 */
export function kgToLbs(kg) { return kg * 2.20462 }
export function lbsToKg(lbs) { return lbs / 2.20462 }

/**
 * Convert cm to inches / inches to cm
 */
export function cmToIn(cm) { return cm / 2.54 }
export function inToCm(inches) { return inches * 2.54 }

/**
 * Format number to 1 decimal place
 */
export function fmt(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return Number(n.toFixed(1)).toLocaleString()
}
