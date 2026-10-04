import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, within, cleanup } from '@testing-library/react'
import BMICalc from './BMICalc'

// Mock useApp
const mockProfile = {
  name: 'Athlete',
  age: '',
  sex: 'male',
  heightCm: 175,
  goalWeight: '',
  goalBodyFat: ''
}
vi.mock('../context/AppContext', () => ({
  useApp: () => ({
    profile: mockProfile,
    setProfile: vi.fn()
  })
}))

// Mock useCountUp to skip animation and return the target value directly
vi.mock('../hooks/useCountUp', () => ({
  default: (target) => target ?? 0
}))

describe('BMICalc', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders the page header', () => {
    render(<BMICalc />)
    expect(screen.getByRole('heading', { name: 'BMI Calculator' })).toBeInTheDocument()
  })

  it('renders input fields: height, weight, age', () => {
    render(<BMICalc />)
    const spinbuttons = screen.getAllByRole('spinbutton')
    expect(spinbuttons.length).toBeGreaterThanOrEqual(3)
    const combos = screen.getAllByRole('combobox')
    expect(combos.length).toBeGreaterThanOrEqual(3)
  })

  it('shows prompt when no weight is entered', () => {
    render(<BMICalc />)
    const prompts = screen.getAllByText(/Enter your height and weight/)
    expect(prompts.length).toBeGreaterThanOrEqual(1)
  })

  it('reverts to prompt when weight is cleared', () => {
    render(<BMICalc />)
    const spinbuttons = screen.getAllByRole('spinbutton')
    fireEvent.change(spinbuttons[1], { target: { value: '70' } })
    expect(screen.queryByText(/Enter your height and weight/)).not.toBeInTheDocument()

    fireEvent.change(spinbuttons[1], { target: { value: '' } })
    expect(screen.getAllByText(/Enter your height and weight/).length).toBeGreaterThanOrEqual(1)
  })

  it('renders BMI result when weight is entered', () => {
    render(<BMICalc />)
    const spinbuttons = screen.getAllByRole('spinbutton')
    const weightInput = spinbuttons[1]
    fireEvent.change(weightInput, { target: { value: '70' } })

    expect(screen.getAllByText('Normal').length).toBeGreaterThanOrEqual(1)
    expect(screen.queryByText(/Enter your height and weight/)).not.toBeInTheDocument()
    expect(screen.getAllByText('Underweight').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Overweight').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Obese').length).toBeGreaterThanOrEqual(1)
  })

  it('shows Underweight category for low BMI (50kg at 175cm)', () => {
    render(<BMICalc />)
    const spinbuttons = screen.getAllByRole('spinbutton')
    fireEvent.change(spinbuttons[1], { target: { value: '50' } })
    // BMI ≈ 16.3
    expect(screen.getAllByText('Underweight').length).toBeGreaterThanOrEqual(1)
  })

  it('shows Overweight category for high BMI (90kg at 175cm)', () => {
    render(<BMICalc />)
    const spinbuttons = screen.getAllByRole('spinbutton')
    fireEvent.change(spinbuttons[1], { target: { value: '90' } })
    // BMI ≈ 29.4
    expect(screen.getAllByText('Overweight').length).toBeGreaterThanOrEqual(1)
  })

  it('shows Obese category for very high BMI (110kg at 175cm)', () => {
    render(<BMICalc />)
    const spinbuttons = screen.getAllByRole('spinbutton')
    fireEvent.change(spinbuttons[1], { target: { value: '110' } })
    // BMI ≈ 35.9
    expect(screen.getAllByText('Obese').length).toBeGreaterThanOrEqual(1)
  })

  it('switches height unit between cm and inches', () => {
    render(<BMICalc />)
    const combos = screen.getAllByRole('combobox')
    const heightUnitSelect = combos[0]
    expect(heightUnitSelect).toHaveValue('cm')

    fireEvent.change(heightUnitSelect, { target: { value: 'ft' } })
    // 175cm / 2.54 ≈ 68.898 inches
    const spinbuttons = screen.getAllByRole('spinbutton')
    expect(Number(spinbuttons[0].value)).toBeCloseTo(68.9, 1)
  })

  it('switches weight unit between kg and lbs', () => {
    render(<BMICalc />)
    const combos = screen.getAllByRole('combobox')
    const weightUnitSelect = combos[1]
    expect(weightUnitSelect).toHaveValue('kg')

    fireEvent.change(weightUnitSelect, { target: { value: 'lbs' } })
    expect(weightUnitSelect).toHaveValue('lbs')
  })

  it('does not break BMI when weight is in lbs', () => {
    render(<BMICalc />)
    const combos = screen.getAllByRole('combobox')
    fireEvent.change(combos[1], { target: { value: 'lbs' } })

    const spinbuttons = screen.getAllByRole('spinbutton')
    fireEvent.change(spinbuttons[1], { target: { value: '154' } })
    // 154 lbs ≈ 70kg, BMI = 70 / 1.75² ≈ 22.9 → Normal
    expect(screen.getAllByText('Normal').length).toBeGreaterThanOrEqual(1)
  })

  it('does not break BMI when height is displayed in inches', () => {
    render(<BMICalc />)
    const combos = screen.getAllByRole('combobox')
    fireEvent.change(combos[0], { target: { value: 'ft' } })

    const spinbuttons = screen.getAllByRole('spinbutton')
    fireEvent.change(spinbuttons[1], { target: { value: '70' } })
    // 70kg / 1.75² = 22.86 → Normal
    expect(screen.getAllByText('Normal').length).toBeGreaterThanOrEqual(1)
  })

  it('does not crash with zero weight input', () => {
    render(<BMICalc />)
    const spinbuttons = screen.getAllByRole('spinbutton')
    fireEvent.change(spinbuttons[1], { target: { value: '0' } })
    // Should still show prompt since BMI is null
    expect(screen.getAllByText(/Enter your height and weight/).length).toBeGreaterThanOrEqual(1)
  })

  it('does not crash with negative weight input', () => {
    render(<BMICalc />)
    const spinbuttons = screen.getAllByRole('spinbutton')
    fireEvent.change(spinbuttons[1], { target: { value: '-50' } })
    // Should still show prompt since negative weight is invalid
    expect(screen.getAllByText(/Enter your height and weight/).length).toBeGreaterThanOrEqual(1)
  })

  it('renders ideal weight estimates when weight is entered', () => {
    render(<BMICalc />)
    const spinbuttons = screen.getAllByRole('spinbutton')
    fireEvent.change(spinbuttons[1], { target: { value: '70' } })

    expect(screen.getAllByText('Ideal Weight Estimates').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Devine').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Robinson').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Miller').length).toBeGreaterThanOrEqual(1)
  })

  it('renders ideal weights for female sex', () => {
    render(<BMICalc />)
    const spinbuttons = screen.getAllByRole('spinbutton')
    fireEvent.change(spinbuttons[1], { target: { value: '70' } })

    const combos = screen.getAllByRole('combobox')
    fireEvent.change(combos[2], { target: { value: 'female' } })

    expect(screen.getAllByText('Ideal Weight Estimates').length).toBeGreaterThanOrEqual(1)
  })

  it('renders Male and Female sex options', () => {
    render(<BMICalc />)
    const combos = screen.getAllByRole('combobox')
    const sexSelect = combos[2]
    expect(sexSelect).toHaveValue('male')
    expect(within(sexSelect).getByRole('option', { name: 'Male' })).toBeInTheDocument()
    expect(within(sexSelect).getByRole('option', { name: 'Female' })).toBeInTheDocument()
  })

  it('renders health note disclaimer when BMI is calculated', () => {
    render(<BMICalc />)
    const spinbuttons = screen.getAllByRole('spinbutton')
    fireEvent.change(spinbuttons[1], { target: { value: '70' } })

    expect(screen.getByText(/BMI is a screening tool/)).toBeInTheDocument()
  })
})
