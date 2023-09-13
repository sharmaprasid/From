import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../utils/api";
import { toast } from "react-toastify";
import { editUserValidationSchema } from "./UserValidation";
import "react-toastify/dist/ReactToastify.css";

function EditUserForm({ userId }) {
  const [userData, setUserData] = useState({
    name: "",
    services: [],
    termsAccepted: false,
  });

  const [availableServices, setAvailableServices] = useState([]);

  useEffect(() => {
    api
      .get("/services")
      .then((response) => {
        setAvailableServices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
      });
  }, []);

  useEffect(() => {
    api
      .get(`/users/${userId}`)
      .then((response) => {
        const user = response.data;
        setUserData({
          ...userData,
          name: user.name,
          services: user.services,
          termsAccepted: user.termsAndCondition,
        });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editUserValidationSchema.validate(userData, { abortEarly: false });

      api
        .put(`/users/${userId}`, userData)
        .then((response) => {
          console.log("Data updated:", response.data);

          toast.success("Data updated successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
        })
        .catch((error) => {
          console.error("Error updating user:", error);
        });
    } catch (error) {
      // Handle validation errors and display toast messages
      error.inner.forEach((fieldError) => {
        toast.error(fieldError.message, {
          position: "top-right",
          autoClose: 3000,
        });
      });
    }
  };

  const handleServiceChange = (e) => {
    const selectedServices = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setUserData({
      ...userData,
      services: selectedServices,
    });
  };

  return (
    <div className="container mx-auto mt-8 p-4 max-w-lg bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Edit User</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            disabled // Disable editing the name
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Services:
          </label>
          <select
            multiple
            name="services"
            value={userData.services}
            onChange={handleServiceChange}
            required
            className="form-multiselect w-full"
          >
            {/* Map through available services and create options */}
            {availableServices.map((service) => (
              <optgroup
                label={service.serviceCategory}
                key={service.serviceCategory}
              >
                {service.serviceNames.map((serviceName) => (
                  <option key={serviceName} value={serviceName}>
                    {serviceName}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Terms and Conditions:
          </label>
          <input
            type="checkbox"
            checked={userData.termsAccepted}
            name="termsAccepted"
            onChange={handleInputChange}
            className="mr-2" // Optional: Add some styling
          />
          I accept the terms and conditions
        </div>
        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditUserForm;
