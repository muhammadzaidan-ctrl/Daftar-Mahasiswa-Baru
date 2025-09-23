function closeDetailPopup() {
    document.getElementById('detailOverlay').style.display = 'none';
}
// Login functionality
// Data detail per mahasiswa
const mahasiswaDetails = [
    {
        no: 1,
        nama: "Adzkia Ar-rosyidah",
        jurusan: "Matematika Murni",
        universitas: "Universitas Airlangga",
        prestasi: "Juara Olimpiade Matematika",
        kontak: "08xxxxxxxxx",
        foto: "adzkia.png"
    }
    // Tambahkan data lain di sini
];
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.querySelector('.login-btn');
    const btnText = document.querySelector('.btn-text');
    
    // Simple validation (you can customize these credentials)
    const validCredentials = [
        {username: 'admin', password: 'admin123'},
        {username: 'student', password: 'student123'},
        {username: 'teacher', password: 'teacher123'},
        {username: 'luminare', password: 'luminare2025'},
        {username: 'ios', password: 'ios2025'}
    ];
    
    // Add loading animation
    btnText.innerHTML = '<span class="loading"></span>Logging in...';
    loginBtn.disabled = true;
    
    setTimeout(() => {
        const isValid = validCredentials.some(cred => 
            cred.username === username && cred.password === password
        );
        
        if (isValid) {
            // Success
            btnText.innerHTML = 'Success!';
            showSuccessMessage('Login berhasil! Selamat datang!');
            
            setTimeout(() => {
                document.getElementById('loginOverlay').classList.add('hidden');
                document.getElementById('mainContent').classList.add('visible');
            }, 1000);
        } else {
            // Error
            btnText.innerHTML = 'Login Failed';
            alert('Username atau password salah! harus sesuai ketentuan yang sudah diberikan yaaa...');
            
            setTimeout(() => {
                btnText.innerHTML = 'Login';
                loginBtn.disabled = false;
            }, 2000);
        }
    }, 1500);
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.password-toggle');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.innerHTML = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleBtn.innerHTML = '👁️';
    }
}

function closeLogin() {
    // Allow closing but show warning
    if (confirm('Anda yakin ingin keluar? Anda perlu login untuk mengakses data mahasiswa.')) {
        window.close();
    }
}

function socialLogin(provider) {
    alert(`Login dengan ${provider} akan segera tersedia!\n\nUntuk saat ini gunakan kredential berikut:\n• admin / admin123\n• luminare / luminare2025`);
}

function forgotPassword() {
    alert('gatau passwordnya??? coba deh tanya ke temen temen dulu');
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        successDiv.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(successDiv)) {
                document.body.removeChild(successDiv);
            }
        }, 300);
    }, 3000);
}

// Navigation functions
function navigateTo(page) {
    switch(page) {
        case 'home':
            showSuccessMessage('Anda sudah berada di halaman Home!');
            break;
        case 'about':
            alert('Tentang SMA Bina Insan Mandiri\n\n' +
                  '🏫 Sekolah dan pondok yang berkomitmen menghasilkan lulusan berkualitas\n' +
                  '📚 Program pendidikan unggulan\n' +
                  '     -Reguler\n\n' +
                  '     -Tahfidz\n\n' +
                  '     -DKDM\n\n' +
                  '🎓 Persiapan masuk perguruan tinggi terbaik\n' +
                  '🏆 Prestasi akademik dan non-akademik di tingkat nasional maupun internasional');
            break;
        case 'services':
            alert('Layanan SMA Bina Insan Mandiri:\n\n' +
                  '• 🎯 Bimbingan Konseling\n' +
                  '• 📖 Persiapan UTBK-SNBT\n' +
                  '• 🎨 Ekstrakurikuler Beragam\n' +
                  '• 💰 Program Beasiswa ke mesir\n' +
                  '• 🌐 Fasilitas Modern\n' +
                  '• 🔬 Laboratorium Lengkap');
            break;
        case 'contact':
            alert('Kontak SMA Bina Insan Mandiri:\n\n' +
                  '📞 Telepon: (0358) 772744\n' +
                  '📧 Email: info@smabim.sch.id\n' +
                  '🌐 Website: https://share.google/bowssuH0cJS9qkTz2\n' +
                  '📍 Alamat: Kompleks Pondok Pesantren Al-Ihsan, Dsn. Baron\n' +
                  '     Timur, Ds. Baron, Kec. Baron, Lobeser, Baron Nganjuk,Jawa Timur 64394\n\n');

            break;
    }
}

