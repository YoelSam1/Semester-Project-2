const navbarLinks = document.querySelector("#navbarSupportedContent");

// Function to handle logout
function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("credits");
  localStorage.removeItem("name");
  localStorage.removeItem("email");
  localStorage.removeItem("avatar");

  window.location.href = "/";
}

// Construct navigation links based on user authentication status
function constructNavLinks(authenticated) {
  if (authenticated) {
    navbarLinks.innerHTML = `
      <ul class="navbar-nav me-auto mb-2 mb-lg-0 text-center d-flex align-items-center">
        <li class="nav-item">
          <a class="nav-link fw-bold ${window.location.pathname === "/" ? "active" : ""}" href="/">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link fw-bold ${window.location.pathname.toLowerCase() === "/profile" ? "active" : ""}" href="/profile">Profile</a>
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
    navbarLinks.innerHTML = `
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link fw-bold ${window.location.pathname === "/" ? "text-danger" : ""}" href="/">Home</a>
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
}

// Check if the user is authenticated
const accessToken = localStorage.getItem("accessToken");
const authenticated = accessToken !== null;

// Construct navigation links based on authentication status
constructNavLinks(authenticated);

document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname.toLowerCase().replace(/\/$/, "");

  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  navLinks.forEach(function (link) {
    const linkPath = link.getAttribute("href").toLowerCase().replace(/\/$/, "");
    if (linkPath === currentPath) {
      link.classList.add("text-danger");
    }
  });
});
