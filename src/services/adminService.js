function getSession(){
    const token = JSON.parse(sessionStorage.getItem("token"));
    return { token };
}

// Orders
export async function adminGetAllOrders(){
    const { token } = getSession();
    const response = await fetch(`${process.env.REACT_APP_HOST}/api/orders`, {
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : undefined }
    });
    if(!response.ok){
        throw { message: response.statusText, status: response.status };//eslint-disable-line
    }
    return await response.json();
}

export async function adminGetAllProducts(){
    const response = await fetch(`${process.env.REACT_APP_HOST}/api/products`);
    if(!response.ok){
        throw { message: response.statusText, status: response.status };//eslint-disable-line
    }
    return await response.json();
}

// Users via open /api route to bypass 600 rule
export async function adminGetAllUsers(){
    const response = await fetch(`${process.env.REACT_APP_HOST}/api/users`);
    if(!response.ok){
        throw { message: response.statusText, status: response.status };//eslint-disable-line
    }
    return await response.json();
}

export async function adminDeleteUser(userId){
    const response = await fetch(`${process.env.REACT_APP_HOST}/api/users/${userId}`, { method: "DELETE" });
    if(!response.ok){
        throw { message: response.statusText, status: response.status };//eslint-disable-line
    }
    return true;
}

// Reviews collection (requires reviews in db.json). Falls back gracefully if missing
export async function adminGetAllReviews(){
    const response = await fetch(`${process.env.REACT_APP_HOST}/api/reviews`);
    if(response.status === 404){
        return [];
    }
    if(!response.ok){
        throw { message: response.statusText, status: response.status };//eslint-disable-line
    }
    return await response.json();
}

export async function adminCreateReview(review){
    const response = await fetch(`${process.env.REACT_APP_HOST}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review)
    });
    if(!response.ok){
        throw { message: response.statusText, status: response.status };//eslint-disable-line
    }
    return await response.json();
}

export async function adminDeleteReview(id){
    const response = await fetch(`${process.env.REACT_APP_HOST}/api/reviews/${id}`, { method: "DELETE" });
    if(!response.ok){
        throw { message: response.statusText, status: response.status };//eslint-disable-line
    }
    return true;
}

