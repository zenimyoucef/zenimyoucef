export const PROGRAMS = [
  {
    icon: '💪',
    badge: { text: '🔥 Popular', cls: 'pop' },
    title: 'Strength & Hypertrophy',
    desc: 'Build lean muscle with progressive overload training and nutrition coaching. 12-week transformation.',
    features: ['⚡ 12 Weeks', '📅 5x/Week'],
    price: 7000,
  },
  {
    icon: '🔥',
    badge: { text: '⚡ Pro', cls: 'pro' },
    title: 'HIIT & Cardio Blast',
    desc: 'High-intensity interval training to maximize fat burn, endurance, and cardiovascular performance.',
    features: ['⚡ 8 Weeks', '🔥 600+ Cal/Session'],
    price: 5500,
  },
  {
    icon: '🧘',
    badge: { text: '🌱 Beginner', cls: 'beg' },
    title: 'Flexibility & Recovery',
    desc: 'Improve mobility, accelerate recovery, and prevent injury with yoga and pilates fusion.',
    features: ['⚡ Ongoing', '📅 3x/Week'],
    price: 4000,
  },
]

export const TRAINERS = [
  { name: 'Marcus Steel', role: 'Head Coach', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&h=600&fit=crop' },
  { name: 'Elena Cruz', role: 'HIIT Specialist', img: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=500&h=600&fit=crop' },
  { name: 'Luna Park', role: 'Yoga & Mobility', img: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=500&h=600&fit=crop' },
  { name: 'Jake Morrison', role: 'Strength Coach', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&h=600&fit=crop' },
  { name: 'Zara Wells', role: 'Cardio Expert', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&h=600&fit=crop' },
]

export const CHALLENGES = [
  { icon: '💪', title: '30-Day Strength', desc: 'Daily workouts with meal plan and progress tracking.', progress: 65 },
  { icon: '🏃', title: '10K Running Prep', desc: 'From couch to 10K in 30 days with guided runs.', progress: 25 },
  { icon: '💧', title: 'Hydration & Wellness', desc: 'Build healthy hydration habits and improve wellness.', progress: 10 },
  { icon: '🧘', title: '30-Day Flexibility', desc: 'Daily mobility and stretching for better performance.', progress: 40 },
]

export const TESTIMONIALS = [
  { initial: 'J', name: 'Jessica R.', quote: 'PULSE completely transformed my relationship with fitness. The community keeps me motivated every day.', result: '-15kg in 12 weeks' },
  { initial: 'D', name: 'David K.', quote: "I've tried many gyms but PULSE is different. The strength program gave me incredible, lasting results.", result: '+12kg lean muscle' },
  { initial: 'M', name: 'Maya S.', quote: 'As a complete beginner, I was nervous. The 30-day challenge made it fun, achievable, and life-changing!', result: 'First 5K completed' },
  { initial: 'T', name: 'Tom L.', quote: "The HIIT sessions are intense but the results speak for themselves. I'm stronger than I've ever been.", result: '-8% body fat' },
]

export const PRICING_PLANS = [
  { name: 'Starter', price: 2500, features: ['✓ Gym access', '✓ 2 classes/week', '✓ Free fitness assessment'], featured: false },
  { name: 'Pro', price: 7000, features: ['✓ 24/7 unlimited access', '✓ Unlimited classes', '✓ 2 PT sessions/month', '✓ Nutrition coaching'], featured: true },
  { name: 'Elite', price: 12500, features: ['✓ Everything in Pro', '✓ 8 PT sessions/month', '✓ Personalized meal plans', '✓ Priority booking'], featured: false },
]

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const TIMES = ['Morning', 'Evening']
export const BOOKING_TIMES = ['6am', '7am', '8am', '9am', '10am', '12pm', '2pm', '4pm', '5pm', '6pm', '7pm']