function logout() {
    if (confirm('Anda yakin ingin logout?')) {
        document.getElementById('mainContent').classList.remove('visible');
        document.getElementById('loginOverlay').classList.remove('hidden');
        
        // Reset form
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.querySelector('.btn-text').innerHTML = 'Login';
        document.querySelector('.login-btn').disabled = false;
        document.getElementById('searchInput').value = '';
        
        // Reset password field type
        document.getElementById('password').type = 'password';
        document.querySelector('.password-toggle').innerHTML = '👁️';
        
        // Show all table rows
        const table = document.getElementById('studentTable');
        const rows = table.getElementsByTagName('tr');
        for (let i = 1; i < rows.length; i++) {
            rows[i].style.display = '';
        }
        
        showSuccessMessage('Logout berhasil! Terima kasih!');
    }
}

// Search functionality
function searchTable() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const table = document.getElementById('studentTable');
    const rows = table.getElementsByTagName('tr');
    let visibleCount = 0;
    
    for (let i = 1; i < rows.length; i++) { // Skip header row
        const cells = rows[i].getElementsByTagName('td');
        let found = false;
        
        // Search in name, major, and university columns
        if (cells.length > 1) {
            const name = cells[1].textContent.toLowerCase();
            const major = cells[3].textContent.toLowerCase();
            const university = cells[4].textContent.toLowerCase();
            
            if (name.includes(filter) || major.includes(filter) || university.includes(filter)) {
                found = true;
                visibleCount++;
            }
        }
        
        rows[i].style.display = found ? '' : 'none';
    }
    
    // Show search results count
    if (filter && visibleCount === 0) {
        showSearchMessage('Tidak ada data yang ditemukan untuk: ' + input.value);
    } else if (filter && visibleCount > 0) {
        showSearchMessage(`Ditemukan ${visibleCount} data untuk: ${input.value}`);
    }
}

function showSearchMessage(message) {
    // Remove existing search message
    const existingMsg = document.querySelector('.search-message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    const searchMsg = document.createElement('div');
    searchMsg.className = 'success-message search-message';
    searchMsg.textContent = message;
    searchMsg.style.background = 'linear-gradient(45deg, #f39c12, #e67e22)';
    document.body.appendChild(searchMsg);
    
    setTimeout(() => {
        searchMsg.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        searchMsg.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(searchMsg)) {
                document.body.removeChild(searchMsg);
            }
        }, 300);
    }, 2000);
}

// Detail functionality
function showDetail(no, nama, jurusan, universitas) {
    const isEmptyData = nama === '' || typeof nama === 'undefined';
    if (isEmptyData) {
        alert(`Detail Mahasiswa #${no}\n\n❌ Data tidak tersedia\n\nSlot ini masih kosong dan menunggu data mahasiswa baru.`);
        return;
    }

    // Cari detail khusus di array
    const detail = mahasiswaDetails.find(m => m.no == no);
    if (detail) {
        // Tampilkan detail khusus
        let info = `=== 📋 DETAIL MAHASISWA ===\n\n`;
        info += `📊 No Urut: ${detail.no}\n👩‍🎓 Nama Lengkap: ${detail.nama}\n`;
        info += `🏫 Asal Sekolah: SMA Bina Insan Mandiri\n`;
        info += `📚 Jurusan: ${detail.jurusan}\n`;
        info += `🎓 Universitas: ${detail.universitas}\n`;
        info += `\n=== 🏆 PRESTASI ===\n• ${detail.prestasi}\n`;
        info += `\n=== 📱 KONTAK ===\n• ${detail.kontak}\n`;
        info += `\n=== 🖼️ FOTO ===\n• ${detail.foto}\n`;
        alert(info);
        return;
    }

    // Default detail jika tidak ada data khusus
    const gender = no <= 44 ? 'Putri' : 'Putra';
    const genderIcon = no <= 44 ? '👩‍🎓' : '👨‍🎓';
    const detailInfo = `
=== 📋 DETAIL MAHASISWA ===

📊 No Urut: ${no}
${genderIcon} Nama Lengkap: ${nama}
🏫 Asal Sekolah: SMA Bina Insan Mandiri
📚 Jurusan: ${jurusan === '-' ? 'Belum ditentukan' : jurusan}
🎓 Universitas: ${universitas === '-' ? 'Belum ditentukan' : universitas}

=== ℹ️ INFORMASI TAMBAHAN ===
• Status: Mahasiswa Baru 2025
• Tahun Lulus SMA: 2024
• Tahun Masuk Kuliah: 2025
• Kategori: ${gender}
• Regional: ${getRegionalInfo(universitas)}

=== 🏆 PRESTASI ===
• Lulusan SMA Bina Insan Mandiri
• Diterima di Perguruan Tinggi ${getUniversityType(universitas)}
• Membanggakan Almamater

💡 Tips: Semoga sukses dalam perjalanan akademis!
`;
    alert(detailInfo);
}

