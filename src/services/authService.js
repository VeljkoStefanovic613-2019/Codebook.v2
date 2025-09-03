export async function login(authDetail){
    const requestOptions = {
        method: "POST",
        headers: {"content-Type": "application/json"},
        body: JSON.stringify(authDetail)
      }
  
      const response = await fetch(`${process.env.REACT_APP_HOST}/login`, requestOptions);
      if(!response.ok){
        throw { message: response.statusText, status: response.status }; //eslint-disable-line
    }
      const data = await response.json();
      
      if(data.accessToken){
        sessionStorage.setItem("token", JSON.stringify(data.accessToken));
        sessionStorage.setItem("cbid", JSON.stringify(data.user.id));
        if(data.user?.role){
          sessionStorage.setItem("role", JSON.stringify(data.user.role));
        }
        if(data.user?.name){
          sessionStorage.setItem("name", JSON.stringify(data.user.name));
        }
      }

      return data;
}
export async function register(authDetail){
    const requestOptions = {
        method: "POST",
        headers: {"content-Type": "application/json"},
        body: JSON.stringify(authDetail)
      }
  
      const response = await fetch(`${process.env.REACT_APP_HOST}/register`, requestOptions);
      if(!response.ok){
        throw { message: response.statusText, status: response.status }; //eslint-disable-line
    }
      const data = await response.json();
     
      
      if(data.accessToken){
        sessionStorage.setItem("token", JSON.stringify(data.accessToken));
        sessionStorage.setItem("cbid", JSON.stringify(data.user.id));
        if(data.user?.role){
          sessionStorage.setItem("role", JSON.stringify(data.user.role));
        }
        if(data.user?.name){
          sessionStorage.setItem("name", JSON.stringify(data.user.name));
        }
      }
      return data;
}
export function logout(){
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("cbid");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("name");
}