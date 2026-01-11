// 🔥 STUDY HUB + PROFESSOR BLOGS - PERFECT COUNTS (Study 3 + Blogs 3)
let studyFiles = [], blogsFiles = [];
let isLoading = false;

const subjectsConfig = {
    ml: {name: '🤖 Machine Learning', emoji: '🤖', id: 'ml'},
    crypto: {name: '🔐 Cryptography', emoji: '🔐', id: 'crypto'},
    spm: {name: '💻 Software PM', emoji: '💻', id: 'spm'},
    cc: {name: '☁️ Cloud Computing', emoji: '☁️', id: 'cc'},
    dm: {name: '🚨 Disaster Mgmt', emoji: '🚨', id: 'dm'}
};

// 🔥 PROFESSOR BLOGS - EXACTLY 3 JNTUK FACULTY
const professorBlogs = {
    blogs: [
        {
            id: 'prof-sandeep',
            name: '👨‍🏫 Dr. K. Sandeep',
            url: 'https://kottesandeep.blogspot.com/',
            icon: '👨‍💻',
            description: 'PYTHON • C • Java • Full Stack • Cloud • JNTUK R20/R23'
        },
        {
            id: 'prof-malleswara',
            name: '👨‍🏫 Dr. KND Malleswara Rao',
            url: 'https://drmalleswararao.blogspot.com/',
            icon: '📚',
            description: 'JAVA D23 • DBMS • Python • Cloud R20'
        },
        {
            id: 'prof-raju',
            name: '👨‍🏫 MR. J.V.N Raju',
            url: 'https://veranagaraju.blogspot.com/',
            icon: '💻',
            description: 'Advanced Java • Lab Solutions • AJP Units'
        }
    ]
};

// 🔥 UTILITY FUNCTIONS
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg','jpeg','png','gif','webp'].includes(ext)) return '🖼️';
    if (['pdf'].includes(ext)) return '📚';
    if (['txt','md'].includes(ext)) return '📝';
    if (['zip'].includes(ext)) return '📦';
    if (['doc','docx'].includes(ext)) return '📄';
    return '📎';
}

function showSnackbar(message, duration = 4000) {
    const snackbar = document.getElementById('snackbar');
    if (!snackbar) { alert(message); return; }
    snackbar.textContent = message;
    snackbar.classList.remove('show');
    snackbar.offsetHeight;
    snackbar.classList.add('show');
    setTimeout(() => snackbar.classList.remove('show'), duration);
}

function showLoading() {
    const containers = ['subjectsList', 'blogsList'];
    containers.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            container.innerHTML = '<div style="text-align:center;padding:3rem;color:rgba(255,255,255,0.5);">🔄 Loading...</div>';
        }
    });
}

// 🔥 COUNT FUNCTIONS - SHOWS PERFECT COUNTS
function updateStudyCount() {
    const count = studyFiles.length;
    const studyCount = document.getElementById('studyCount');
    const studyCountHeader = document.getElementById('studyCountHeader');
    if (studyCount) studyCount.textContent = count;
    if (studyCountHeader) studyCountHeader.textContent = count;
}

function updateBlogsCount() {
    const count = professorBlogs.blogs.length; // ALWAYS 3 professor blogs
    const blogsCount = document.getElementById('blogsCount');
    const blogsCountHeader = document.getElementById('blogsCountHeader');
    if (blogsCount) blogsCount.textContent = count;
    if (blogsCountHeader) blogsCountHeader.textContent = count;
}

// 🔥 ALL EVENT HANDLERS
document.addEventListener('DOMContentLoaded', function() {
    // Welcome screen → Dashboard transition
    const welcomeScreen = document.getElementById('welcomeScreen');
    const mainDashboard = document.getElementById('mainDashboard');
    const enterDashboardBtn = document.getElementById('enterDashboard');

    if (welcomeScreen && enterDashboardBtn && mainDashboard) {
        enterDashboardBtn.addEventListener('click', function() {
            welcomeScreen.classList.remove('active');
            setTimeout(() => {
                welcomeScreen.style.display = 'none';
                mainDashboard.style.display = 'block';
                mainDashboard.style.opacity = '0';
                mainDashboard.style.transform = 'translateY(40px)';
                setTimeout(() => {
                    mainDashboard.style.transition = 'all 0.8s ease';
                    mainDashboard.style.opacity = '1';
                    mainDashboard.style.transform = 'translateY(0)';
                    loadAllFiles();
                    showSnackbar('🚀 Study Hub + 3 Professor Blogs Loaded!', 5000);
                }, 50);
            }, 600);
        });
    }

    setupDashboardEvents();
    if (!welcomeScreen) loadAllFiles();
});

