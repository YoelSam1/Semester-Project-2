import { API_URL } from "./api_url.mjs";

document.addEventListener("DOMContentLoaded", function () {
  function updateAvatar() {
    const avatarURLInput = document.querySelector("#avatarURL");
    const newAvatarURL = avatarURLInput.value.trim();

    if (newAvatarURL) {
      const userName = localStorage.getItem("name");
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("Token is null or empty. Please log in again.");
        return;
      }

      //  API endpoint URL
      const baseURL = `${API_URL}/auction/profiles/${userName}/media`;

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

      fetch(baseURL, updateAvatarOption)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update avatar.");
          }
          return response.json();
        })
        .then((data) => {
          // localStorage
          localStorage.setItem("avatar", newAvatarURL);

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
      alert("Avatar URL cannot be empty.");
    }
  }

  const updateAvatarButton = document.querySelector("#updateAvatarButton");
  updateAvatarButton.addEventListener("click", updateAvatar);
});
