let totalPengadaan =
  JSON.parse(localStorage.getItem("riwayat_pengadaan")) || [];
const log = window.localStorage.getItem("peTIK_loggedUser") || "Pengguna";

// Filter data milik user yang sedang login
let daftarPengadaan = totalPengadaan.filter(
  (item) => item.pemohon && item.pemohon.toLowerCase() === log.toLowerCase(),
);

const usernameDisplay = document.getElementById("pengguna");
if (usernameDisplay) {
  usernameDisplay.textContent = log;
}

// Cek sesi: Jika data login sudah tidak ada, langsung tendang ke login.html
if (
  !localStorage.getItem("peTIK_loggedUser") &&
  !localStorage.getItem("pengguna_login")
) {
  window.location.replace("login.html");
}

function logout(event) {
  // Mencegah konflik event bawaan dropdown
  if (event) event.preventDefault(); 
  
  localStorage.removeItem("pengguna_login");
  localStorage.removeItem("peTIK_loggedUser");

  // Beri jeda kecil agar animasi dropdown selesai dan tidak error
  setTimeout(() => {
    window.location.replace("login.html");
  }, 100);
}

// Fungsi untuk menghitung, memperbarui, dan menyimpan card status ke LocalStorage
function updateStatistik() {
  let countDiproses = 0;
  let countDitolak = 0;
  let countSelesai = 0;

  daftarPengadaan.forEach((item) => {
    const status = item.status ? item.status.trim().toLowerCase() : "";

    if (status === "diproses" || status === "pending") {
      countDiproses++;
    } else if (status === "ditolak") {
      countDitolak++;
    } else if (status === "disetujui" || status === "selesai") {
      countSelesai++;
    }
  });

  // objek data untuk card status
  const cardUser = {
    panding: countDiproses,
    diproses: countDiproses,
    ditolak: countDitolak,
    disetujui: countSelesai,
    terakhirDiperbarui: new Date().toLocaleString(),
  };

  localStorage.setItem("cardUser", JSON.stringify(cardUser));

  // Update counter elemen HTML jika ada
  const elPending = document.getElementById("count-pending");
  if (elPending) elPending.textContent = countDiproses;

  const elDiproses = document.getElementById("count-diproses");
  if (elDiproses) elDiproses.textContent = countDiproses;

  const elDitolak = document.getElementById("count-ditolak");
  if (elDitolak) elDitolak.textContent = countDitolak;

  const elSelesai = document.getElementById("count-selesai");
  if (elSelesai) elSelesai.textContent = countSelesai;
}

