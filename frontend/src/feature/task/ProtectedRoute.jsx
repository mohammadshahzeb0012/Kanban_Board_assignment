import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Loader from "../loader/Loader";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = Cookies.get("token");
    setToken(storedToken);
    
    if (!storedToken) {
      navigate("/auth"); 
    }

    setLoading(false); 
  }, [navigate]);

  if (loading) {
    return <Loader /> 
  }

  if (!token) {
    return null; 
  }

  return children; 
};

export default ProtectedRoute;
