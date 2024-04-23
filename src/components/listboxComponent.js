import React, { useState } from 'react';

// Define the Listbox component
const Listbox = ({ data }) => {
    // State for storing the search query
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);

    // Function to handle search query change
    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Function to handle checkbox change
    const handleCheckboxChange = (itemId) => {
        if (selectedItems.includes(itemId)) {
            // Remove item from selectedItems
            setSelectedItems(selectedItems.filter(id => id !== itemId));
        } else {
            // Add item to selectedItems
            setSelectedItems([...selectedItems, itemId]);
        }
        console.log(selectedItems)
    };

    // Filter items based on search query
    const filteredItems = data.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ border: '1px solid gray', padding: '10px', borderRadius: '5px' }}>
            <input
                type="text"
                style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '5px' }}
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchQueryChange}
            />
            <p></p>
            <ul style={{ border: '1px solid gray', maxHeight: '200px', overflowY: 'auto' }}>
                {filteredItems.map((item, index) => (
                    <li key={index}>
                        <input
                            id={item._id}
                            type='checkbox'
                            checked={selectedItems.includes(item._id)}
                            onChange={() => handleCheckboxChange(item._id)}
                        />&nbsp;&nbsp;&nbsp;{item.name}
                    </li>
                ))}
            </ul>
            <div>
                <p>Selected items:</p>
                <ul>
                    {selectedItems.map((itemId, index) => (
                        <li key={index}>{itemId}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Listbox;
