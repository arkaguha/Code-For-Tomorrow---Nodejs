import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isSuccessfull, setIsSuccessful] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/user/password/reset", formData);
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      setIsSuccessful(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormInput = (e) => {
    let { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {isSuccessfull ? (
        <h5>Password Reset Successfull</h5>
      ) : (
        <form action="" onSubmit={handleFormSubmit}>
          <label htmlFor="">Reset Password</label>
          <br />
          <input
            type="text"
            name="newPassword"
            id=""
            placeholder="New Password"
            value={formData.password}
            onChange={handleFormInput}
          />
          <br />
          <input
            type="text"
            name="ConfirmPassword"
            id=""
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleFormInput}
          />
          <br />
          <button>Submit</button>
        </form>
      )}
    </>
  );
}

export default App;
