import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";

export default function AuthForm({ isLogin, onSuccess }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useUser();

  const handleAuth = async () => {
    setLoading(true);
    try {
      const endpoint = isLogin
        ? "http://localhost:8080/api/users/login"
        : "http://localhost:8080/api/users/signup";
      
      const payload = isLogin
        ? { username, password }
        : { username, email, password };  // Include email in the signup payload

      const response = await axios.post(endpoint, payload);

      if (isLogin) {
        // Save user details to localStorage
        const userInfo = {
          token: response.data.token,
          id: response.data.id,
          username: response.data.username,
          role: response.data.role,
        };
        login(userInfo);

        // Call the success callback to close the modal
        if (onSuccess) onSuccess();

        // Refresh the page to update the Navbar
        router.refresh();
      } else {
        // If it's signup, show a success message
        alert("User registration successful! Please log in.");
        
        // Call the success callback to close the modal after signup
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "300px",
        margin: "auto",
      }}
    >
      <input
        type="text"
        placeholder="Username"
        value={username}
        required
        onChange={(e) => setUsername(e.target.value)}
        style={{
          padding: "0.5rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
          color: "#333",
        }}
      />

      {/* Conditionally render email input only for signup */}
      {!isLogin && (
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            color: "#333",
          }}
        />
      )}

      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          padding: "0.5rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
          color: "#333",
        }}
      />

      <button
        onClick={handleAuth}
        disabled={loading}
        style={{
          padding: "0.5rem",
          borderRadius: "4px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
        }}
      >
        {loading ? "Processing..." : isLogin ? "Login" : "Signup"}
      </button>
    </div>
  );
}
