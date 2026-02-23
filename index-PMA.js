const data = [
  { location: "India", year: 2012, intensity_level: 1, conflict_type: 3, start_precision: 1 },
  { location: "Egypt, Israel", year: 1967, intensity_level: 2, conflict_type: 2, start_precision: 1 },
  { location: "Egypt, Israel", year: 1969, intensity_level: 1, conflict_type: 2, start_precision: 1 },
  { location: "Egypt, Israel", year: 1970, intensity_level: 1, conflict_type: 2, start_precision: 1 },
  { location: "Egypt, Israel", year: 1973, intensity_level: 2, conflict_type: 2, start_precision: 1 },
  { location: "Sudan", year: 2011, intensity_level: 1, conflict_type: 3, start_precision: 1 },
  { location: "South Sudan", year: 2011, intensity_level: 1, conflict_type: 3, start_precision: 2 },
  { location: "South Sudan", year: 2012, intensity_level: 1, conflict_type: 3, start_precision: 2 },
  { location: "South Sudan", year: 2013, intensity_level: 1, conflict_type: 3, start_precision: 2 },
  { location: "South Sudan", year: 2014, intensity_level: 2, conflict_type: 4, start_precision: 2 }
];

let egypt = data.filter(l => l.location==="Egypt, Israel");

let media_intensityLevel = egypt.reduce((acc, l) => acc + l.intensity_level, 0) / egypt.length;

console.log(`The average intensity level on Egypt conflicts is ${media_intensityLevel}`)