import React, { useState } from 'react';

// Import necessary libraries

// Define the Listbox component
const Listbox = ({nameList, idList}) => {
    // State for storing the search query

    // console.log(nameList)
    const [searchQuery, setSearchQuery] = useState('');

    // State for storing the list of items
    //const [items, setItems] = useState('');
    
    // Function to handle search query change
    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredItems = nameList.filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{'border':'1px solid gray','padding':'10px',borderRadius:'5px'} } >
            <input
                type="text"
                style={{'border':'1px solid #ccc','border-radius':'5px','padding':'5px'}}
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchQueryChange}
            />
            <p></p>
            <ul style={{border:'1px solid gray'}} className="overflow-scroll h-96">
                {filteredItems.map((item, index) => (
                    <li key={index}><input id={ idList }type='checkbox' />&nbsp;&nbsp;&nbsp;{nameList}</li>
                ))}
            </ul>
        </div>
    );
};

export default Listbox;