function setupDashboardEvents() {
    // Welcome text
    const welcomeText = document.getElementById('welcomeText');
    if (welcomeText) welcomeText.textContent = 'Welcome to Study Hub 🌿';

    // Sidebar menu navigation
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const section = item.getAttribute('data-section');
            showSection(section);
        });
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
        });
    }

  // 🔥 HOME BUTTON → SHOW WELCOME SCREEN
const homeBtn = document.getElementById('homeBtn');
if (homeBtn) {
    homeBtn.onclick = function(e) {
        e.preventDefault();
        showSnackbar('🏠 Returning to Welcome...');
        
        // Hide dashboard, show welcome screen
        const mainDashboard = document.getElementById('mainDashboard');
        const welcomeScreen = document.getElementById('welcomeScreen');
        
        if (mainDashboard) mainDashboard.style.display = 'none';
        if (welcomeScreen) {
            welcomeScreen.style.display = 'flex';
            welcomeScreen.classList.add('active');
        }
    };
}

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = function(e) {
            e.preventDefault();
            if (confirm('Logout and return to login?')) {
                showSnackbar('🚪 Logging out...');
                sessionStorage.clear();
                fetch('/logout', {method: 'GET'}).then(() => {
                    window.location.href = '/';
                }).catch(() => {
                    window.location.href = '/';
                });
            }
        };
    }

    // Profile image upload
    const imageUpload = document.getElementById('imageUpload');
    if (imageUpload) {
        imageUpload.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(ev) {
                    document.getElementById('profileCenter').src = ev.target.result;
                    document.getElementById('avatarHeader').src = ev.target.result;
                    sessionStorage.setItem('profileImg', ev.target.result);
                    showSnackbar('👤 Profile photo updated!');
                };
                reader.readAsDataURL(file);
            }
        };
    }

    // Load saved profile image
    const savedImg = sessionStorage.getItem('profileImg');
    if (savedImg) {
        const profileCenter = document.getElementById('profileCenter');
        const avatarHeader = document.getElementById('avatarHeader');
        if (profileCenter) profileCenter.src = savedImg;
        if (avatarHeader) avatarHeader.src = savedImg;
    }
}

// 🔥 MAIN DATA LOADING
async function loadAllFiles() {
    if (isLoading) return;
    isLoading = true;
    showLoading();
    
    try {
        const [study, blogs] = await Promise.all([
            fetch('/api/files/study', {credentials: 'include'}).then(r => r.ok ? r.json() : []),
            fetch('/api/files/blogs', {credentials: 'include'}).then(r => r.ok ? r.json() : [])
        ]);
        
        studyFiles = study || [];
        blogsFiles = blogs || [];
        
        renderAllSections();
        updateStudyCount();
        updateBlogsCount();
        showSnackbar(`✅ ${studyFiles.length} Study Files + 3 Professor Blogs Loaded!`);
    } catch (error) {
        console.error('Load error:', error);
        showSnackbar('⚠️ Using demo data');
        useDemoData();
        renderAllSections();
    } finally {
        isLoading = false;
    }
}

async function uploadToSubject(event, subjectId, category = 'study') {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 200 * 1024 * 1024) {
        showSnackbar('❌ File too large! Max 200MB');
        event.target.value = '';
        return;
    }
    
    showSnackbar(`📤 Uploading "${file.name}"...`);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('subject', subjectId);
    
    try {
        const response = await fetch('/api/files/upload', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            showSnackbar(`❌ ${errorData.error || 'Upload failed'}`);
            return;
        }
        
        showSnackbar(`✅ "${file.name}" uploaded successfully!`);
        event.target.value = '';
        setTimeout(loadAllFiles, 500);
    } catch (error) {
        console.error('Upload error:', error);
        showSnackbar('❌ Network error - Check connection');
    }
}

// 🔥 RENDERING FUNCTIONS
function useDemoData() {
    studyFiles = [
        {id: 1, name: 'ML_Notes.pdf', size: 2457600, subject: 'ml'},
        {id: 2, name: 'Crypto_Lecture.pdf', size: 5120000, subject: 'crypto'},
        {id: 3, name: 'SPM_Handout.pdf', size: 1234567, subject: 'spm'}
    ];
    blogsFiles = [{id: 4, name: 'JNTUK_R20_Notes.md', size: 20480}];
}

function renderFiles(container, files) {
    if (!container) return;
    container.innerHTML = '';
    
    if (files.length === 0) {
        container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:rgba(255,255,255,0.5);">No files yet. Upload using ➕ button! 📤</div>';
        return;
    }
    
    files.slice(0, 12).forEach(file => {
        const div = document.createElement('div');
        div.className = 'file-item';
        div.innerHTML = `
            <div class="file-icon">${getFileIcon(file.name)}</div>
            <div class="file-name">${file.name}</div>
            <div class="file-size">${formatFileSize(file.size)}</div>
            <button class="delete-btn" onclick="deleteFile(${file.id}); event.stopPropagation();">🗑️ Delete</button>
        `;
        div.onclick = () => openFile(file);
        container.appendChild(div);
    });
}