// Helper function to get regional information
function getRegionalInfo(universitas) {
    if (!universitas || universitas === '-') return 'Belum ditentukan';
    
    const regionalMap = {
        'Airlangga': 'Jawa Timur',
        'Malang': 'Jawa Timur',
        'Jember': 'Jawa Timur',
        'Surabaya': 'Jawa Timur',
        'Trunojoyo': 'Jawa Timur',
        'Diponegoro': 'Jawa Tengah',
        'Surakarta': 'Jawa Tengah',
        'Muhammadiyah Surakarta': 'Jawa Tengah',
        'Yogyakarta': 'D.I. Yogyakarta',
        'Bogor': 'Jawa Barat',
        'Bandung': 'Jawa Barat',
        'Pendidikan Indonesia': 'Jawa Barat',
        'Jakarta': 'DKI Jakarta',
        'Mulawarman': 'Kalimantan Timur',
        'Banjarmasin': 'Kalimantan Selatan',
        'Banyuwangi': 'Jawa Timur',
        'Kudus': 'Jawa Tengah'
    };
    
    for (const [key, region] of Object.entries(regionalMap)) {
        if (universitas.includes(key)) {
            return region;
        }
    }
    
    return 'Luar Jawa';
}

// Helper function to get university type
function getUniversityType(universitas) {
    if (!universitas || universitas === '-') return 'Belum ditentukan';
    
    if (universitas.includes('Universitas Negeri') || 
        universitas.includes('Universitas Islam Negeri') ||
        universitas.includes('Institut Pertanian Bogor')) {
        return 'Negeri';
    } else if (universitas.includes('Politeknik')) {
        return 'Politeknik';
    } else if (universitas.includes('Institut')) {
        return 'Institut';
    } else if (universitas.includes('Universitas Muhammadiyah') ||
               universitas.includes('STEI')) {
        return 'Swasta';
    }
    
    return 'Terkemuka';
}

// Statistics functionality
function showStatistics() {
    const table = document.getElementById('studentTable');
    const rows = table.getElementsByTagName('tr');
    // Hitung statistik hanya untuk nomor urut unik 1-87
    const noSet = new Set();
    const femaleSet = new Set();
    const maleSet = new Set();
    let studentsWithMajor = 0;
    let studentsWithUniversity = 0;
    const universities = {};
    const majors = {};
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        if (cells.length > 0) {
            const no = parseInt(cells[0].textContent);
            const nama = cells[1].textContent;
            const major = cells[3].textContent;
            const university = cells[4].textContent;
            if (!isNaN(no) && no >= 1 && no <= 87 && nama.trim() !== "") {
                noSet.add(no);
                if (no <= 44) {
                    femaleSet.add(no);
                } else if (no >= 45 && no <= 87) {
                    maleSet.add(no);
                }
                if (major && major !== '-') {
                    studentsWithMajor++;
                    majors[major] = (majors[major] || 0) + 1;
                }
                if (university && university !== '-') {
                    studentsWithUniversity++;
                    universities[university] = (universities[university] || 0) + 1;
                }
            }
        }
    }
    const totalStudents = noSet.size;
    const femaleStudents = femaleSet.size;
    const maleStudents = maleSet.size;
    const topUniversity = Object.keys(universities).reduce((a, b) => 
        universities[a] > universities[b] ? a : b, Object.keys(universities)[0] || 'Tidak ada data');
    const statsInfo = `
=== 📊 STATISTIK MAHASISWA BARU 2025 ===
SMA Bina Insan Mandiri

👥 TOTAL MAHASISWA: ${totalStudents} orang


🚻 BERDASARKAN GENDER:
• Putri: ${femaleStudents} orang (${((femaleStudents/totalStudents)*100).toFixed(1)}%)
• Putra: ${maleStudents} orang (${((maleStudents/totalStudents)*100).toFixed(1)}%)

📚 STATUS JURUSAN:
• Sudah menentukan: ${studentsWithMajor} orang
• Belum menentukan: ${totalStudents - studentsWithMajor} orang

🎓 STATUS UNIVERSITAS:
• Sudah diterima: ${studentsWithUniversity} orang
• Belum ada info: ${totalStudents - studentsWithUniversity} orang

🏆 UNIVERSITAS TERFAVORIT:
${topUniversity} (${universities[topUniversity] || 0} mahasiswa)

📈 TINGKAT KELULUSAN: ${((studentsWithUniversity/totalStudents)*100).toFixed(1)}%

🎯 TARGET 2025: Semua lulusan diterima di PT pilihan!
`;
    alert(statsInfo);
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl + F for search
    if (event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        document.getElementById('searchInput').focus();
    }
    
    // Escape to clear search
    if (event.key === 'Escape') {
        const searchInput = document.getElementById('searchInput');
        if (searchInput.value) {
            searchInput.value = '';
            searchTable();
            searchInput.blur();
        }
    }
    
    // Ctrl + S for statistics
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        if (document.getElementById('mainContent').classList.contains('visible')) {
            showStatistics();
        }
    }
});

