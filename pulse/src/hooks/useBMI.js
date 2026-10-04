import { useMemo } from 'react'
import { calcBMI, bmiCategory } from '../utils/calculations'

export default function useBMI(weightKg, heightCm) {
  return useMemo(() => {
    if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) {
      return { bmi: null, category: null }
    }
    const bmi = calcBMI(weightKg, heightCm)
    return { bmi, category: bmiCategory(bmi) }
  }, [weightKg, heightCm])
}
