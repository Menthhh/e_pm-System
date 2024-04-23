import React, { useState, useEffect } from 'react';

const Listbox = ({ data, handleSelectedList  }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);

    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleCheckboxChange = (itemId) => {
        // Toggle the selection of the clicked item
        const newSelectedItems = selectedItems.includes(itemId)
            ? selectedItems.filter(id => id !== itemId) // Remove item if already selected
            : [...selectedItems, itemId]; // Add item if not selected
    
        // Update the selectedItems state immediately
        setSelectedItems(newSelectedItems);
    
        // Pass the updated selectedItems to the parent component
        handleSelectedList(newSelectedItems);
    };
    
    useEffect(() => {
        handleSelectedList(selectedItems);
    }, [selectedItems]);

    const filteredItems = data.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getItemName = (itemId) => {
        const selectedItem = data.find(item => item._id === itemId);
        return selectedItem ? selectedItem.name : '';
    };

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
            {/* <div>
                <p>Selected items:</p>
                <ul>
                    {selectedItems.map((itemId, index) => (
                        <li key={index}>{getItemName(itemId)}</li>
                    ))}
                </ul>
            </div> */}
        </div>
    );
};

export default Listbox;