// Add right-click context menu for table rows
document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('studentTable');
    if (table) {
        table.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            
            const row = event.target.closest('tr');
            if (row && row.rowIndex > 0) { // Not header row
                const cells = row.getElementsByTagName('td');
                if (cells.length > 0) {
                    const no = cells[0].textContent;
                    const nama = cells[1].textContent;
                    const jurusan = cells[3].textContent;
                    const universitas = cells[4].textContent;
                    
                    const action = confirm(`Data untuk ${nama}\n\nKlik OK untuk melihat detail\nKlik Cancel untuk menyalin nama`);
                    
                    if (action) {
                        showDetail(no, nama, jurusan, universitas);
                    } else {
                        // Copy name to clipboard
                        navigator.clipboard.writeText(nama).then(() => {
                            showSuccessMessage(`Nama "${nama}" telah disalin!`);
                        });
                    }
                }
            }
        });
    }
});

// Add export functionality
function exportData(format) {
    const table = document.getElementById('studentTable');
    const rows = table.getElementsByTagName('tr');
    let data = [];
    
    // Get headers
    const headers = [];
    const headerCells = rows[0].getElementsByTagName('th');
    for (let cell of headerCells) {
        if (cell.textContent !== 'Profile') { // Exclude Profile column
            headers.push(cell.textContent);
        }
    }
    data.push(headers);
    
    // Get data rows
    for (let i = 1; i < rows.length; i++) {
        if (rows[i].style.display !== 'none') { // Only visible rows
            const rowData = [];
            const cells = rows[i].getElementsByTagName('td');
            for (let j = 0; j < cells.length - 1; j++) { // Exclude last column (Profile button)
                rowData.push(cells[j].textContent);
            }
            data.push(rowData);
        }
    }
    
    if (format === 'csv') {
        exportToCSV(data);
    } else if (format === 'json') {
        exportToJSON(data);
    }
}

function exportToCSV(data) {
    const csvContent = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'daftar_mahasiswa_2025.csv';
    a.click();
    showSuccessMessage('Data berhasil diekspor ke CSV!');
}

