const form = document.getElementById("formPengadaan");

const namaPemohon = document.getElementById("formNama");
const namaBarang = document.getElementById("formBarang");
const jumlahBarang = document.getElementById("formJumlah");
const tanggalPengajuan = document.getElementById("formTanggal");
const alasanPengadaan = document.getElementById("formAlasan");

const errorPemohon = document.getElementById("pemohonError");
const errorBarang = document.getElementById("barangError");
const errorJumlah = document.getElementById("jumlahError");
const errorTanggal = document.getElementById("tanggalError");
const errorAlasan = document.getElementById("alasanError");

const penggunaNav = document.getElementById("pengguna");

let dataPengadaan = [];

// Status default diubah menjadi "Pending"
const statusDefault = "Pending";

// Mengisi Nama & Tanggal Otomatis saat Halaman Dimuat
function initAutoFill() {
  let loggedInUser = localStorage.getItem("peTIK_loggedUser");
  if (!loggedInUser) {
    const userObj = JSON.parse(localStorage.getItem("pengguna_login"));
    loggedInUser = userObj ? userObj.username : "User Login";
  }

  if (namaPemohon) {
    namaPemohon.value = loggedInUser;
    namaPemohon.readOnly = true;
  }

  if (penggunaNav) {
    penggunaNav.textContent = loggedInUser;
  }

  if (tanggalPengajuan) {
    const today = new Date().toISOString().split("T")[0];
    tanggalPengajuan.value = today;
  }
}

function resetForm() {
  namaBarang.value = "";
  jumlahBarang.value = "";
  alasanPengadaan.value = "";
  initAutoFill();
}

// Inisialisasi awal
initAutoFill();

function clearErrors() {
  namaPemohon.classList.remove("is-invalid");
  namaBarang.classList.remove("is-invalid");
  jumlahBarang.classList.remove("is-invalid");
  tanggalPengajuan.classList.remove("is-invalid");
  alasanPengadaan.classList.remove("is-invalid");

  errorPemohon.textContent = "";
  errorBarang.textContent = "";
  errorJumlah.textContent = "";
  errorTanggal.textContent = "";
  errorAlasan.textContent = "";
}

// Fungsi untuk menghapus pesan error saat input berubah & efek feedback visual sederhana
[
  namaPemohon,
  namaBarang,
  jumlahBarang,
  tanggalPengajuan,
  alasanPengadaan,
].forEach((input) => {
  if (input) {
    input.addEventListener("input", function () {
      input.classList.remove("is-invalid");

      // Mengubah border warna input secara halus saat pengguna mengetik/selesai mengisi
      if (input.value.trim() !== "") {
        input.style.borderColor = "#198754"; // Warna sukses Bootstrap (hijau)
      } else {
        input.style.borderColor = "";
      }
    });
  }
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  clearErrors();

  const pemohonValue = namaPemohon.value.trim();
  const barangValue = namaBarang.value.trim();
  const jumlahValue = jumlahBarang.value.trim();
  const tanggalValue = tanggalPengajuan.value;
  const alasanValue = alasanPengadaan.value.trim();

  let isValid = true;

  if (pemohonValue === "") {
    namaPemohon.classList.add("is-invalid");
    errorPemohon.textContent = "Nama Wajib diisi!";
    isValid = false;
  }

  if (barangValue === "") {
    namaBarang.classList.add("is-invalid");
    errorBarang.textContent = "Nama barang wajib diisi!";
    isValid = false;
  }

  if (jumlahValue === "" || isNaN(jumlahValue) || Number(jumlahValue) <= 0) {
    jumlahBarang.classList.add("is-invalid");
    errorJumlah.textContent = "Masukkan jumlah barang!";
    isValid = false;
  }

  if (tanggalValue === "") {
    tanggalPengajuan.classList.add("is-invalid");
    errorTanggal.textContent = "Tanggal wajib diisi!";
    isValid = false;
  }

  if (alasanValue === "") {
    alasanPengadaan.classList.add("is-invalid");
    errorAlasan.textContent = "Keterangan wajib diisi!";
    isValid = false;
  }

  // Berhentikan eksekusi jika ada error validasi
  if (!isValid) return;

  try {
    const pengadaanBaru = {
      pemohon: pemohonValue,
      barang: barangValue,
      jumlah: Number(jumlahValue),
      tanggal: tanggalValue,
      keterangan: alasanValue,
      status: statusDefault, // Tersimpan sebagai "Pending"
    };

    let daftarPengadaan =
      JSON.parse(localStorage.getItem("riwayat_pengadaan")) || [];
    daftarPengadaan.push(pengadaanBaru);
    localStorage.setItem("riwayat_pengadaan", JSON.stringify(daftarPengadaan));

    // Ubah warna border form menjadi hijau menandakan pengisian sukses
    [namaBarang, jumlahBarang, tanggalPengajuan, alasanPengadaan].forEach(
      (inp) => {
        inp.style.borderColor = "#198754";
      },
    );

    setTimeout(() => {
      window.location.href = "dashboard_user.html";
      resetForm();
    }, 300);
  } catch (error) {
    window.location.href = "blank.html";
  }
});

// Menghapus pesan error saat tombol reset diklik
form.addEventListener("reset", function () {
  clearErrors();
  [namaBarang, jumlahBarang, tanggalPengajuan, alasanPengadaan].forEach(
    (inp) => {
      inp.style.borderColor = "";
    },
  );
  setTimeout(initAutoFill, 10);
});

function logout() {
  localStorage.removeItem("pengguna_login");
  localStorage.removeItem("peTIK_loggedUser");
  sessionStorage.clear();
  window.location.href = "login.html";
}
