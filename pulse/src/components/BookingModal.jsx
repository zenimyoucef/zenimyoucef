import { DAYS, TIMES, BOOKING_TIMES } from '../data/content'

const BOOKING_STORAGE_KEY = 'pulse_bookings'

function getBookings() {
  try { return JSON.parse(localStorage.getItem(BOOKING_STORAGE_KEY)) || {} } catch (e) { return {} }
}

function saveBookings(b) {
  localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(b))
}

let modalCallback = null

export function openBooking(name, role) {
  const overlay = document.getElementById('bookingModal')
  const nameEl = document.getElementById('bookingName')
  const roleEl = document.getElementById('bookingRole')
  const grid = document.getElementById('bookingGrid')
  if (!overlay || !grid) return
  nameEl.textContent = '📅 ' + name
  roleEl.textContent = role + ' — Click a time slot to book your session.'
  const bookings = getBookings()
  let html = '<div></div>'
  DAYS.forEach(d => { html += `<div class="bk-day-header">${d}</div>` })
  BOOKING_TIMES.forEach(t => {
    html += `<div class="bk-day-header" style="font-size:.35rem">${t}</div>`
    DAYS.forEach(d => {
      const key = name + '-' + d + '-' + t
      const booked = bookings[key]
      html += `<div class="bk-slot ${booked ? 'own-booked' : ''}" data-bk="${key}" onclick="toggleBookingSlot(this,'${name}','${d}','${t}')">${booked ? '✓' : '—'}</div>`
    })
  })
  grid.innerHTML = html
  overlay.classList.add('open')
  document.body.style.overflow = 'hidden'
}

window.toggleBookingSlot = (el, trainer, day, time) => {
  const key = trainer + '-' + day + '-' + time
  const bookings = getBookings()
  if (bookings[key]) {
    delete bookings[key]
    el.classList.remove('own-booked')
    el.textContent = '—'
  } else {
    let count = 0
    for (const k in bookings) { if (k.startsWith(trainer + '-')) count++ }
    if (count >= 5) { return }
    bookings[key] = true
    el.classList.add('own-booked')
    el.textContent = '✓'
  }
  saveBookings(bookings)
}

export function closeBooking() {
  const overlay = document.getElementById('bookingModal')
  if (overlay) overlay.classList.remove('open')
  document.body.style.overflow = ''
}

export default function BookingModal() {
  return (
    <div className="modal-overlay" id="bookingModal">
      <div className="modal-box">
        <button className="modal-close" onClick={closeBooking}>✕</button>
        <h3 id="bookingName">Book a Class</h3>
        <div className="modal-sub" id="bookingRole">Click a time slot to book your session.</div>
        <div className="booking-grid" id="bookingGrid"></div>
      </div>
    </div>
  )
}
