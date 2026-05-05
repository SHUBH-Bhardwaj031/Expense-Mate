import React, { useState } from "react";
import { createUser } from "../services/UserService";
import { toast } from "react-toastify";
import GradientBackground from "../components/GradientBackground.jsx";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    age: "",
  });

  const [errors, setErrors] = useState([]);
  const [creating, setCreating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setCreating(true);
    setErrors([]);

    console.log("Form Submitted:", formData);
    // You can replace this with an API call
    try {
      const response = await createUser(formData);

      console.log(response);
      console.log("user created");

      toast.success("User is created Successfully..");

      setFormData({
        username: "",
        email: "",
        password: "",
        gender: "",
        age: "",
      });
      setCreating(false);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log(error.response.data);
        setErrors(error.response.data);
        toast.error("Validation error");
      } else if (error.status == 403) {
        toast.error("You dont have permission to create user.");
        console.log(error);
      } else {
        toast.error("Server error");
        console.log(error);
      }
      setCreating(false);
    }
  };

  return (
    <GradientBackground>
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Create Your Account
            </h2>
            <div className="py-3">
                {errors.length > 0 &&
                    errors.map((error) => (
                        <div className="p-2 border-red-300 mb-2 border rounded">
                            <p className="text-red-400">
                                {error.property.toUpperCase()}: {error.errorValue}
                            </p>
                        </div>
                    ))}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
                <div>
                    <label className="block text-gray-700 mb-1">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="Enter your name"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="you@example.com"
                        required
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="Enter a strong password"
                        required
                    />
                </div>

                {/* Gender */}
                <div>
                    <label className="block text-gray-700 mb-1">Gender</label>
                    <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={formData.gender === "male"}
                                onChange={handleChange}
                                className="text-indigo-600"
                            />
                            <span className="ml-2 text-gray-700">Male</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={formData.gender === "female"}
                                onChange={handleChange}
                                className="text-indigo-600"
                            />
                            <span className="ml-2 text-gray-700">Female</span>
                        </label>
                    </div>
                </div>

                {/* Age */}
                <div>
                    <label className="block text-gray-700 mb-1">Age</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="Your age"
                        required
                    />
                </div>

                {/* Submit */}
                <div>
                    <button
                        disabled={creating}
                        type="submit"
                        className="disabled:bg-gray-300  w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-300"
                    >
                        {/* {creating && <span className="animated-spin">icon</span>} */}
                        <span> {creating ? "Creating user.." : " Sign Up"}</span>
                    </button>
                </div>
            </form>
        </div>
    </GradientBackground>
  );
};

export default Signup;
