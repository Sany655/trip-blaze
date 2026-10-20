import bangladeshPlaces from './bangladeshPlaces.json';

/**
 * Returns all real Bangladesh tourist spots
 */
export const getBangladeshPlaces = () => bangladeshPlaces;

/**
 * Filter spots by administrative division (e.g., Chattogram, Sylhet, Khulna, Dhaka, Rajshahi, Barishal, Rangpur, Mymensingh)
 */
export const getPlacesByDivision = (division) => {
  if (!division || division === 'All') return bangladeshPlaces;
  return bangladeshPlaces.filter(
    (place) => place.division?.toLowerCase() === division.toLowerCase()
  );
};

/**
 * Filter spots by travel category
 */
export const getPlacesByCategory = (category) => {
  if (!category || category === 'All') return bangladeshPlaces;
  return bangladeshPlaces.filter(
    (place) => place.category?.toLowerCase() === category.toLowerCase()
  );
};

export { bangladeshPlaces };
export default bangladeshPlaces;
