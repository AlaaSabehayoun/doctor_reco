export default function Results({ list }) {
  if (!list) return null;
  return (
    <div>
      <h3>Results ({list.length})</h3>
      {list.map(c => (
        <div key={c._id} style={{border:'1px solid #ddd', padding:8, margin:8}}>
          <h4>{c.name} — {c.specialties?.join(', ')}</h4>
          <div>{c.hospital} • {c.city}</div>
          <div>Fee: ${c.fee_usd ?? 'N/A'} • Rating: {c.rating ?? 'N/A'}</div>
          <div>Distance: {c.distance_km ? c.distance_km.toFixed(2) : 'N/A'} km • Score: {c.score?.toFixed(2) ?? 'N/A'}</div>
        </div>
      ))}
    </div>
  );
}
