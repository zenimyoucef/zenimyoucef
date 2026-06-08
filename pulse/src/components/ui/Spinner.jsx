export default function Spinner({ size = 24 }) {
  return (
    <div className="spinner" style={{ width: size, height: size }}>
      <div className="spinner-ring" />
    </div>
  )
}
