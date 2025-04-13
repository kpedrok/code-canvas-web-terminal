
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuthStore } from "@/lib/auth-store";

export function Register() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <RegisterForm />
    </div>
  );
}

export default Register;
