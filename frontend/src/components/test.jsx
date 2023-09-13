import React, { useState, useEffect } from "react";
import axios from "axios";

function ServiceForm() {
  const [formData, setFormData] = useState({
    name: "",
    services: [],
  });

  const [availableServices, setAvailableServices] = useState([]);

  const [termsAccepted, setTermsAccepted] = useState(false); // New state variable for checkbox

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/services")
      .then((response) => {
        console.log("Fetched services:", response.data);
        setAvailableServices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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

  const handleCategoryChange = (category) => {
    const categoryServices = availableServices.find(
      (service) => service.serviceCategory === category
    );

    if (categoryServices) {
      const allServicesInCategory = categoryServices.serviceNames;
      setFormData({
        ...formData,
        services: allServicesInCategory,
      });
    }
  };

  const handleTermsChange = () => {
    setTermsAccepted(!termsAccepted); // Toggle the checkbox status
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create an object to hold the user data including selected services and terms status
    const userData = {
      name: formData.name,
      services: formData.services,
      termsAndCondition: termsAccepted, // Include the checkbox status
    };

    // Send the userData to your API for user creation
    axios
      .post("http://localhost:4000/api/users", userData)
      .then((response) => {
        console.log("User created:", response.data);
      })
      .catch((error) => {
        console.error("Error creating user:", error);
      });
  };

  return (
    <div className="container mx-auto mt-8 p-4 max-w-lg bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Create User</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
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
            value={formData.services}
            onChange={handleServiceChange}
            required
            className="form-multiselect w-full"
          >
            {availableServices.map((service) => (
              <optgroup
                label={service.serviceCategory}
                key={service.serviceCategory}
              >
                <option
                  value={service.serviceCategory}
                  onClick={() => handleCategoryChange(service.serviceCategory)}
                >
                  {service.serviceCategory}
                </option>
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
            className="mr-2" // Optional: Add some styling
          />
          I accept the terms and conditions
        </div>
        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
          >
            Create User
          </button>
        </div>
      </form>
    </div>
  );
}

export default ServiceForm;
