// Data Mahasiswa Lengkap (87 Siswa)
const studentsData = [
    {no: 1, nama: "Adzkia Ar-rosyidah", asal: "SMA Bina Insan Mandiri", jurusan: "Matematika Murni", universitas: "Universitas Airlangga"},
    {no: 2, nama: "Agustin Wulandari", asal: "SMA Bina Insan Mandiri", jurusan: "Manajemen Pemasaran", universitas: "Universitas Negeri Malang"},
    {no: 3, nama: "Aisyah Nur Dzikriah", asal: "SMA Bina Insan Mandiri", jurusan: "Bisnis Digital", universitas: "Politeknik Negeri Banyuwangi"},
    {no: 4, nama: "Alfiani Nur Izzaty", asal: "SMA Bina Insan Mandiri", jurusan: "Supervisor Jaminan Mutu Pangan", universitas: "Institut Pertanian Bogor"},
    {no: 5, nama: "Alfiyah Zahrotul Jannah", asal: "SMA Bina Insan Mandiri", jurusan: "Psikologi", universitas: "Universitas Muhammadiyah Surakarta"},
    {no: 6, nama: "Alfia Khaira Mazeedah", asal: "SMA Bina Insan Mandiri", jurusan: "-", universitas: "Universitas Airlangga"},
    {no: 7, nama: "Alifia Nurul Izzaty", asal: "SMA Bina Insan Mandiri", jurusan: "Agronomi", universitas: "Universitas Negeri Jember"},
    {no: 8, nama: "Amatullah Fatimah", asal: "SMA Bina Insan Mandiri", jurusan: "-", universitas: "Universitas Diponegoro"},
    {no: 9, nama: "Dinar Habibatus Shofia", asal: "SMA Bina Insan Mandiri", jurusan: "Gizi", universitas: "Politeknik Kesehatan Malang"},
    {no: 10, nama: "Fajar Javier Rahimah", asal: "SMA Bina Insan Mandiri", jurusan: "Manajemen Informatika", universitas: "Politeknik Negeri Jember"},
    {no: 11, nama: "Ghaniyyah Nayla Azmi", asal: "SMA Bina Insan Mandiri", jurusan: "PAI", universitas: "Universitas Islam Negeri Malang"},
    {no: 12, nama: "Halimah Kiysa Fiktim", asal: "SMA Bina Insan Mandiri", jurusan: "Teknik Komputer", universitas: "Universitas Pendidikan Indonesia"},
    {no: 13, nama: "Hamidatul Fitriah", asal: "SMA Bina Insan Mandiri", jurusan: "Gizi", universitas: "Universitas Airlangga"},
    {no: 14, nama: "Hilma Fatin Fikriah", asal: "SMA Bina Insan Mandiri", jurusan: "-", universitas: "Politeknik Negeri Malang"},
    {no: 15, nama: "Hilma Nadaul Hasanah", asal: "SMA Bina Insan Mandiri", jurusan: "Pendidikan Biologi", universitas: "Universitas Negeri Malang"},
    {no: 16, nama: "Humairoh Azzahra", asal: "SMA Bina Insan Mandiri", jurusan: "Teknologi Hasil Pertanian", universitas: "Universitas Mulawarman"},
    {no: 17, nama: "Kamila Fatin Hamizah", asal: "SMA Bina Insan Mandiri", jurusan: "PGPAUD", universitas: "Universitas Negeri Malang"},
    {no: 18, nama: "Khadijah Inten Ayu Daffa", asal: "SMA Bina Insan Mandiri", jurusan: "Pendidikan Bahasa Indonesia", universitas: "Universitas Negeri Malang"},
    {no: 19, nama: "Leilani Nadia Salsabila", asal: "SMA Bina Insan Mandiri", jurusan: "Kimia", universitas: "Universitas Negeri Malang"},
    {no: 20, nama: "Luluk Mukhibbatur", asal: "SMA Bina Insan Mandiri", jurusan: "Kebidanan", universitas: "Politeknik Kesehatan Surabaya"},
    {no: 21, nama: "Maulida Nahdliyah Tsaqifah", asal: "SMA Bina Insan Mandiri", jurusan: "IPA", universitas: "Universitas Trunojoyo"},
    {no: 22, nama: "Meida Nugraheni Puji Rahayu", asal: "SMA Bina Insan Mandiri", jurusan: "Optik", universitas: "Arogapoppin"},
    {no: 23, nama: "Muthia Romadhona Nidaul haq", asal: "SMA Bina Insan Mandiri", jurusan: "Gizi", universitas: "Politeknik Kesehatan Negeri Malang"},
    {no: 24, nama: "Muthiah Sabila haq", asal: "SMA Bina Insan Mandiri", jurusan: "TKG", universitas: "Universitas Airlangga"},
    {no: 25, nama: "Mutiara Nur laili", asal: "SMA Bina Insan Mandiri", jurusan: "PAI", universitas: "Universitas Islam Negeri Kudus"},
    {no: 26, nama: "Nabila Lualai", asal: "SMA Bina Insan Mandiri", jurusan: "Desain Interior", universitas: "Institut Teknologi Surabaya"},
    {no: 27, nama: "Nada Raihani Adn", asal: "SMA Bina Insan Mandiri", jurusan: "Kebidanan", universitas: "Universitas Negeri Surakarta"},
    {no: 28, nama: "Nadia Zakiyah Rahmah", asal: "SMA Bina Insan Mandiri", jurusan: "Manajemen", universitas: "Universitas Negeri Malang"},
    {no: 29, nama: "Nadzifah Irawan", asal: "SMA Bina Insan Mandiri", jurusan: "Manajemen Bisnis", universitas: "STEI Hamfara"},
    {no: 30, nama: "Nanis Wahyu Pramadinah", asal: "SMA Bina Insan Mandiri", jurusan: "Konseling", universitas: "Universitas Islam Negeri Surabaya"},
    {no: 31, nama: "Nazifah Salsabila", asal: "SMA Bina Insan Mandiri", jurusan: "Sastra Indonesia", universitas: "Universitas Muhammadiyah Surakarta"},
    {no: 32, nama: "Putri Fika Nur Fadliyah", asal: "SMA Bina Insan Mandiri", jurusan: "Pendidikan Bahasa Inggris", universitas: "Universitas Islam Negeri Surabaya"},
    {no: 33, nama: "Qisti Innayatullah Syam", asal: "SMA Bina Insan Mandiri", jurusan: "Bioteknologi", universitas: "Universitas Negeri Malang"},
    {no: 34, nama: "Raudhatul Jannah", asal: "SMA Bina Insan Mandiri", jurusan: "-", universitas: "Universitas Mulawarman"},
    {no: 35, nama: "Rifa Zahra Akhlisa Hasan", asal: "SMA Bina Insan Mandiri", jurusan: "Ilmu Komunikasi", universitas: "Universitas Teknologi Yogyakarta"},
    {no: 36, nama: "Rifqi Naila Ulumiyah", asal: "SMA Bina Insan Mandiri", jurusan: "Hukum", universitas: "Universitas Islam Negeri Surabaya"},
    {no: 37, nama: "Rinda Nia Malika", asal: "SMA Bina Insan Mandiri", jurusan: "Bisnis Digital", universitas: "Politeknik Banjarmasin"},
    {no: 38, nama: "Sajida Zahia farin", asal: "SMA Bina Insan Mandiri", jurusan: "Teknologi Rekayasa Media", universitas: "Politeknik Negri Media Kreatif"},
    {no: 39, nama: "Salsabila Sayla Ramadhana", asal: "SMA Bina Insan Mandiri", jurusan: "-", universitas: "Universitas Negeri Yogyakarta"},
    {no: 40, nama: "Syarifatu Aliya", asal: "SMA Bina Insan Mandiri", jurusan: "-", universitas: "Universitas Trunojoyo Madura"},
    {no: 41, nama: "Tsabita Anisa Fawwaz", asal: "SMA Bina Insan Mandiri", jurusan: "Gizi", universitas: "Universitas Airlangga"},
    {no: 42, nama: "Samrotul Maghfiroh", asal: "SMA Bina Insan Mandiri", jurusan: "IPS", universitas: "Universitas Negeri Malang"},
    {no: 43, nama: "Yumna Hanifah Nafisa Puspo Negoro", asal: "SMA Bina Insan Mandiri", jurusan: "Gizi", universitas: "Universitas Muhammadiyah Surakarta"},
    {no: 44, nama: "Zahra Prawesti Nugraha", asal: "SMA Bina Insan Mandiri", jurusan: "-", universitas: "Universitas Airlangga"},
    {no: 45, nama: "Abdul Adhim", asal: "SMA Bina Insan Mandiri", jurusan: "Komunikasi & penyiaran islam", universitas: "Universitas Islam Negeri Jakarta"},
    {no: 46, nama: "Akhmad Alfan Khoirul Rijal", asal: "SMA Bina Insan Mandiri", jurusan: "-", universitas: "-"},
    {no: 47, nama: "Alfa Ramdhani Putro Surianto", asal: "SMA Bina Insan Mandiri", jurusan: "-", universitas: "-"},
    {no: 48, nama: "Ammar Hafiz Rafi Syahputra", asal: "SMA Bina Insan Mandiri", jurusan: "Teknologi Veteriner", universitas: "Universitas Airlangga"},
    {no: 49, nama: "Avisenna Khalifa Ahmad", asal: "SMA Bina Insan Mandiri", jurusan: "Teknologi Laboratorium Medik", universitas: "Universitas Airlangga"},
    {no: 50, nama: "Bilal Akbar Mujahid", asal: "SMA Bina Insan Mandiri", jurusan: "-", universitas: "-"},
    {no: 51, nama: "Faqih Fatihul Alam", asal: "SMA Bina Insan Mandiri", jurusan: "Peternakan", universitas: "Universitas Brawijaya"},
    {no: 52, nama: "Fauzi Romadhoni", asal: "SMA Bina Insan Mandiri", jurusan: "Pendidikan Bahasa Arab", universitas: "UIN Maulana Malik Ibrahim Malang"},
    {no: 53, nama: "Hamdan Zulfa", asal: "SMA Bina Insan Mandiri", jurusan: "Teknik Mesin", universitas: "PSDKU Poleteknik Negeri Malang"},
    {no: 54, nama: "Juliansyah Aditya Al-Faris", asal: "SMA Bina Insan Mandiri", jurusan: "Peternakan", universitas: "Universitas Brawijaya"},
    {no: 55, nama: "M. Fadhil Al Fikri", asal: "SMA Bina Insan Mandiri", jurusan: "Arsitektur", universitas: "Universitas Pendidikan Indonesia"},
    {no: 56, nama: "M. Abyan Aqiil Bambang", asal: "SMA Bina Insan Mandiri", jurusan: "-", universitas: "-"},
    {no: 57, nama: "Muh Syaddad Mubarak", asal: "SMA Bina Insan Mandiri", jurusan: "Sistem Informasi", universitas: "Amikom Yogyakarta"},
    {no: 58, nama: "Muhammad Abdan Syakuur", asal: "SMA Bina Insan Mandiri", jurusan: "Keperawatan", universitas: "Universitas Lambung Mangkurat"},
    {no: 59, nama: "Muhammad Alfareza", asal: "SMA Bina Insan Mandiri", jurusan: "-", universitas: "-"},
    {no: 60, nama: "Muhammad Arjuna Zacky Zain", asal: "SMA Bina Insan Mandiri", jurusan: "Akuntansi", universitas: "PSDKU Uneversitas Negeri Surabaya"},
    {no: 61, nama: "Muhammad Faaiz Taufiqurrahman.", asal: "SMA Bina Insan Mandiri", jurusan: "Bisnis Digital", universitas: "Universitas Negeri Surabaya"},
    {no: 62, nama: "Muhammad Fawwaz Taufiqulhakim", asal: "SMA Bina Insan Mandiri", jurusan: "Teknik Informatika", universitas: "Universitas Negeri Surabaya"},
    {no: 63, nama: "Muhammad Ghazy Farih Hibban", asal: "SMA Bina Insan Mandiri", jurusan: "Sastra Indonesia", universitas: "Universitas Negeri Malang"},
    {no: 64, nama: "Muhammad Hafiz Al Kindi", asal: "SMA Bina Insan Mandiri", jurusan: "-", universitas: "-"},
    {no: 65, nama: "Muhammad Haqqi Alfaqih", asal: "SMA Bina Insan Mandiri", jurusan: "(D4) Teknik Perkapalan", universitas: "Politeknik Perkapalan Negeri Surabaya"},
    {no: 66, nama: "Muhammad Harist Khoirullah", asal: "SMA Bina Insan Mandiri", jurusan: "-", universitas: "-"},
    {no: 67, nama: "Muhammad Jundin Abdillah", asal: "SMA Bina Insan Mandiri", jurusan: "Pendidikan Bahasa Arab", universitas: "UIN Maulana Malik Ibrahim Malang"},
    {no: 68, nama: "Muhammad Lutfi Ma'rifatullah", asal: "SMA Bina Insan Mandiri", jurusan: "Manajemen", universitas: "Universitas Nadhatul Ulama Surabaya"},
    {no: 69, nama: "Muhammad Maulana Nuridduja", asal: "SMA Bina Insan Mandiri", jurusan: "Manajemen Pendidikan Islam", universitas: "Universitas Islam Negeri Samarinda"},
    {no: 70, nama: "Muhammad Nurhafidz Eka Febrian", asal: "SMA Bina Insan Mandiri", jurusan: "Perawatan Mesin", universitas: "Politeknik Sinar Berau Coal"},
    {no: 71, nama: "Muhammad Rifqi Arinal Haq", asal: "SMA Bina Insan Mandiri", jurusan: "Matematika", universitas: "Universitas Negeri Jember"},
    {no: 72, nama: "Muhammad Salman Al Farisi", asal: "SMA Bina Insan Mandiri", jurusan: "Psikologi", universitas: "Universitas Negeri Surabaya"},
    {no: 73, nama: "Muhammad Syams Youviansyah", asal: "SMA Bina Insan Mandiri", jurusan: "Matematika", universitas: "Universitas Negeri Yogyakarta"},
    {no: 74, nama: "Muhammad Syamil Fauzan Nabil", asal: "SMA Bina Insan Mandiri", jurusan: "Peternakan", universitas: "Universitas Brawijaya"},
    {no: 75, nama: "Muhammad Syauqi Ar Royyan", asal: "SMA Bina Insan Mandiri", jurusan: "Pertanian", universitas: "Universitas Trunojoyo"},
    {no: 76, nama: "Muhammad Taqiyuddin", asal: "SMA Bina Insan Mandiri", jurusan: "Fisika", universitas: "UIN Syarif Hidayatullah"},
    {no: 77, nama: "Muhammad Zaidan Ar-Rabbani Z.", asal: "SMA Bina Insan Mandiri", jurusan: "Teknologi Informasi", universitas: "Universitas Brawijaya"},
    {no: 78, nama: "Nabil Putra Nur Ramadhan", asal: "SMA Bina Insan Mandiri", jurusan: "Bahasa & Satra Arab", universitas: "UIN Maulana Malik Ibrahim Malang"},
    {no: 79, nama: "Prio Rafi Musyaffa", asal: "SMA Bina Insan Mandiri", jurusan: "Peternakan", universitas: "Universitas Brawijaya"},
    {no: 80, nama: "Rahmat Suryadi", asal: "SMA Bina Insan Mandiri", jurusan: "PGSD", universitas: "Universitas Negeri Malang"},
    {no: 81, nama: "Sirhan Muzaffar Ramadhan", asal: "SMA Bina Insan Mandiri", jurusan: "(D4) Radiologi Teknologi Pencitraan", universitas: "Universitas Airlangga"},
    {no: 82, nama: "Syah Ali Abdullah Qodim", asal: "SMA Bina Insan Mandiri", jurusan: "Hukum Keluarga Islam", universitas: "UIN Sayyid Ali Rahmatullah Tulungagung"},
    {no: 83, nama: "Syahidan Fajar Wahid", asal: "SMA Bina Insan Mandiri", jurusan: "Teknologi Pendidikan", universitas: "Universitas Negeri Surabaya"},
    {no: 84, nama: "Taqiyuddin Zumar Alfaiz", asal: "SMA Bina Insan Mandiri", jurusan: "Manajemen", universitas: "Universitas Negeri Surabaya"},
    {no: 85, nama: "Thariq Saif Mediteran", asal: "SMA Bina Insan Mandiri", jurusan: "Fisika", universitas: "Universitas Diponegoro"},
    {no: 86, nama: "Umar Fatih Arkanuddin", asal: "SMA Bina Insan Mandiri", jurusan: "Tadris Matematika", universitas: "UIN Maulana Malik Ibrahim Malang"},
    {no: 87, nama: "Zian Fadhil Mubarok", asal: "SMA Bina Insan Mandiri", jurusan: "-", universitas: "Universitas Negeri Surabaya"}
];

