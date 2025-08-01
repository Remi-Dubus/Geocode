export default function distanceTo(
  latStart: number,
  lngStart: number,
  latEnd: number,
  lngEnd: number,
) {
  function toRadians(degrees: number) {
    return degrees * (Math.PI / 180);
  }

  const earthRay = 6371e3;
  const φ1 = toRadians(latStart);
  const φ2 = toRadians(latEnd);
  const Δφ = toRadians(latStart) - toRadians(latEnd);
  const Δλ = toRadians(lngStart) - toRadians(lngEnd);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const dist = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = (earthRay * dist) / 1000;

  return distanceKm.toFixed(1); //limit display to one unit (eg: 1.5 km)
}