function exportToJSON(data) {
    const [headers, ...rows] = data;
    const jsonData = rows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = row[index];
        });
        return obj;
    });
    
    const jsonContent = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'daftar_mahasiswa_2025.json';
    a.click();
    showSuccessMessage('Data berhasil diekspor ke JSON!');
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Add additional functionality buttons to navigation
    const nav = document.querySelector('.navigation');
    if (nav) {
        const statsBtn = document.createElement('button');
        statsBtn.textContent = 'Statistik';
        statsBtn.className = 'btnLogin-popup';
        statsBtn.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';
        statsBtn.onclick = showStatistics;
        
        const exportBtn = document.createElement('button');
        exportBtn.textContent = 'Export';
        exportBtn.className = 'btnLogin-popup';
        exportBtn.style.background = 'linear-gradient(45deg, #9b59b6, #8e44ad)';
        exportBtn.onclick = function() {
            const format = confirm('Pilih format export:\nOK = CSV\nCancel = JSON') ? 'csv' : 'json';
            exportData(format);
        };
        
        // Insert before logout button
        const logoutBtn = nav.querySelector('.btnLogin-popup');
        nav.insertBefore(statsBtn, logoutBtn);
        nav.insertBefore(exportBtn, logoutBtn);
    }
    
    // Add help tooltip
    const helpBtn = document.createElement('div');
    helpBtn.innerHTML = '?';
    helpBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        background: linear-gradient(45deg, #3498db, #2980b9);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-weight: bold;
        z-index: 999;
        box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
        transition: all 0.3s ease;
    `;
    
    helpBtn.onclick = function() {
        alert(`🎓 PANDUAN PENGGUNAAN SISTEM\n\n` +
              `🔍 PENCARIAN:\n` +
              `• Ketik nama/jurusan/universitas di kotak pencarian\n` +
              `• Tekan Ctrl+F untuk fokus ke pencarian\n` +
              `• Tekan Escape untuk menghapus pencarian\n\n` +
              `📊 STATISTIK:\n` +
              `• Klik tombol "Statistik" atau tekan Ctrl+S\n\n` +
              `📋 DETAIL MAHASISWA:\n` +
              `• Klik tombol "Detail" pada setiap baris\n` +
              `• Klik kanan pada nama untuk opsi tambahan\n\n` +
              `💾 EXPORT DATA:\n` +
              `• Klik tombol "Export" untuk unduh data\n` +
              `• Pilih format CSV atau JSON\n\n` +
              `🎯 LOGIN CREDENTIALS:\n` +
              `• admin/admin123\n` +
              `• luminare/luminare2025\n` +
              `• ios/ios2025`);
    };
    
    helpBtn.onmouseover = function() {
        this.style.transform = 'scale(1.1)';
    };
    
    helpBtn.onmouseout = function() {
        this.style.transform = 'scale(1)';
    };
    
    document.body.appendChild(helpBtn);
});

// Add table sorting functionality
function sortTable(columnIndex, dataType = 'text') {
    const table = document.getElementById('studentTable');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Toggle sort direction
    const currentSort = table.getAttribute('data-sort-column');
    const currentDirection = table.getAttribute('data-sort-direction') || 'asc';
    const newDirection = (currentSort == columnIndex && currentDirection === 'asc') ? 'desc' : 'asc';
    
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();
        
        let comparison = 0;
        if (dataType === 'number') {
            const aNum = parseInt(aValue) || 0;
            const bNum = parseInt(bValue) || 0;
            comparison = aNum - bNum;
        } else {
            comparison = aValue.localeCompare(bValue);
        }
        
        return newDirection === 'asc' ? comparison : -comparison;
    });
    
    // Re-append sorted rows
    rows.forEach(row => tbody.appendChild(row));
    
    // Update sort indicators
    table.setAttribute('data-sort-column', columnIndex);
    table.setAttribute('data-sort-direction', newDirection);
    
    // Update header indicators
    const headers = table.querySelectorAll('th');
    headers.forEach((header, index) => {
        header.classList.remove('sort-asc', 'sort-desc');
        if (index === columnIndex) {
            header.classList.add('sort-' + newDirection);
        }
    });
    
    if (columnIndex === 0) {
        // Hitung hanya baris dengan angka valid di kolom No
        // Hitung nomor urut unik 1-87
        const noSet = new Set();
        rows.forEach(row => {
            const noCell = row.cells[0];
            const namaCell = row.cells[1];
            const no = parseInt(noCell && noCell.textContent);
            if (
                noCell &&
                !isNaN(no) &&
                no >= 1 && no <= 87 &&
                namaCell &&
                namaCell.textContent.trim() !== ""
            ) {
                noSet.add(no);
            }
        });
        const jumlahData = noSet.size;
        showSuccessMessage(`Tabel diurutkan berdasarkan No (1-${jumlahData})`);
    } else {
        showSuccessMessage(`Tabel diurutkan berdasarkan ${headers[columnIndex].textContent} (${newDirection === 'asc' ? 'A-Z' : 'Z-A'})`);
    }
}

// Make table headers clickable for sorting
document.addEventListener('DOMContentLoaded', function() {
    const headers = document.querySelectorAll('#studentTable th');
    headers.forEach((header, index) => {
        if (index === 5) return; // Skip Profile column
        
        header.style.cursor = 'pointer';
        header.title = 'Klik untuk mengurutkan';
        
        header.addEventListener('click', () => {
            const dataType = index === 0 ? 'number' : 'text';
            sortTable(index, dataType);
        });
    });
});