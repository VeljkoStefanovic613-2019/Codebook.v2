function getSession(){
    // Safe parsing with fallback to null
    const token = safeParse(sessionStorage.getItem("token"));
    const cbid = safeParse(sessionStorage.getItem("cbid"));

    return {token, cbid};
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

export async function getUser(){
    const browserData = getSession();
    
    // Check if token and user ID exist
    if (!browserData.token || !browserData.cbid) {
        throw { 
            message: "Authentication required. Please login again.", 
            status: 401 
        }; //eslint-disable-line
    }
    
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json", 
            Authorization: `Bearer ${browserData.token}`
        }
    }

    const response = await fetch(`${process.env.REACT_APP_HOST}/600/users/${browserData.cbid}`, requestOptions);
    
    if (!response.ok) {
        // If unauthorized, clear invalid session data
        if (response.status === 401) {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("cbid");
            sessionStorage.removeItem("role");
            sessionStorage.removeItem("name");
        }
        throw { 
            message: response.statusText, 
            status: response.status 
        };//eslint-disable-line
    }
    
    const data = await response.json();
    return data;
}

// Also update your other functions with the same validation
export async function getUserOrders(){
    const browserData = getSession();
    
    if (!browserData.token || !browserData.cbid) {
        throw { 
            message: "Authentication required. Please login again.", 
            status: 401 
        }; //eslint-disable-line
    }
    
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json", 
            Authorization: `Bearer ${browserData.token}`
        }
    }

    const response = await fetch(`${process.env.REACT_APP_HOST}/660/orders?user.id=${browserData.cbid}`, requestOptions);
    
    if (!response.ok) {
        if (response.status === 401) {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("cbid");
            sessionStorage.removeItem("role");
            sessionStorage.removeItem("name");
        }
        throw { 
            message: response.statusText, 
            status: response.status 
        };  //eslint-disable-line
    }
    
    const data = await response.json();
    return data;
}

export async function createOrder(cartList, total, user){
    const browserData = getSession();
    
    if (!browserData.token) {
        throw { 
            message: "Authentication required. Please login again.", 
            status: 401 
        }; //eslint-disable-line
    }
    
    const order = {
        cartList: cartList,
        amount_paid: total,
        quantity: cartList.length,
        user: {
            name: user.name,
            email: user.email,
            id: user.id
        }
    }
    
    const requestOptions = {
        method: "POST",
        headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${browserData.token}` 
        },
        body: JSON.stringify(order)
    }
    
    const response = await fetch(`${process.env.REACT_APP_HOST}/660/orders`, requestOptions);
    
    if (!response.ok) {
        if (response.status === 401) {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("cbid");
            sessionStorage.removeItem("role");
            sessionStorage.removeItem("name");
        }
        throw { 
            message: response.statusText, 
            status: response.status 
        }; //eslint-disable-line
    }
    
    const data = await response.json();
    return data;
}