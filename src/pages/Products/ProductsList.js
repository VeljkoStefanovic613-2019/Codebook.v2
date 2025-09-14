// ProductsList.js - Enhanced with better search handling
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTitle } from "../../hooks/useTitle";
import { useFilter } from "../../context";
import { ProductCard } from "../../components";
import { FilterBar } from "./components/FilterBar";
import { getProductList } from "../../services";
import { toast } from "react-toastify";

export const ProductsList = () => {
  const { products, initialProductList } = useFilter();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const search = useLocation().search;
  const searchTerm = new URLSearchParams(search).get("q");
  useTitle("Explore eBooks Collection");
 
  useEffect(() => {
    async function fetchProducts(){
      try{
        setLoading(true);
        const data = await getProductList(searchTerm);
        initialProductList(data);
      } catch(error) {
        toast.error(error.message, { 
          closeButton: true,
          position: "bottom-center",
          autoClose: 5000,
          closeOnClick: true
        });
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [searchTerm]); //eslint-disable-line

  return (
    <main>
        <section className="my-5">
          <div className="my-5 flex justify-between">
            <div>
              <span className="text-2xl font-semibold dark:text-slate-100 mb-5">
                {searchTerm ? `Search Results for "${searchTerm}"` : 'All eBooks'} ({products.length})
              </span>
              {searchTerm && (
                <button 
                  onClick={() => window.location.href = '/products'}
                  className="ml-4 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Clear search
                </button>
              )}
            </div>
            <span>
              <button onClick={() => setShow(!show)} id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots" className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-700" type="button"> 
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
              </button>
            </span>            
          </div>    

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No eBooks found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm 
                  ? `No results found for "${searchTerm}". Try different keywords.`
                  : 'There are currently no eBooks available.'}
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center lg:flex-row">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}            
            </div>
          )}
        </section>

        {show && <FilterBar setShow={setShow} />}
    </main> 
  );
};