// Notif user
function notif() {
  const notifMenu = document.getElementById('notification');
  const notifDot = document.getElementById('notif-dot')
  if (!notifMenu) return;

  let isiNotif = `<div class="dropdown-header fw-bold text-body">Notifications</div> <hr />`;

  const daftarNotif = daftarPengadaan.filter((item) => {
   const statusLower = item.status ? item.status.trim().toLowerCase() : "pending";
    const punyaCatatan = item.catatan && item.catatan.trim() !== "";
    return punyaCatatan || (statusLower !== "pending" && statusLower !== "diproses");
  });

  if(daftarNotif.length > 0) {
    if(notifDot) {
      notifDot.classList.remove('d-none');
    };

    daftarNotif.forEach((item) => {
      isiNotif += `
        <a class="dropdown-item py-2 border-bottom text-wrap" style="max-width: 280px;">
          <span class="notification-title d-block fw-semibold text-dark">Nama: ${item.pemohon}</span>
          <span class="notification-text small text-secondary d-block">Barang: ${item.barang}</span>
          <span class="notification-text small text-secondary d-block">Catatan: ${item.catatan || "Status diperbarui oleh admin"}</span>
          <span class="notification-time text-muted" style="font-size: 0.75rem;">Status: <b>${item.status || "Diproses"}</b></span>
          <span class="notification-time text-muted" style="font-size: 0.75rem;">Jam: ${new Date().toLocaleTimeString('id-ID')}</span>
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
        Tidak ada notifikasi baru
      </div>
    `;
  }
  notifMenu.innerHTML = isiNotif;
};
notif();

// Menghilangkan dot merah di notif ketika user mengkliknya
const iconButton = document.querySelector('.icon-button');
if (iconButton) {
  iconButton.addEventListener('click', function() {
    const notifDot = document.getElementById('notif-dot');
    if (notifDot) {
      notifDot.classList.add('d-none');
    }
  });
}

// search data pengajuan
const searchInput = document.getElementById("search");
if (searchInput) {
  searchInput.addEventListener("input", function () {
    const query = searchInput.value.trim().toLowerCase();
    const rows = document.querySelectorAll("#tbody tr");

    rows.forEach((row) => {
      const rowText = row.textContent.toLowerCase();
      row.hidden = query !== "" && !rowText.includes(query);
    });
  });
}

// Fungsi untuk menampilkan data ke dalam tabel
function tampilTabel() {
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";

  if (daftarPengadaan.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-3">Belum ada data pengajuan</td></tr>`;
  } else {
    daftarPengadaan.forEach((item, index) => {
      let badgeClass = "bg-secondary";
      let statusText = item.status || "Pending";
      const stLower = statusText.toLowerCase();

      // Menentukan warna badge berdasarkan status
      if (stLower === "dipanding" || stLower === "pending") {
        badgeClass = "bg-warning text-dark";
        statusText = "Pending";
      } else if (stLower === "diproses") {
        badgeClass = "bg-primary";
        statusText = "Diproses";
      } else if (stLower === "disetujui" || stLower === "selesai") {
        badgeClass = "bg-success";
        statusText = "Selesai";
      } else if (stLower === "ditolak") {
        badgeClass = "bg-danger";
        statusText = "Ditolak";
      }

      tbody.innerHTML += `
  <tr class='text-center'>
    <td>${index + 1}</td>
    <td>${item.pemohon}</td>
    <td>${item.tanggal}</td>
    <td>${item.barang}</td>
    <td>${item.jumlah}</td>
    <td><span class="badge ${badgeClass}">${statusText}</span></td>
    <td>
      <button class="btn btn-primary btn-sm me-1" onclick="bukaModalEdit(${index})">
        <i class="fa-solid fa-edit"></i>
      </button>
      <button class="btn btn-warning btn-sm me-1" onclick="detailData(${index})">
        <i class="fa-solid fa-circle-info"></i>
      </button>
      <button type="button" class="btn btn-danger btn-sm" onclick="hapusData(${index})">
        <i class="fa-solid fa-trash-alt"></i>
      </button>
    </td>
  </tr>
`;
    });
  }

  updateStatistik();
}
tampilTabel();

// Fungsi untuk menghapus data pengadaan
function hapusData(index) {
  const isiTable = daftarPengadaan[index];
  Swal.fire({
    title: "Apakah kamu yakin?",
    text: `Data pengajuan "${isiTable.barang}" tidak dapat dikembalikan!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // Hapus data dari array utama
      const realIndex = totalPengadaan.findIndex((item) => item === isiTable);
      if (realIndex !== -1) {
        totalPengadaan.splice(realIndex, 1);
        localStorage.setItem(
          "riwayat_pengadaan",
          JSON.stringify(totalPengadaan),
        );
      }

      daftarPengadaan.splice(index, 1);
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

// fungsi menampilkan info detail pengajuan
function detailData(index) {
  const findKategori = daftarPengadaan[index];

  if (document.getElementById("detailPemohon"))
    document.getElementById("detailPemohon").textContent = findKategori.pemohon;
  if (document.getElementById("detailTanggal"))
    document.getElementById("detailTanggal").textContent = findKategori.tanggal;
  if (document.getElementById("detailBarang"))
    document.getElementById("detailBarang").textContent = findKategori.barang;
  if (document.getElementById("detailJumlah"))
    document.getElementById("detailJumlah").textContent =
      `${Number(findKategori.jumlah).toLocaleString("id-ID")}`;
  if (document.getElementById("detailStatus")) {
    const statusContainer = document.getElementById("detailStatus");

    let statusText = findKategori.status
      ? findKategori.status.trim().toLowerCase()
      : "pending";
    let badgeClass = "bg-secondary";
    let displayText = "Pending";

    if (statusText === "dipanding" || statusText === "pending") {
      badgeClass = "bg-warning text-dark";
      displayText = "Pending";
    } else if (statusText === "diproses") {
      badgeClass = "bg-primary";
      displayText = "Diproses";
    } else if (statusText === "disetujui" || statusText === "selesai") {
      badgeClass = "bg-success";
      displayText = "Selesai";
    } else if (statusText === "ditolak") {
      badgeClass = "bg-danger";
      displayText = "Ditolak";
    }

    statusContainer.textContent = displayText;
    statusContainer.className = `badge ${badgeClass}`;
  }
  if (document.getElementById("detailKeterangan"))
    document.getElementById("detailKeterangan").textContent =
      findKategori.keterangan;

  const modalElement = document.getElementById("modalDetail");
  if (modalElement) {
    const bootstrapModal = new bootstrap.Modal(modalElement);
    bootstrapModal.show();
  }
}

// Fungsi membuka tampilan modal edit
function bukaModalEdit(index) {
  const data = daftarPengadaan[index];
  if (!data) return;

  document.getElementById("editIndex").value = index;
  document.getElementById("editPemohon").value = data.pemohon || "";
  document.getElementById("editTanggal").value = data.tanggal || "";
  document.getElementById("editBarang").value = data.barang || "";
  document.getElementById("editJumlah").value = data.jumlah || "";
  document.getElementById("editKeterangan").value = data.keterangan || "";

  let modal = new bootstrap.Modal(document.getElementById("modalEdit"));
  modal.show();
}

// untuk merubah data pengajuan dan juga tersimpan di localStorage
const formEdit = document.getElementById("formEdit");
if (formEdit) {
  formEdit.addEventListener("submit", function (event) {
    event.preventDefault();

    const index = document.getElementById("editIndex").value;
    if (index === "" || !daftarPengadaan[index]) return;

    const itemDiubah = daftarPengadaan[index];
    itemDiubah.tanggal = document.getElementById("editTanggal").value;
    itemDiubah.barang = document.getElementById("editBarang").value;
    itemDiubah.jumlah = Number(document.getElementById("editJumlah").value);
    itemDiubah.keterangan = document.getElementById("editKeterangan").value;

    localStorage.setItem("riwayat_pengadaan", JSON.stringify(totalPengadaan));

    let modalEl = document.getElementById("modalEdit");
    let modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) {
      modal.hide();
    }

    tampilTabel();
    notif();

    Swal.fire({
      title: "Berhasil!",
      text: "Data pengajuan berhasil diperbarui.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  });
}

window.addEventListener("storage", function (event) {
  if (event.key === "riwayat_pengadaan") {
    // Perbarui totalPengadaan dan daftarPengadaan secara langsung
    totalPengadaan = JSON.parse(localStorage.getItem("riwayat_pengadaan")) || [];

    daftarPengadaan = totalPengadaan.filter(
      (item) => item.pemohon && item.pemohon.toLowerCase() === log.toLowerCase()
    );

    // Perbarui tampilan tabel dan notifikasi
    tampilTabel();
    notif();
  }
});
