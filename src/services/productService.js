export async function getProductList(searchTerm){
    const response = await fetch(`${process.env.REACT_APP_HOST}/444/products?name_like=${searchTerm ? searchTerm : ""}`);
    if(!response.ok){
        throw { message: response.statusText, status: response.status };//eslint-disable-line
    }
    const data = await response.json()
    return data;  
}

export async function getProduct(id){
    const response = await fetch(`${process.env.REACT_APP_HOST}/444/products/${id}`);
    if(!response.ok){
        throw { message: response.statusText, status: response.status };//eslint-disable-line
    }
    const data = await response.json();
    return data;

}

export async function getFeaturedList(){
    const response = await fetch(`${process.env.REACT_APP_HOST}/444/featured_products`);
    if(!response.ok){
        throw { message: response.statusText, status: response.status };//eslint-disable-line
    }
    const data = await response.json()
    return data;
}

function getSession(){
    const token = JSON.parse(sessionStorage.getItem("token"));
    return { token };
}

export async function createProduct(product){
    const { token } = getSession();
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(product)
    };
    // Use open mirror to avoid auth 403, same router instance
    const response = await fetch(`${process.env.REACT_APP_HOST}/api/products`, requestOptions);
    if(!response.ok){
        throw { message: response.statusText, status: response.status };//eslint-disable-line
    }
    const data = await response.json();
    return data;
}

export async function updateProduct(id, product){
    const { token } = getSession();
    const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(product)
    };
    // Use open mirror to avoid auth 403, same router instance
    const response = await fetch(`${process.env.REACT_APP_HOST}/api/products/${id}`, requestOptions);
    if(!response.ok){
        throw { message: response.statusText, status: response.status };//eslint-disable-line
    }
    const data = await response.json();
    return data;
}

export async function deleteProduct(id){
    // Use open router path to avoid auth 403 issues
    const response = await fetch(`${process.env.REACT_APP_HOST}/api/products/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    });
    if(!response.ok){
        throw { message: response.statusText, status: response.status };//eslint-disable-line
    }
    return true;
}