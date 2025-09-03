export const Rating = ({ rating, onRatingChange, editable = false }) => {
  let ratingArray = Array(5).fill(false);
  for (let i = 0; i < rating; i++) {
    ratingArray[i] = true;
  }

  const handleClick = (index) => {
    if (editable && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <>
      {ratingArray.map((value, index) => (
        editable ? (
          <i 
            key={index} 
            className={`text-lg bi ${value ? 'bi-star-fill' : 'bi-star'} text-yellow-500 mr-1 cursor-pointer`}
            onClick={() => handleClick(index)}
          ></i>
        ) : (
          value ? (
            <i key={index} className="text-lg bi bi-star-fill text-yellow-500 mr-1"></i>
          ) : (
            <i key={index} className="text-lg bi bi-star text-yellow-500 mr-1"></i>
          )
        )
      ))}
    </>
  );
};