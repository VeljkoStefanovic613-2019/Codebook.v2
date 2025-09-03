import { useEffect, useState } from "react"
import { Rating, ReviewForm } from "../components";
import { useParams } from "react-router-dom";
import { useTitle } from "../hooks/useTitle";
import { useCart } from "../context";
import { getProduct } from "../services";
import { toast } from "react-toastify";

export const ProductDetail = () => {
  const { cartList, addToCart, removeFromCart } = useCart();
  const [inCart, setInCart] = useState(false);
  const [product, setProduct] = useState({});
  const { id } = useParams();
  useTitle(product.name);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (error) {
        toast.error(error.message, { 
          closeButton: true,
          position: "bottom-center",
          autoClose: 5000,
          closeOnClick: true
        });
      }
    }
    fetchProducts();
  }, [id]);

  useEffect(() => {
    const productInCart = cartList.find(item => item.id === product.id);
    setInCart(!!productInCart);
  }, [cartList, product.id]);

  const handleReviewAdded = (updatedProduct) => {
    setProduct(updatedProduct);
  };

  // Calculate average rating from reviews if available
  const calculateAverageRating = () => {
    if (product.reviews && product.reviews.length > 0) {
      const total = product.reviews.reduce((sum, review) => sum + review.rating, 0);
      return total / product.reviews.length;
    }
    return product.rating || 0;
  };

  const averageRating = calculateAverageRating();

  return (
    <main>
      <section>
        <h1 className="mt-10 mb-5 text-4xl text-center font-bold text-gray-900 dark:text-slate-200">
          {product.name}
        </h1>
        <p className="mb-5 text-lg text-center text-gray-900 dark:text-slate-200">
          {product.overview}
        </p>
        
        <div className="flex flex-wrap justify-around">
          <div className="max-w-xl my-3">
            <img className="rounded" src={product.poster} alt={product.name} />
          </div>
          
          <div className="max-w-xl my-3">
            <p className="text-3xl font-bold text-gray-900 dark:text-slate-200">
              <span className="mr-1">$</span>
              <span className="">{product.price}</span>
            </p>
            
            <p className="my-3">
              <span>
                <Rating rating={averageRating} />
                <span className="ml-2 text-sm text-gray-600">
                  ({product.reviews ? product.reviews.length : 0} reviews)
                </span>
              </span>
            </p>
            
            <p className="my-4 select-none">
              {product.best_seller && <span className="font-semibold text-amber-500 border bg-amber-50 rounded-lg px-3 py-1 mr-2">BEST SELLER</span> }   
              
              {product.in_stock ? (
                <span className="font-semibold text-emerald-600	border bg-slate-100 rounded-lg px-3 py-1 mr-2">INSTOCK</span>
              ) : (
                <span className="font-semibold text-rose-700 border bg-slate-100 rounded-lg px-3 py-1 mr-2">OUT OF STOCK</span>
              ) }
 
              <span className="font-semibold text-blue-500 border bg-slate-100 rounded-lg px-3 py-1 mr-2">{product.size} MB</span>
            </p>
            
            <p className="my-3">
              {!inCart && <button onClick={() => addToCart(product)} className={`inline-flex items-center py-2 px-5 text-lg font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 ${product.in_stock ? "" : "cursor-not-allowed"}`} disabled={ product.in_stock ? "" : "disabled" } >Add To Cart <i className="ml-1 bi bi-plus-lg"></i></button> }
              {inCart && <button onClick={() => removeFromCart(product)} className={`inline-flex items-center py-2 px-5 text-lg font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800`}  disabled={ product.in_stock ? "" : "disabled" }>Remove Item <i className="ml-1 bi bi-trash3"></i></button> }
            </p>
            
            <p className="text-lg text-gray-900 dark:text-slate-200 whitespace-pre-wrap break-words">
              {product.long_description}
            </p>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="max-w-4xl mx-auto my-8">
          <h2 className="text-2xl dark:text-white  font-bold mb-4">Customer Reviews</h2>
          
          <ReviewForm 
            productId={product.id} 
            onReviewAdded={handleReviewAdded} 
          />
          
          {product.reviews && product.reviews.length > 0 ? (
            <div className="mt-6">
              {product.reviews.map((review) => (
                <div key={review.id} className="border-b py-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold dark:text-white">{review.userName}</h4>
                    <span className="text-sm text-gray-500 dark:text-white">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <Rating rating={review.rating} />
                  <p className="mt-2 dark:text-white">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic dark:text-white">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </section>
    </main> 
  );
};