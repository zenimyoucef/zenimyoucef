import { useMemo } from 'react'
import { navyBFMale, navyBFFemale } from '../utils/calculations'

export default function useBodyFat(measurements, sex) {
  const { waist, neck, hip, height } = measurements || {}

  return useMemo(() => {
    if (!waist || !neck || !height) return null
    if (sex === 'female' && !hip) return null

    const result = sex === 'male'
      ? navyBFMale(waist, neck, height)
      : navyBFFemale(waist, hip, neck, height)

    return result !== null && isFinite(result)
      ? Math.max(3, Math.min(70, Math.round(result * 10) / 10))
      : null
  }, [waist, neck, hip, height, sex])
}
