const pengguna = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "Jajang", password: "jajangtea", role: "user" },
  { username: "Oman", password: "omans12", role: "user" },
];

const halamanTujuan = {
  admin: "dashboard_admin.html",
  user: "dashboard_user.html",
};

const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const errorUsername = document.getElementById("usernameError");
const errorPass = document.getElementById("passwordError");
const loginError = document.getElementById("loginError");

try {
  if (localStorage.getItem("daftar_pengguna") === null) {
    localStorage.setItem("daftar_pengguna", JSON.stringify(pengguna));
  }
} catch (error) {
  console.error("Gagal menginisialisasi data login:", error.message);
}

usernameInput.addEventListener("input", function () {
  errorUsername.textContent = "";
  loginError.textContent = "";
  usernameInput.classList.remove("is-invalid");
});

passwordInput.addEventListener("input", function () {
  errorPass.textContent = "";
  loginError.textContent = "";
  passwordInput.classList.remove("is-invalid");
});

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  errorUsername.textContent = "";
  errorPass.textContent = "";
  loginError.textContent = "";

  usernameInput.classList.remove("is-invalid");
  passwordInput.classList.remove("is-invalid");

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  try {
    let errors = {};

    if (username === "") {
      errors.username = "Maaf, username wajib diisi";
    }

    if (password === "") {
      errors.password = "Maaf, password wajib diisi";
    }

    const dataLogin = localStorage.getItem("daftar_pengguna");

    if (dataLogin === null) {
      throw new Error("Data akun tidak ditemukan di localStorage.");
    }

    const daftar = JSON.parse(dataLogin);
    let userDitemukan = null;

    if (username !== "" && password !== "") {
      userDitemukan = daftar.find((u) => u.username.toLowerCase() === username.toLowerCase());
      if (!userDitemukan) {
        errors.username = "Maaf, username salah";
      } else if (userDitemukan.password !== password) {
        errors.password = "Maaf, password salah";
      }
    }

    if (Object.keys(errors).length > 0) {
      let err = new Error("Validasi form gagal");
      err.errors = errors;
      throw err;
    }

    sessionStorage.setItem(
      "sesi_login",
      JSON.stringify({
        username: userDitemukan.username,
        role: userDitemukan.role,
      }),
    );

    localStorage.setItem('pengguna_login', JSON.stringify(userDitemukan));
    localStorage.setItem('peTIK_loggedUser', userDitemukan.username);
    
    window.location.href = halamanTujuan[userDitemukan.role];
  } catch (error) {
    if (error.errors) {
      if (error.errors.username) {
        errorUsername.textContent = error.errors.username;
        usernameInput.classList.add("is-invalid");
      }

      if (error.errors.password) {
        errorPass.textContent = error.errors.password;
        passwordInput.classList.add("is-invalid");
      }
    } else {
    console.error("Error tak terduga:", error.message);
      window.location.href = "blank.html";
    }
  }
});