// Render Cards to Grid
function renderCards(data) {
    const grid = document.getElementById('alumniGrid');
    grid.innerHTML = '';
    
    data.forEach(student => {
        const card = document.createElement('div');
        card.className = 'alumni-card neo-box';
        card.innerHTML = `
            <span class="badge-no neo-inset">#${student.no}</span>
            <div class="alumni-info">
                <h3>${student.nama}</h3>
                <p>🏫 ${student.asal}</p>
                <span class="major-badge">📚 ${student.jurusan && student.jurusan !== '-' ? student.jurusan : 'Belum ditentukan'}</span>
                <p>🎓 <strong>${student.universitas && student.universitas !== '-' ? student.universitas : 'Belum ada info'}</strong></p>
            </div>
            <button class="neo-btn detail-card-btn" onclick="showDetail(${student.no}, '${student.nama.replace(/'/g, "\\'")}', '${student.jurusan.replace(/'/g, "\\'")}', '${student.universitas.replace(/'/g, "\\'")}')">Lihat Detail</button>
        `;
        grid.appendChild(card);
    });
}

// Initialize Cards on Load
document.addEventListener('DOMContentLoaded', () => {
    renderCards(studentsData);
});

// Search functionality
function searchCards() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = studentsData.filter(s => 
        s.nama.toLowerCase().includes(query) || 
        s.jurusan.toLowerCase().includes(query) || 
        s.universitas.toLowerCase().includes(query)
    );
    renderCards(filtered);
}

