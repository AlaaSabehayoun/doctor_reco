import { useState } from 'react';
import axios from 'axios';

export default function SearchForm({ onResults }) {
  const [specialty, setSpecialty] = useState('');
  const [city, setCity] = useState('');
  const [maxFee, setMaxFee] = useState(2000);
  const [useLocation, setUseLocation] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    let lat = '', lng = '';
    if (useLocation && navigator.geolocation) {
      try {
        const p = await new Promise((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej)
        );
        lat = p.coords.latitude;
        lng = p.coords.longitude;
      } catch(e) {}
    }

    const base = import.meta.env.VITE_API_URL;
    const params = new URLSearchParams({ specialty, city, maxFee, lat, lng }).toString();
    const res = await axios.get(`${base}/contacts/search?${params}`);
    onResults(res.data);
  };

  return (
    <form onSubmit={handleSearch} style={{marginBottom:16}}>
      <input placeholder="Specialty" value={specialty} onChange={e=>setSpecialty(e.target.value)} />
      <input placeholder="City" value={city} onChange={e=>setCity(e.target.value)} />
      <input type="number" value={maxFee} onChange={e=>setMaxFee(e.target.value)} />
      <label style={{marginLeft:8}}>
        <input type="checkbox" checked={useLocation} onChange={e=>setUseLocation(e.target.checked)} /> use my location
      </label>
      <button style={{marginLeft:8}}>Search</button>
    </form>
  );
}
