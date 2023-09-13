import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUserValidationSchema } from "./UserValidation";

function CreateUserForm() {
  const [formData, setFormData] = useState({
    name: "",
    services: [],
  });

  const [availableServices, setAvailableServices] = useState([]);

  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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

  const handleServiceChange = (e) => {
    const selectedServices = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setFormData({
      ...formData,
      services: selectedServices,
    });
  };

  const handleTermsChange = () => {
    setTermsAccepted(!termsAccepted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUserValidationSchema.validate(formData, {
        abortEarly: false,
      });
      const userData = {
        name: formData.name,
        services: formData.services,
        termsAndCondition: termsAccepted,
      };

      api
        .post("/users", userData)
        .then((response) => {
          localStorage.setItem("jwtToken", response.data.token);
          setFormData({
            name: "",
            services: [],
          });
          setTermsAccepted(false);

          // Show a success toast message
          toast.success("Data Recorded successfully!", {
            position: "top-right",
            autoClose: 3000, // Close the toast after 3 seconds
          });
        })
        .catch((error) => {
          console.error("Error creating user:", error);
        });
    } catch (error) {
      // Handle validation errors and display toast messages
      error.inner.forEach((fieldError) => {
        toast.error(fieldError.message, {
          position: "top-right",
          autoClose: 3000, // Close the toast after 3 seconds
        });
      });
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4 max-w-lg bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">
        Please enter your name and pick the Sectors you are currently involved
        in.
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name:
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Services:
          </label>
          <select
            multiple
            name="services"
            value={formData.services}
            onChange={handleServiceChange}
            className="form-multiselect w-full"
          >
            {availableServices.map((service) => (
              <optgroup
                label={service.serviceCategory}
                key={service.serviceCategory}
                className="font-semibold"
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
            checked={termsAccepted}
            onChange={handleTermsChange}
            className="mr-2"
          />
          I accept the terms and conditions
        </div>
        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateUserForm;