// Filter by Campus
function filterByCampus(campus, btnElement) {
    document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');

    if (campus === 'All') {
        renderCards(studentsData);
    } else {
        const filtered = studentsData.filter(s => s.universitas.includes(campus));
        renderCards(filtered);
    }
}

// Login Logic
function handleLogin(event) {
    event.preventDefault();
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;

    const valid = [
        {u: 'Admin', p: 'Admin201224'},
        {u: 'Luminare', p: 'LuminareX'},
        {u: 'IOS', p: 'IOSX'}
    ].some(c => c.u === u && c.p === p);

    if (valid) {
        showSuccessMessage('Login berhasil! Selamat datang!');
        setTimeout(() => {
            document.getElementById('loginOverlay').style.display = 'none';
            document.getElementById('mainContent').classList.add('visible');
        }, 800);
    } else {
        alert('Username atau password salah! Sesuai ketentuan ya gess...');
    }
}

function togglePassword() {
    const pass = document.getElementById('password');
    pass.type = pass.type === 'password' ? 'text' : 'password';
}

function logout() {
    if (confirm('Yakin ingin logout?')) {
        document.getElementById('mainContent').classList.remove('visible');
        document.getElementById('loginOverlay').style.display = 'flex';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }
}

// Detail Modal
function showDetail(no, nama, jurusan, universitas) {
    const gender = no <= 44 ? 'Putri' : 'Putra';
    const detailHTML = `
        <button class="close-detail" onclick="closeDetailPopup()">&times;</button>
        <div style="text-align:center; margin-bottom: 15px;">
            <div style="font-size: 40px;">🎓</div>
            <h3 style="color:#2d3748; margin-top:5px;">${nama}</h3>
        </div>
        <hr style="border:0; border-top:1px solid #cbd5e0; margin:15px 0;">
        <p>📊 <strong>No Urut:</strong> #${no} (${gender})</p>
        <p>🏫 <strong>Asal Sekolah:</strong> SMA Bina Insan Mandiri</p>
        <p>📚 <strong>Jurusan Kuliah:</strong> ${jurusan}</p>
        <p>🎓 <strong>Universitas:</strong> ${universitas}</p>
        <p style="margin-top:10px; font-size:12px; color:#718096; text-align:center;">💡 Sukses selalu di jenjang perkuliahan!</p>
    `;
    document.getElementById('detailInfo').innerHTML = detailHTML;
    document.getElementById('detailOverlay').style.display = 'flex';
}

function closeDetailPopup() {
    document.getElementById('detailOverlay').style.display = 'none';
}

function showSuccessMessage(msg) {
    const div = document.createElement('div');
    div.className = 'success-message';
    div.textContent = msg;
    document.body.appendChild(div);
    setTimeout(() => div.classList.add('show'), 100);
    setTimeout(() => {
        div.classList.remove('show');
        setTimeout(() => div.remove(), 300);
    }, 2500);
}

function navigateTo(page) {
    showSuccessMessage(`Navigasi ke halaman ${page}`);
}
