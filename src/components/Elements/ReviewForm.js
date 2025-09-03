import { useState } from "react";
import { Rating } from "./Rating";
import { toast } from "react-toastify";

export const ReviewForm = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    const token = JSON.parse(sessionStorage.getItem("token"));
    const userId = JSON.parse(sessionStorage.getItem("cbid"));
    const userName = JSON.parse(sessionStorage.getItem("name"));
    
    if (!token || !userId) {
      toast.error("Please login to submit a review");
      return;
    }
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // First, get the current product to access its reviews
      const productResponse = await fetch(`${process.env.REACT_APP_HOST}/444/products/${productId}`);
      if (!productResponse.ok) {
        throw new Error("Failed to fetch product details");
      }
      const product = await productResponse.json();
      
      // Create the new review
      const newReview = {
        id: Date.now(), // Simple ID generation
        userId: userId,
        userName: userName,
        rating: rating,
        comment: comment,
        date: new Date().toISOString()
      };
      
      // Add the review to the product's reviews array
      const updatedReviews = [...(product.reviews || []), newReview];
      
      // Update the product with the new reviews
      const updateResponse = await fetch(`${process.env.REACT_APP_HOST}/660/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          reviews: updatedReviews
        })
      });
      
      if (!updateResponse.ok) {
        throw new Error("Failed to submit review");
      }
      
      const updatedProduct = await updateResponse.json();
      onReviewAdded(updatedProduct);
      setRating(0);
      setComment("");
      toast.success("Review submitted successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user is logged in
  const isLoggedIn = sessionStorage.getItem("token");

  if (!isLoggedIn) {
    return (
      <div className="my-4 p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600">Please login to leave a review</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="my-4 p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Add Your Review</h3>
      
      <div className="mb-3">
        <label className="block mb-1">Rating</label>
        <Rating 
          rating={rating} 
          onRatingChange={setRating}
          editable={true}
        />
      </div>
      
      <div className="mb-3">
        <label className="block mb-1">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border rounded"
          rows="3"
          placeholder="Share your experience with this product"
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};