import React from 'react';
import RoomCart from './RoomCart.tsx';

const FilteredRoomList = ({ rooms, filters, hotel }) => {
    const filterRooms = () => {
        return rooms?.filter(room => {
            const { occupancy, roomCharacteristics, facilities, roomSize, priceRange } = filters;

            if (occupancy?.adult || occupancy?.child) {
                const { adult, child } = occupancy;

                // Extract adult, child, and maximum guests values from room data
                const adultMatch = room.occupancy.match(/Adult:\s*(\d+)/);
                const childMatch = room.occupancy.match(/Child:\s*(\d+)/);
                const maxGuestsMatch = room.occupancy.match(/Maximum Number of Guests Allowed:\s*(\d+)/);

                if (adultMatch && childMatch && maxGuestsMatch) {
                    const maxAdults = parseInt(adultMatch[1]);
                    const maxChildren = parseInt(childMatch[1]);
                    const maxGuests = parseInt(maxGuestsMatch[1]);

                    // Convert adult and child values to integers
                    const numAdults = parseInt(adult) || 0;
                    const numChildren = parseInt(child) || 0;
                    const totalGuests = numAdults + numChildren;

                    // If adult or child count exceeds, or total guests exceed the maximum allowed, return false
                    if (numAdults > maxAdults || numChildren > maxChildren || totalGuests > maxGuests) {
                        return false;
                    }
                }
            }

            // Room Characteristics Filter
            if (roomCharacteristics?.length > 0) {
                const characteristicsMatch = roomCharacteristics.every(char => room.roomCharacteristics.includes(char));
                if (!characteristicsMatch) return false;
            }

            // Facilities Filter
            if (facilities?.length > 0) {
                const facilitiesMatch = facilities.every(facility => room.facilities.includes(facility));
                if (!facilitiesMatch) return false;
            }

            // Room Size Filter
            if (roomSize?.min || roomSize?.max) {
                const roomSizeNumber = parseInt(room.roomSize.match(/\d+/)[0]);
                if (roomSize?.min && roomSizeNumber < parseInt(roomSize?.min)) return false;
                if (roomSize?.max && roomSizeNumber > parseInt(roomSize?.max)) return false;
            }

            // Price Range Filter
            if (priceRange?.min || priceRange?.max) {
                const priceNumber = parseInt(room.price);
                if (priceRange?.min && priceNumber < parseInt(priceRange?.min)) return false;
                if (priceRange?.max && priceNumber > parseInt(priceRange?.max)) return false;
            }

            return true;
        });
    };

    const filteredRooms = filterRooms();

    return (
        <div className="flex-1 grid grid-cols-1 gap-4">
            {filteredRooms?.map((room, index) => (
                <RoomCart {...room} key={index} hotel={hotel} />
            ))}
        </div>
    );
};

export default FilteredRoomList;
