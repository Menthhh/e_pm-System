import React, { useState } from 'react';

const TableComponent = ({ headers, datas, searchColumn = "" }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const pageSize = 4; // Number of rows per page

    const data = datas;

    const filteredData = data.filter((item) =>
        item[searchColumn].toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / pageSize);

    const currentPageData = filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="flex flex-col justify-center gap-5 items-center">
            <div className='pl-6'>
                <input
                    className="border border-gray-300 rounded-md p-2"
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <table className="table-auto container mx-auto w-full">
                <thead className="border-t-2 border-b-4">
                    <tr>
                        {headers.map((header) => (
                            <th key={header} className="px-4 py-4">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="text-center">
                    {currentPageData.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-300 hover:shadow-lg border-b-2 border-gray-200">
                            {Object.keys(item).map((key) => (
                                key === 'action' ? (
                                    <td key={key} className="px-4 py-3">
                                        <b>
                                            {Object.keys(item[key]).map((key1) => (item[key][key1]))}
                                        </b>
                                    </td>
                                ) : (
                                    <td key={key} className="px-4 py-3">{item[key]} </td>
                                )
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 cursor-pointer"
                    disabled={currentPage === 1}
                    onClick={() => goToPage(currentPage - 1)}
                >
                    Prev
                </button>
                <span className='p-5'>{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default TableComponent;
