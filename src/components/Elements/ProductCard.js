import { Link } from "react-router-dom";
import { Rating } from "./Rating";
import { useCart } from "../../context";
import { useEffect, useState } from "react";

export const ProductCard = ({product}) => {
    const { cartList, addToCart, removeFromCart } = useCart();
    const {id, name, overview, poster, price, best_seller} = product;
    const [inCart, setInCart] = useState(false);
    const displayPoster = poster || product.image_local;
    const safeName = name || "Untitled Course";
    const safeOverview = overview || "";
    const safePrice = Number(price ?? 0);
    const inStock = (product.in_stock === undefined) ? true : product.in_stock;

    // Calculate average rating from reviews if available
    const calculateAverageRating = () => {
        if (product.reviews && product.reviews.length > 0) {
            const total = product.reviews.reduce((sum, review) => sum + review.rating, 0);
            return total / product.reviews.length;
        }
        return product.rating || 0;
    };

    const averageRating = calculateAverageRating();

    useEffect(() => {
        const productInCart = cartList.find(item => item.id === product.id);
        setInCart(!!productInCart);
    }, [cartList, product.id]);

    return (
      <div className="m-3 w-80 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
          <Link to={`/products/${id}`} className="relative" >
              {best_seller && <span className="absolute top-4 left-2 px-2 bg-orange-500 bg-opacity-90 text-white rounded">Best Seller</span> }
              <img className="rounded-t-lg w-full h-64 object-cover" src={displayPoster} alt={safeName} />
          </Link>
          <div className="p-5">
              <Link to={`/products/${id}`}>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{safeName}</h5>
              </Link>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{safeOverview}</p>
              
              <div className="flex items-center my-2">
                  <Rating rating={averageRating} />  
                  {product.reviews && (
                    <span className="ml-2 text-sm text-gray-600">
                        ({product.reviews.length})
                    </span>
                  )}
               </div>
  
              <p className="flex justify-between items-center">
                  <span className="text-2xl dark:text-gray-200">
                      <span>$</span><span>{safePrice}</span>
                  </span>
                  {!inCart && <button onClick={() => addToCart(product)} className={`inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 ${inStock ? "" : "cursor-not-allowed"} `} disabled={!inStock}>Add To Cart <i className="ml-1 bi bi-plus-lg"></i></button> }
                  { inCart && <button onClick={() => removeFromCart(product)} className={`inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800`} disabled={!inStock}>Remove Item <i className="ml-1 bi bi-trash3"></i></button> }
              </p>
          </div>
      </div>
    );
};