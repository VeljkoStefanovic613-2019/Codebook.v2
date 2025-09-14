import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { Search } from "../Sections/Search";
import { DropdownLoggedOut, DropdownLoggedIn } from "../index";
import { useCart } from "../../context";

export const Header = () => {
  const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem("darkMode")) || false);
  const [searchSection, setSearchSection] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  
  // Safe parsing with error handling
  const token = (() => {
    try { return JSON.parse(sessionStorage.getItem("token")); } 
    catch { return null; }
  })();

  const { cartList } = useCart();

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    
    if(darkMode){
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Close dropdown and search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside dropdown
      if (dropdown && !event.target.closest('#dropdownAvatar') && !event.target.closest('.dropdown-trigger')) {
        setDropdown(false);
      }
      
      // Check if click is outside search
      if (searchSection && !event.target.closest('.search-container') && !event.target.closest('.search-trigger')) {
        setSearchSection(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdown, searchSection]);

  return (
    <header>      
      <nav className="bg-white dark:bg-gray-900">
          <div className="border-b border-slate-200 dark:border-b-0 flex flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4 md:px-6 py-3">
              <Link to="/" className="flex items-center">
                  <img src={Logo} className="mr-3 h-10" alt="CodeBook Logo" />
                  <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">CodeBook</span>
              </Link>
              <div className="flex items-center relative">
                <span 
                  onClick={() => setDarkMode(!darkMode)} 
                  className={`cursor-pointer text-xl mr-5 ${darkMode ? "bi bi-sun text-yellow-400" : "bi bi-moon text-gray-700 dark:text-white"}`}
                ></span>
                  
                <span 
                  onClick={() => {
                    setSearchSection(!searchSection);
                    setDropdown(false);
                  }} 
                  className="cursor-pointer text-xl text-gray-700 dark:text-white mr-5 bi bi-search search-trigger"
                ></span>
                  
                  <Link to="/cart" className="text-gray-700 dark:text-white mr-5">
                    <span className="text-2xl bi bi-cart-fill relative">
                      <span className="text-white text-sm absolute -top-1 left-2.5 bg-rose-500 px-1 rounded-full ">{cartList.length}</span>
                    </span>                    
                  </Link>
                  <span 
                    onClick={() => {
                      setDropdown(!dropdown);
                      setSearchSection(false);
                    }} 
                    className="bi bi-person-circle cursor-pointer text-2xl text-gray-700 dark:text-white dropdown-trigger"
                  ></span>
                  { dropdown && ( token ? <DropdownLoggedIn setDropdown={setDropdown} /> : <DropdownLoggedOut setDropdown={setDropdown} /> ) }
              </div>
          </div>
      </nav>
      { searchSection && <Search setSearchSection={setSearchSection} /> }
    </header>
  )
}