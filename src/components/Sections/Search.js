// Search.js - Updated to work with your header
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Search = ({ setSearchShow }) => {
    const navigate = useNavigate();
    const searchRef = useRef();
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (event) => {
        event.preventDefault();
        if (setSearchShow) setSearchShow(false);
        navigate(`/products?q=${searchRef.current.value}`);
    }

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    }

    const clearSearch = () => {
        setSearchTerm("");
        searchRef.current.value = "";
        if (setSearchShow) setSearchShow(false);
        navigate('/products');
    }

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md">
            <div className="mx-auto max-w-screen-xl p-4">
                <form onSubmit={handleSearch} className="flex items-center">   
                    <div className="relative w-full">
                        <span className="bi bi-search flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400"></span>
                        <input 
                            ref={searchRef} 
                            name="search" 
                            type="text" 
                            value={searchTerm}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Search eBooks by title, author, or category..." 
                            autoComplete="off" 
                            autoFocus
                        />
                        {searchTerm && (
                            <button 
                                type="button"
                                onClick={clearSearch}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <button 
                        type="submit" 
                        className="py-2.5 px-5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex items-center"
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Search
                    </button>
                    <button 
                        type="button"
                        onClick={() => setSearchShow(false)}
                        className="py-2.5 px-4 ml-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg border border-gray-200 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    )
}