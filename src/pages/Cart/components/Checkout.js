import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context";
import { createOrder, getUser } from "../../../services";

export const Checkout = ({ setCheckout }) => {
  const { cartList, total, clearCart } = useCart();
  const [user, setUser] = useState({});
  const [payment, setPayment] = useState({
    cardNumber: "",
    month: "",
    year: "",
    cvv: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const data = await getUser();
      setUser(data);
    }
    fetchData();
  }, []);

  function handlePaymentChange(e) {
    const { name, value } = e.target;
    setPayment(prev => ({ ...prev, [name]: value }));
  }

  async function handleOrderSubmit(event) {
    event.preventDefault();

    try {
      // You might want to send `payment` details to your API too
      const data = await createOrder(cartList, total, user);
      clearCart();
      navigate("/order-summary", { state: { data: data, status: true } });
    } catch (error) {
      navigate("/order-summary", { state: { status: false } });
    }
  }

  return (
    <section>
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>
      <div
        id="authentication-modal"
        tabIndex="-1"
        className="mt-5 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full justify-center items-center flex"
        aria-modal="true"
        role="dialog"
      >
        <div className="relative p-4 w-full max-w-md h-full md:h-auto overflow-y-auto">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              onClick={() => setCheckout(false)}
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="py-6 px-6 lg:px-8">
              <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                <i className="bi bi-credit-card mr-2"></i>CARD PAYMENT
              </h3>
              <form onSubmit={handleOrderSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Name:
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    value={user.name || ""}
                    disabled
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Email:
                  </label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    value={user.email || ""}
                    disabled
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label
                    htmlFor="cardNumber"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Card Number:
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    id="cardNumber"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    value={payment.cardNumber}
                    onChange={handlePaymentChange}
                    required
                  />
                </div>

                {/* Expiry Date */}
                <div className="flex space-x-3">
                  <div>
                    <label
                      htmlFor="month"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Expiry Month:
                    </label>
                    <input
                      type="text"
                      name="month"
                      id="month"
                      placeholder="MM"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-20 p-2.5"
                      value={payment.month}
                      onChange={handlePaymentChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="year"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Expiry Year:
                    </label>
                    <input
                      type="text"
                      name="year"
                      id="year"
                      placeholder="YY"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-20 p-2.5"
                      value={payment.year}
                      onChange={handlePaymentChange}
                      required
                    />
                  </div>
                </div>

                {/* CVV */}
                <div>
                  <label
                    htmlFor="cvv"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Security Code (CVV):
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    id="cvv"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    value={payment.cvv}
                    onChange={handlePaymentChange}
                    required
                  />
                </div>

                {/* Total */}
                <p className="mb-4 text-2xl font-semibold text-lime-500 text-center">
                  ${total}
                </p>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  <i className="mr-2 bi bi-lock-fill"></i>PAY NOW
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