function renderStudySubjects() {
    const container = document.getElementById('subjectsList');
    if (!container) return;
    
    container.innerHTML = '';
    let totalStudyFiles = 0;
    
    Object.values(subjectsConfig).forEach(config => {
        const files = studyFiles.filter(f => 
            f.subject === config.id || 
            f.name.toLowerCase().includes(config.id)
        );
        totalStudyFiles += files.length;
        
        const subjectDiv = document.createElement('div');
        subjectDiv.className = 'subject-group';
        subjectDiv.innerHTML = `
            <div class="subject-header">
                <h4>${config.emoji} ${config.name} (${files.length})</h4>
                <div class="upload-controls">
                    <input type="file" id="${config.id}Upload" accept=".pdf,.ppt,.pptx,.doc,.docx,image/*,.zip,.txt,.md" style="display:none;" onchange="uploadToSubject(event, '${config.id}', 'study')">
                    <label for="${config.id}Upload" class="upload-btn" title="Upload ${config.name}">➕ Upload</label>
                </div>
            </div>
            <div id="${config.id}Files" class="files-grid" style="min-height:60px;"></div>
        `;
        container.appendChild(subjectDiv);
        renderFiles(document.getElementById(`${config.id}Files`), files);
    });
    
    updateStudyCount();
}

function renderProfessorBlogs() {
    const blogsList = document.getElementById('blogsList');
    if (!blogsList) return;
    
    blogsList.innerHTML = `
        <div style="text-align: center; margin: 2rem 0;">
            <h4 style="color: #FFD700; font-size: 1.8rem; margin-bottom: 1rem;">👨‍🏫 JNTUK Professor Blogs</h4>
            <p style="color: rgba(255,255,255,0.9); font-size: 1.1rem;">Official faculty materials + R20/R23 notes + lab solutions</p>
        </div>
        <div class="blogs-grid">
            ${professorBlogs.blogs.map(blog => `
                <div class="blog-card">
                    <div class="blog-icon">${blog.icon}</div>
                    <div class="blog-name">${blog.name}</div>
                    <div class="blog-desc">${blog.description}</div>
                    <a href="${blog.url}" target="_blank" class="blog-visit-btn" onclick="showSnackbar('🌐 Opening ${blog.name}...'); return true;">
                        🌐 Visit Blog
                    </a>
                </div>
            `).join('')}
        </div>
    `;
    
    updateBlogsCount();
}

async function deleteFile(fileId) {
    if (!confirm('Delete this file permanently?')) return;
    showSnackbar('🗑️ Deleting file...');
    
    try {
        const response = await fetch(`/api/files/${fileId}`, { 
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (response.ok) {
            showSnackbar('✅ File deleted successfully!');
            setTimeout(loadAllFiles, 800);
        } else {
            showSnackbar('❌ Delete failed - try again');
        }
    } catch (error) {
        console.error('Delete error:', error);
        showSnackbar('❌ Network error');
    }
}

function openFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    if (['jpg','jpeg','png','gif','webp'].includes(ext)) {
        showImagePreview(`/files/${file.id}`);
    } else {
        showSnackbar(`📥 Downloading "${file.name}"...`);
        window.open(`/files/${file.id}`, '_blank');
    }
}

function showImagePreview(url) {
    const preview = document.getElementById('filePreview');
    preview.innerHTML = `
        <button id="previewClose" style="position:absolute;top:20px;right:20px;background:rgba(255,0,0,0.8);border:2px solid white;color:white;padding:0.8rem;border-radius:50%;cursor:pointer;font-size:1.5rem;font-weight:bold;width:60px;height:60px;display:flex;align-items:center;justify-content:center;">✕</button>
        <img src="${url}" alt="Preview" style="max-width:90%;max-height:90%;border-radius:20px;box-shadow:0 0 50px rgba(0,0,0,0.5);">
    `;
    preview.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    document.getElementById('previewClose').onclick = closePreview;
}

function closePreview() {
    document.getElementById('filePreview').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 🔥 MAIN RENDER - PERFECT COUNTS!
function renderAllSections() {
    renderStudySubjects();  // Shows Study files with count
    renderProfessorBlogs(); // Shows 3 professor blogs with count 3
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.files-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active from all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section + menu item
    const menuItem = document.querySelector(`[data-section="${sectionName}"]`);
    const section = document.getElementById(`${sectionName}Section`);
    
    if (menuItem) menuItem.classList.add('active');
    if (section) section.classList.add('active');
}
