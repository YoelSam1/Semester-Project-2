// Function to display user avatar
function showUserAvatar() {
  const userAvatarContainer = document.querySelector("#user-avatar-container");
  const userAvatar = localStorage.getItem("avatar");

  if (!userAvatar || userAvatar === "null") {
    userAvatarContainer.innerHTML = `  <img src="/assets/sample-image.png" class="rounded-circle border border-info styled-image" id="profile-avatar" >`;
  } else {
    userAvatarContainer.innerHTML = ` <img src="${userAvatar}" class="rounded-circle border border-info styled-image img-thumbnail img-fluid" id="profile-avatar" alt="" width="150" height="150">`;
  }
}
showUserAvatar();

// Function to display user information
function showUserInfo() {
  const userName = localStorage.getItem("name");
  const userEmail = localStorage.getItem("email");
  const userCredits = localStorage.getItem("credits");

  const userProfileInfo = document.querySelector("#user-profile-info");
  userProfileInfo.innerHTML = `
    <p class="text-center" id="user-name"><b>Name: </b>${userName}</p>
    <p class="text-center" id="user-email"><b>Email: </b>${userEmail}</p>  
    <p class="text-center" id="user-credits"><b>Credits: </b>${userCredits}</p>  
  `;
}
showUserInfo();
