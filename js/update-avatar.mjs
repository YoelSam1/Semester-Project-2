import { API_URL } from "./api_url.mjs";

document.addEventListener("DOMContentLoaded", function () {
  // Function to update user avatar
  function updateAvatar() {
    const avatarURLInput = document.querySelector("#avatarURL");
    const newAvatarURL = avatarURLInput.value.trim();

    // Check if the input value is not empty
    if (newAvatarURL) {
      const userName = localStorage.getItem("name");
      const token = localStorage.getItem("accessToken");

      // Check if token is null or empty
      if (!token) {
        console.error("Token is null or empty. Please log in again.");
        return;
      }

      // Construct the API endpoint URL
      const baseURL = `${API_URL}/auction/profiles/${userName}/media`;

      // Define options for updating avatar
      const updateAvatarOption = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          avatar: newAvatarURL,
        }),
      };

      // Send PUT request to update avatar
      fetch(baseURL, updateAvatarOption)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update avatar.");
          }
          return response.json();
        })
        .then((data) => {
          // Save the new avatar URL in localStorage
          localStorage.setItem("avatar", newAvatarURL);

          // Update the avatar in the UI
          const userAvatarContainer = document.querySelector(
            "#user-avatar-container"
          );
          userAvatarContainer.innerHTML = `<img src="${newAvatarURL}" class="rounded-circle border border-info styled-image img-thumbnail img-fluid" id="profile-avatar" alt="" width="150" height="150">`;
          alert("Avatar updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating avatar:", error.message);
          alert("Failed to update avatar. Please try again.");
        });
    } else {
      // Display an error if the input field is empty
      alert("Avatar URL cannot be empty.");
    }
  }

  // Attach the updateAvatar function to the button click event
  const updateAvatarButton = document.querySelector("#updateAvatarButton");
  updateAvatarButton.addEventListener("click", updateAvatar);
});
