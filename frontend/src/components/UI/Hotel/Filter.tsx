import { useState } from "react";

const Filter = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        occupancy: { adult: 1, child: 0 },
        roomCharacteristics: [],
        facilities: [],
        roomSize: { min: '', max: '' },
        priceRange: { min: '', max: '' },
    });

    const handleCheckboxChange = (category, value) => {
        setFilters(prev => ({
            ...prev,
            [category]: prev[category].includes(value)
                ? prev[category].filter(item => item !== value)
                : [...prev[category], value],
        }));
        onFilterChange({
            ...filters,
            [category]: filters[category].includes(value)
                ? filters[category].filter(item => item !== value)
                : [...filters[category], value]
        });
    };

    const handleInputChange = (category, field, value) => {
        setFilters(prev => ({
            ...prev,
            [category]: { ...prev[category], [field]: value },
        }));
        onFilterChange({
            ...filters,
            [category]: { ...filters[category], [field]: value }
        });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-1/4">
            {/* Room Occupancy */}
            <div className="mb-4">
                <h3 className="text-md font-medium mb-2">Occupancy</h3>
                <div className="space-y-2">
                    {['Adult', 'Child'].map((occu, i) => (
                        <div className="flex items-center justify-between" key={i}>
                            <label>{occu}</label>
                            <input
                                type="number"
                                min={occu.toLowerCase() === "adult" ? 1 : 0}
                                value={occu.toLowerCase() === "adult" ? filters.occupancy.adult : filters.occupancy.child}
                                onChange={(e) => handleInputChange('occupancy', occu.toLowerCase(), e.target.value)}
                                className="border border-gray-300 rounded-md p-1 w-12"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Room Characteristics */}
            <div className="mb-4">
                <h3 className="text-md font-medium mb-2">Room Characteristics</h3>
                <div className="space-y-2">
                    {['Double', 'Non-Smoking Room', 'Standard', 'Hill View'].map(char => (
                        <div key={char} className="flex items-center">
                            <input
                                type="checkbox"
                                id={char}
                                className="mr-2"
                                onChange={() => handleCheckboxChange('roomCharacteristics', char)}
                                checked={filters.roomCharacteristics.includes(char)}
                            />
                            <label htmlFor={char}>{char}</label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Facilities */}
            <div className="mb-4">
                <h3 className="text-md font-medium mb-2">Facilities</h3>
                <div className="space-y-2">
                    {['Air Conditioning', 'Wi-Fi', 'Mini Fridge', 'TV', 'Wheelchair Friendly'].map(facility => (
                        <div key={facility} className="flex items-center">
                            <input
                                type="checkbox"
                                id={facility}
                                className="mr-2"
                                onChange={() => handleCheckboxChange('facilities', facility)}
                                checked={filters.facilities.includes(facility)}
                            />
                            <label htmlFor={facility}>{facility}</label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Room Size */}
            <div className="mb-4">
                <h3 className="text-md font-medium mb-2">Room Size (sq.ft)</h3>
                <div className="flex space-x-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={filters.roomSize.min}
                        onChange={(e) => handleInputChange('roomSize', 'min', e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={filters.roomSize.max}
                        onChange={(e) => handleInputChange('roomSize', 'max', e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-4">
                <h3 className="text-md font-medium mb-2">Price Range</h3>
                <div className="flex space-x-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={filters.priceRange.min}
                        onChange={(e) => handleInputChange('priceRange', 'min', e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceRange.max}
                        onChange={(e) => handleInputChange('priceRange', 'max', e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
            </div>
        </div>
    );
};

export default Filter;