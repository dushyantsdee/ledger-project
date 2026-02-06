document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  // Agar token hi nahi hai
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  fetch("/api/auth/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Unauthorized");
      }
      return res.json();
    })
    .then(data => {
      // Safety check
      if (!data || !data.email || !data._id) {
        throw new Error("Invalid user data");
      }

      // HTML elements
      const emailEl = document.getElementById("email");
      const ownerIdEl = document.getElementById("ownerId");

      emailEl.innerText = data.email;
      ownerIdEl.innerText = data._id;
    })
    .catch(err => {
      console.error("Profile load error:", err);
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
});
