// Mengambil data pengadaan dari localStorage atau inisialisasi array kosong jika tidak ada data
let daftarPengadaan =
  JSON.parse(localStorage.getItem("riwayat_pengadaan")) || [];

const tbody = document.getElementById("tbody");
const searchInput = document.getElementById("search");
const log = window.localStorage.getItem("peTIK_loggedUser") || "Admin Hasan";

const usernameDisplay = document.getElementById("pengguna");
if (usernameDisplay) {
  usernameDisplay.textContent = log;
}

// Cek Sesi Login
if (
  !localStorage.getItem("peTIK_loggedUser") &&
  !localStorage.getItem("pengguna_login")
) {
  window.location.replace("login.html");
}

function logout() {
localStorage.removeItem("pengguna_login");
localStorage.removeItem("peTIK_loggedUser");

window.location.replace("index.html");
}

// Untuk memperbarui statistik pengadaan
function updateStatistik() {
  const totalMasuk = daftarPengadaan.length;
  let totalDiproses = 0;
  let totalSelesai = 0;

  daftarPengadaan.forEach((item) => {
    const status = (item.status || "Diproses").trim().toLowerCase();
    if (status === "diproses") {
      totalDiproses++;
    } else if (status === "disetujui" || status === "selesai") {
      totalSelesai++;
    }
  });

  if (document.getElementById("count-masuk"))
    document.getElementById("count-masuk").textContent = totalMasuk;
  if (document.getElementById("count-diproses"))
    document.getElementById("count-diproses").textContent = totalDiproses;
  if (document.getElementById("count-selesai"))
    document.getElementById("count-selesai").textContent = totalSelesai;
}

