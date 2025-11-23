function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = a => a * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function normalize(v, min, max) {
  if (max === min) return 0.5;
  return (v - min) / (max - min);
}

function scoreContacts(contacts, user) {
  const ratings = contacts.map(c => c.rating ?? 0);
  const reviews = contacts.map(c => c.reviews_count ?? 0);
  const rMin = Math.min(...ratings, 0), rMax = Math.max(...ratings, 5);
  const revMin = Math.min(...reviews, 0), revMax = Math.max(...reviews, 1);
  const maxDist = 200;

  return contacts.map(c => {
    const dist = (user.lat && user.lng && c.latitude && c.longitude)
      ? haversineKm(user.lat, user.lng, c.latitude, c.longitude)
      : maxDist;
    const ndist = 1 - Math.min(dist, maxDist) / maxDist;
    const nrating = normalize(c.rating ?? 0, rMin, rMax);
    const nreviews = normalize(Math.log(1 + (c.reviews_count ?? 0)), Math.log(1 + revMin), Math.log(1 + revMax));
    const wRating = 0.55, wDistance = 0.35, wReviews = 0.10;
    const score = wRating * nrating + wDistance * ndist + wReviews * nreviews;
    return { ...c.toObject ? c.toObject() : c, score, distance_km: Math.round(dist*100)/100 };
  }).sort((a,b) => b.score - a.score);
}

module.exports = { scoreContacts };
