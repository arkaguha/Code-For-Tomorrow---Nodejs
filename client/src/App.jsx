import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./app.css";

function App() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [isSuccessful, setIsSuccessful] = useState(false);
  const { resetToken } = useParams();
  const [response, setResponse] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:3000/user/password/${resetToken}`,
        formData
      );
      setResponse(response.data.message);
      console.log(response);

      setFormData({ password: "", confirmPassword: "" });
      setIsSuccessful(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {isSuccessful ? (
        <h5>{response}</h5>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <label>Reset Password</label>
          <br />

          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={formData.password}
            onChange={handleFormInput}
          />
          <br />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleFormInput}
          />
          <br />

          <button type="submit">Submit</button>
        </form>
      )}
    </>
  );
}

export default App;
