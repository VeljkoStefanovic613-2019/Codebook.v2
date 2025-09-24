function getSession() {
  // Safe parsing with fallback to null
  const token = safeParse(sessionStorage.getItem("token"));
  const cbid = safeParse(sessionStorage.getItem("cbid"));

  return { token, cbid };
}

// Helper function for safe JSON parsing
function safeParse(item) {
  try {
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Failed to parse session storage item:", error);
    return null;
  }
}

export async function getUser() {
  const browserData = getSession();

  if (!browserData.token || !browserData.cbid) {
    const error = new Error("Authentication required. Please login again.");
    error.status = 401;
    throw error;
  }

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${browserData.token}`,
    },
  };

  const response = await fetch(
    `${process.env.REACT_APP_HOST}/600/users/${browserData.cbid}`,
    requestOptions
  );

  if (!response.ok) {
    if (response.status === 401) {
      clearSession();
    }
    const error = new Error(response.statusText);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export async function getUserOrders() {
  const browserData = getSession();

  if (!browserData.token || !browserData.cbid) {
    const error = new Error("Authentication required. Please login again.");
    error.status = 401;
    throw error;
  }

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${browserData.token}`,
    },
  };

  const response = await fetch(
    `${process.env.REACT_APP_HOST}/660/orders?user.id=${browserData.cbid}`,
    requestOptions
  );

  if (!response.ok) {
    if (response.status === 401) {
      clearSession();
    }
    const error = new Error(response.statusText);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export async function createOrder(cartList, total, user) {
  const browserData = getSession();

  if (!browserData.token) {
    const error = new Error("Authentication required. Please login again.");
    error.status = 401;
    throw error;
  }

  const order = {
    cartList,
    amount_paid: total,
    quantity: cartList.length,
    user: {
      name: user.name,
      email: user.email,
      id: user.id,
    },
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${browserData.token}`,
    },
    body: JSON.stringify(order),
  };

  const response = await fetch(
    `${process.env.REACT_APP_HOST}/660/orders`,
    requestOptions
  );

  if (!response.ok) {
    if (response.status === 401) {
      clearSession();
    }
    const error = new Error(response.statusText);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

// Utility to clear invalid session
function clearSession() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("cbid");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("name");
}
