
  export const loginUser = async (email: string, password: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Invalid credentials");
    }
  
    const data = await response.json();
    if (data.role_id !== 1) { // Ensure role_id is 1 for System Admin
      throw new Error("Access denied. Admins only.");
    }
  
    return data; // Includes accessToken, refreshToken, and role_id
  };
  