// Untuk menampilkan data pengadaan dalam tabel
function tampilTabel(data = daftarPengadaan) {
  if (!tbody) return;
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted py-3">
          Belum ada data pengajuan
        </td>
      </tr>
    `;
    updateStatistik();

    // ini agar notif ikut ter-update saat data kosong
    notifAdmin();
    return;
  }

  data.forEach((item, index) => {
    let badgeClass = "bg-warning text-dark";
    let statusText = item.status || "Diproses";
    const statusLower = statusText.trim().toLowerCase();

    if (statusLower === "diproses") {
      badgeClass = "bg-warning text-dark";
      statusText = "Diproses";
    } else if (statusLower === "disetujui" || statusLower === "selesai") {
      badgeClass = "bg-success";
      statusText = "Selesai";
    } else if (statusLower === "ditolak") {
      badgeClass = "bg-danger";
      statusText = "Ditolak";
    }

    tbody.innerHTML += `
      <tr class="text-center">
        <td>${index + 1}</td>
        <td>${item.pemohon}</td>
        <td>${item.tanggal}</td>
        <td>${item.barang}</td>
        <td>${item.jumlah || item.qty || "0"}</td>
        <td>
          <span class="badge ${badgeClass} px-3 py-2 fw-semibold">
            ${statusText}
          </span>
        </td>
        <td>
        <button class="btn btn-warning btn-sm me-1 text-white" onclick="detailPengadaan(${index})" title="Detail">
          <i class="fa-solid fa-circle-info text-dark"></i>
        </button>
        <button class="btn btn-primary btn-sm me-1" onclick="bukaModalEdit(${index})">
        <i class="fa-solid fa-edit"></i>
      </button>
          </button>
          <button class="btn btn-danger btn-sm" onclick="hapusData(${index})" title="Hapus">
            <i class="fa-solid fa-trash-alt"></i>
          </button>
        </td>
      </tr>
    `;
  });

  updateStatistik();
  notifAdmin();
}

// Fungsi Notifikasi untuk Admin
function notifAdmin() {
  const notifMenu = document.getElementById("notification");
  const notifDot = document.getElementById("notif-dot");
  if (!notifMenu) return;

  let isiNotif = `<div class="dropdown-header fw-bold text-body">Pengajuan Masuk Baru</div>`;

  if (daftarPengadaan.length > 0) {
    // Selama ada data pengadaan, titik merah akan terus muncul
    if (notifDot) {
      notifDot.classList.remove("d-none");
    }

    // Tampilkan daftar pengajuan
    daftarPengadaan.forEach((item) => {
      isiNotif += `
        <a class="dropdown-item py-2 border-bottom text-wrap" style="max-width: 280px;">
          <span class="notification-title d-block fw-semibold text-dark">Pemohon: ${item.pemohon}</span>
          <span class="notification-text small text-secondary d-block">Barang: ${item.barang}</span>
          <span class="notification-time text-muted" style="font-size: 0.75rem;">Tanggal: ${item.tanggal}</span>
          <span class="notification-time text-muted" style="font-size: 0.75rem;">Jam: ${new Date().toLocaleTimeString("id-ID")}</span>
        </a>
      `;
    });
  } else {
    // menyembunyika dot merah jika tidak ada data
    if (notifDot) {
      notifDot.classList.add("d-none");
    }

    isiNotif += `
      <div class="dropdown-item text-muted small text-center py-2">
        Tidak ada pengajuan baru
      </div>
    `;
  }

  notifMenu.innerHTML = isiNotif;
}
notifAdmin();

// Event listener saat ikon lonceng admin diklik (hanya untuk menyembunyikan titik merah saat diklik)
const iconButton = document.querySelector(".icon-button");
if (iconButton) {
  iconButton.addEventListener("click", function () {
    const notifDot = document.getElementById("notif-dot");
    if (notifDot) {
      notifDot.classList.add("d-none");
    }
  });
}

// Detail pengadaan
function detailPengadaan(index) {
  const item = daftarPengadaan[index];
  if (!item) return;

  if (document.getElementById("detailPemohon"))
    document.getElementById("detailPemohon").textContent = item.pemohon || "-";
  if (document.getElementById("detailTanggal"))
    document.getElementById("detailTanggal").textContent = item.tanggal || "-";
  if (document.getElementById("detailBarang"))
    document.getElementById("detailBarang").textContent = item.barang || "-";
  if (document.getElementById("detailJumlah"))
    document.getElementById("detailJumlah").textContent = item.jumlah || "0";
  if (document.getElementById("detailKeterangan"))
    document.getElementById("detailKeterangan").textContent =
      item.keterangan || "-";

  const statusContainer = document.getElementById("detailStatus");
  if (statusContainer) {
    let statusText = item.status
      ? item.status.trim().toLowerCase()
      : "diproses";
    let badgeClass = "bg-warning text-dark";
    let displayText = "Diproses";

    if (statusText === "diproses") {
      badgeClass = "bg-warning text-dark";
      displayText = "Diproses";
    } else if (statusText === "disetujui" || statusText === "selesai") {
      badgeClass = "bg-success";
      displayText = "Selesai";
    } else if (statusText === "ditolak") {
      badgeClass = "bg-danger";
      displayText = "Ditolak";
    }

    statusContainer.textContent = displayText;
    statusContainer.className = `badge ${badgeClass} px-3 py-2 fw-semibold`;
  }

  const modalElement = document.getElementById("modalDetail");
  if (modalElement) {
    const bootstrapModal = new bootstrap.Modal(modalElement);
    bootstrapModal.show();
  }
}

// saat tombol edit diklik memebuka tampilan modal edit
function bukaModalEdit(index) {
  const data = daftarPengadaan[index];
  if (!data) return;

  // Masukkan data ke input form
  document.getElementById("editIndex").value = index;
  document.getElementById("editPemohon").value = data.pemohon || "";
  document.getElementById("editTanggal").value = data.tanggal || "";
  document.getElementById("editBarang").value = data.barang || "";
  document.getElementById("editJumlah").value = data.jumlah || "";
  document.getElementById("editKeterangan").value = data.keterangan || "";

  // Mengisi kolom catatan/komentar jika sebelumnya sudah ada
  const editCatatanInput = document.getElementById("editCatatan");
  if (editCatatanInput) {
    editCatatanInput.value = data.catatan || "";
  }

  // Tampilkan modal
  let modal = new bootstrap.Modal(document.getElementById("modalEdit"));
  modal.show();
}

// Tangkap event submit pada form edit secara otomatis
const formEdit = document.getElementById("formEdit");
if (formEdit) {
  formEdit.addEventListener("submit", function (event) {
    event.preventDefault(); // Mencegah reload halaman

    const index = document.getElementById("editIndex").value;
    if (index === "" || !daftarPengadaan[index]) return;

    // Timpa data lama dengan data baru dari form
    daftarPengadaan[index].pemohon =
      document.getElementById("editPemohon").value;
    daftarPengadaan[index].tanggal =
      document.getElementById("editTanggal").value;
    daftarPengadaan[index].barang = document.getElementById("editBarang").value;
    daftarPengadaan[index].jumlah = document.getElementById("editJumlah").value;
    const statusBaru = document.getElementById("status").value;
    daftarPengadaan[index].status = statusBaru;
    const ketBaru = document.getElementById("editKeterangan").value;
    daftarPengadaan[index].keterangan = ketBaru;

    // Ambil nilai dari input catatan/komentar jika elemen tersebut ada
    const editCatatanInput = document.getElementById("editCatatan");
    if (editCatatanInput) {
      daftarPengadaan[index].catatan = editCatatanInput.value;

      // MENGHAPUS / MERESET INPUT KETIKA SELESAI DIINPUT
      editCatatanInput.value = "";
    }

    // Simpan permanen ke localStorage
    localStorage.setItem("riwayat_pengadaan", JSON.stringify(daftarPengadaan));

    // Sembunyikan modal Bootstrap
    let modalEl = document.getElementById("modalEdit");
    let modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) {
      modal.hide();
    }

    // Reset seluruh isi form (opsional, untuk memastikan inputan lain juga bersih saat modal diakses kembali)
    formEdit.reset();

    // Refresh tabel di dashboard
    tampilTabel();

    // Notifikasi Berhasil
    Swal.fire({
      title: "Berhasil!",
      text: "Data pengajuan berhasil diperbarui.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  });
}

// fungsi hapus data pengajuan
function hapusData(index) {
  const isiTable = daftarPengadaan[index];
  Swal.fire({
    title: "Apakah kamu yakin?",
    text: `Data pengajuan dari "${isiTable.pemohon}" tidak dapat dikembalikan!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      daftarPengadaan.splice(index, 1);
      localStorage.setItem(
        "riwayat_pengadaan",
        JSON.stringify(daftarPengadaan),
      );

      tampilTabel();

      Swal.fire({
        title: "Berhasil!",
        text: "Data berhasil dihapus!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
}

// Untuk pencarian data pengajuan
if (searchInput) {
  searchInput.addEventListener("input", function () {
    const keyword = this.value.toLowerCase().trim();
    const hasilPencarian = daftarPengadaan.filter((item) => {
      return (
        (item.pemohon || "").toLowerCase().includes(keyword) ||
        (item.barang || "").toLowerCase().includes(keyword) ||
        (item.tanggal || "").toLowerCase().includes(keyword) ||
        (item.status || "").toLowerCase().includes(keyword)
      );
    });
    tampilTabel(hasilPencarian);
  });
}

// memperbarui data dan tampilan tabel secara langsung di dalam halaman (live update) tanpa perlu admin menekan refresh manual di browser.
function refreshDashboard() {
  daftarPengadaan = JSON.parse(localStorage.getItem("riwayat_pengadaan")) || [];
  tampilTabel();
  notifAdmin();
}
window.addEventListener("storage", function (event) {
  if (event.key === "riwayat_pengadaan") {
    refreshDashboard();
  }
});
refreshDashboard();
