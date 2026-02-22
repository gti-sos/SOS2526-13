const data = [
  { recipient: "Afghanistan", supplier: "Russia", year_of_order: 2002, number_ordered: 3, weapon_designation: "Mi-17", weapon_description: "transport helicopter", number_delivered: 3, year_of_delivery: 2002, status: "Second hand", comment: "Second-hand", tiv_unit: 2.9, tiv_total_order: 8.7, tiv_delivered_weapon: 8.7 },
  { recipient: "Algeria", supplier: "Ukraine", year_of_order: 2003, number_ordered: 116, weapon_designation: "R-27R/T", weapon_description: "", number_delivered: 116, year_of_delivery: 2004, status: "New", comment: "New", tiv_unit: 0.19, tiv_total_order: 22.04, tiv_delivered_weapon: 22.04 },
  { recipient: "Angola", supplier: "Cuba", year_of_order: 1975, number_ordered: 1, weapon_designation: "MiG-15UTI", weapon_description: "trainer aircraft", number_delivered: 1, year_of_delivery: 1975, status: "Second hand", comment: "aid", tiv_unit: 1.2, tiv_total_order: 1.2, tiv_delivered_weapon: 1.2 },
  { recipient: "Egypt", supplier: "Spain", year_of_order: 1982, number_ordered: 2, weapon_designation: "Descubierta", weapon_description: "frigate", number_delivered: 2, year_of_delivery: 1984, status: "New", comment: "Partly financed by Saudi Arabia and USA", tiv_unit: 93.7, tiv_total_order: 187.4, tiv_delivered_weapon: 187.4 },
  { recipient: "El Salvador", supplier: "United States", year_of_order: 1969, number_ordered: 3, weapon_designation: "C-47 Skytrain", weapon_description: "transport aircraft", number_delivered: 3, year_of_delivery: 1969, status: "Second hand", comment: "Second-hand", tiv_unit: 1, tiv_total_order: 3, tiv_delivered_weapon: 3 },
  { recipient: "Equatorial Guinea", supplier: "Israel", year_of_order: 2008, number_ordered: 2, weapon_designation: "Saar-4", weapon_description: "patrol boat", number_delivered: 2, year_of_delivery: 2011, status: "New", comment: "", tiv_unit: 22.5, tiv_total_order: 45, tiv_delivered_weapon: 45 },
  { recipient: "Estonia", supplier: "France", year_of_order: 2007, number_ordered: 100, weapon_designation: "Mistral", weapon_description: "portable SAM", number_delivered: 100, year_of_delivery: 2008, status: "New", comment: "Part of EUR60 m deal Mistral-2 version", tiv_unit: 0.09, tiv_total_order: 9, tiv_delivered_weapon: 9 },
  { recipient: "Ethiopia", supplier: "China", year_of_order: 2019, number_ordered: 10, weapon_designation: "BP-12A", weapon_description: "surface-to-surface missile", number_delivered: 10, year_of_delivery: 2020, status: "New", comment: "For A-200 MRL", tiv_unit: 2.25, tiv_total_order: 22.5, tiv_delivered_weapon: 22.5 },
  { recipient: "Greece", supplier: "Germany", year_of_order: 2020, number_ordered: 44, weapon_designation: "DM2A4 Seehecht", weapon_description: "anti-ship/anti-submarine torpedo", number_delivered: 11, year_of_delivery: 2024, status: "New", comment: "EUR110 m deal Seahake Mod-4ER version", tiv_unit: 1.8, tiv_total_order: 79.2, tiv_delivered_weapon: 19.8 },
  { recipient: "Spain", supplier: "Italy", year_of_order: 1975, number_ordered: 14, weapon_designation: "Bell-205A", weapon_description: "helicopter", number_delivered: 14, year_of_delivery: 1977, status: "New", comment: "AB-205 version", tiv_unit: 2.2, tiv_total_order: 30.8, tiv_delivered_weapon: 30.8 }
];

const supplierTarget = "Russia";
//filtrar por supplier
const filtered = data.filter(item => item.supplier === supplierTarget);
//suma 
const total = filtered.reduce((acc, curr) => acc + curr.tiv_total_order, 0);
//media
const average = filtered.length > 0 ? total / filtered.length : 0;

//test
console.log(`Datos filtrados por supplier: ${supplierTarget}`);
console.table(filtered);
console.log(`Media de tiv_total_order para ${supplierTarget}: ${average}`);