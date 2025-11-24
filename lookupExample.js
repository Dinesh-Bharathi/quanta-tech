// "use client";

// import { useLookup } from "@/context/LookupContext";

// export default function CountryDropdown() {
//   const { countries } = useLookup();

//   if (!countries) return <p>Loading...</p>;

//   return (
//     <select>
//       {countries.map((c) => (
//         <option key={c.isoCode} value={c.isoCode}>
//           {c.name}
//         </option>
//       ))}
//     </select>
//   );
// }

// "use client";

// import { useLookup } from "@/context/LookupContext";
// import { useState, useEffect } from "react";

// export default function StateDropdown({ countryCode }) {
//   const { loadStates, statesMap } = useLookup();
//   const [states, setStates] = useState(null);

//   useEffect(() => {
//     if (countryCode) {
//       loadStates(countryCode).then((s) => setStates(s));
//     }
//   }, [countryCode]);

//   if (!states) return <p>Loading...</p>;

//   return (
//     <select>
//       {states.map((s) => (
//         <option key={s.isoCode} value={s.isoCode}>
//           {s.name}
//         </option>
//       ))}
//     </select>
//   );
// }
