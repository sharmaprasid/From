import React, { useState, useEffect } from "react";
import CreateUserForm from "./CreateUserForm";
import EditUserForm from "./EditUserForm";
import axios from "axios";

function ServiceForm() {
  const [availableServices, setAvailableServices] = useState([]);
  const [editUserId, setEditUserId] = useState(null);

  useEffect(() => {
    // Read the token from localStorage
    const token = localStorage.getItem("jwtToken");

    // Define a function to send the Axios request for decoding
    const decodeTokenAndSetUserId = async () => {
      try {
        if (token) {
          const response = await axios.post(
            "http://localhost:4000/api/decode-token",
            {}, // Send the token to your backend for decoding
            {
              headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
              },
            }
          );
          // Assuming your backend responds with a user ID
          const userId = response.data.userId;
          setEditUserId(userId);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };

    // Call the function to decode the token
    decodeTokenAndSetUserId();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 p-6 rounded-lg ">
        {editUserId ? (
          <EditUserForm userId={editUserId} />
        ) : (
          <CreateUserForm availableServices={availableServices} />
        )}
      </div>
    </div>
  );
}

export default ServiceForm;
