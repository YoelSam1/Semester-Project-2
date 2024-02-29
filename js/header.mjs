// header.mjs
const navbarLinks = document.querySelector("#navbarSupportedContent");

// Check if there is a stored user
const storedUser = localStorage.getItem("accessToken");

// Function to handle logout
function logout() {
  // Remove stored user data
  localStorage.removeItem("accessToken");
  localStorage.removeItem("credits");
  // Redirect to login page
  window.location.href = "/";
}

// If there is a stored user available, then set links
if (storedUser) {
  navbarLinks.innerHTML = `
    <ul class="navbar-nav me-auto mb-2 mb-lg-0 text-center d-flex align-items-center">
      <li class="nav-item">
        <a class="nav-link fw-bold ${window.location.pathname === "/" ? "active" : ""}" href="/">Home</a>
      </li>
      <li class="nav-item">
        <a class="nav-link fw-bold ${window.location.pathname.toLowerCase() === "/profile" ? "active" : ""}" href="/profile">Profile</a>
      </li>
      <li class="nav-item">
        <a class="nav-link fw-bold ${window.location.pathname.toLowerCase() === "/about" ? "active" : ""}" href="/about">About</a>
      </li>
    </ul>
    <ul class="navbar-nav ml-auto align-items-center"> 
      <li class="nav-item">
        <button type="button" class="btn btn-outline-danger fw-bold" id="logoutBtn">Logout</button> 
      </li>
    </ul>
  `;

  // Add event listener to logout button
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", logout);
} else {
  // If no stored user, show login and register links
  navbarLinks.innerHTML = `
    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
      <li class="nav-item">
        <a class="nav-link fw-bold ${window.location.pathname === "/" ? "text-danger" : ""}" href="/">Home</a>
      </li>
      <li class="nav-item">
        <a class="nav-link fw-bold ${window.location.pathname.toLowerCase() === "/about" ? "text-danger" : ""}" href="/about">About</a>
      </li>
    </ul>

    <ul class="navbar-nav ml-auto" id="authLinks">
      <li class="nav-item mb-2 ">
        <button type="button" class="btn btn-outline-success btn-sm fw-bold me-2" id="registerLink" data-bs-toggle="modal" data-bs-target="#registerModal">Register</button>
      </li>
      <li class="nav-item">
        <button type="button" class="btn btn-outline-primary btn-sm fw-bold" id="loginLink" data-bs-toggle="modal" data-bs-target="#loginModal">Login</button>
      </li>
    </ul>
  `;
}

document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname.toLowerCase().replace(/\/$/, ""); // Get current pathname without trailing slashes

  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  navLinks.forEach(function (link) {
    const linkPath = link.getAttribute("href").toLowerCase().replace(/\/$/, ""); // Get link href without trailing slashes
    if (linkPath === currentPath) {
      link.classList.add("text-danger"); // Add text-danger class to both Home and About links
    }
  });
});
