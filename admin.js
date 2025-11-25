// ============================================
// ADMIN DASHBOARD - FUNCTIONALITY
// ============================================

let currentUser = null;
let projectTechnologies = [];
let blogTags = [];

// ============================================
// AUTHENTICATION
// ============================================

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', () => {
    if (API.auth.isAuthenticated()) {
        checkAuth();
    }
});

// Login form handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await API.auth.login({ email, password });

        if (response.success && response.user.role === 'admin') {
            currentUser = response.user;
            showDashboard();
            loadDashboardData();
        } else {
            showAlert('loginAlert', 'Only admin users can access this dashboard', 'error');
        }
    } catch (error) {
        showAlert('loginAlert', error.message || 'Login failed', 'error');
    }
});

// Check authentication
async function checkAuth() {
    try {
        const response = await API.auth.getCurrentUser();
        if (response.success && response.user.role === 'admin') {
            currentUser = response.user;
            showDashboard();
            loadDashboardData();
        } else {
            API.auth.logout();
            showLogin();
        }
    } catch (error) {
        API.auth.logout();
        showLogin();
    }
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    API.auth.logout();
    currentUser = null;
    showLogin();
});

// Show/hide sections
function showLogin() {
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
    document.getElementById('adminUsername').textContent = currentUser.username;
}

// ============================================
// NAVIGATION
// ============================================

document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const section = btn.dataset.section;

        // Update active button
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Show section
        document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
        document.getElementById(section).classList.add('active');

        // Load section data
        if (section === 'projects') loadProjects();
        if (section === 'blog') loadBlogPosts();
        if (section === 'contact') loadContactSubmissions();
    });
});

// ============================================
// DASHBOARD STATS
// ============================================

async function loadDashboardData() {
    try {
        const [projects, blog, contact] = await Promise.all([
            API.projects.getAll(),
            API.blog.getAllAdmin(),
            API.contact.getAll()
        ]);

        document.getElementById('projectCount').textContent = projects.count || 0;
        document.getElementById('blogCount').textContent = blog.count || 0;
        document.getElementById('contactCount').textContent = contact.count || 0;
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// ============================================
// PROJECTS MANAGEMENT
// ============================================

async function loadProjects() {
    try {
        const response = await API.projects.getAll();
        const tbody = document.getElementById('projectsTableBody');

        if (response.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No projects yet</td></tr>';
            return;
        }

        tbody.innerHTML = response.data.map(project => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 1.5rem;">${project.image || '📁'}</span>
                        <strong>${project.title}</strong>
                    </div>
                </td>
                <td>
                    ${project.technologies.map(tech =>
            `<span class="badge badge-success">${tech}</span>`
        ).join(' ')}
                </td>
                <td>
                    ${project.featured ?
                '<span class="badge badge-success">Yes</span>' :
                '<span class="badge badge-warning">No</span>'}
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-secondary" onclick="editProject('${project._id}')">Edit</button>
                        <button class="btn btn-danger" onclick="deleteProject('${project._id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        showAlert('projectsAlert', 'Error loading projects: ' + error.message, 'error');
    }
}

// Add project button
document.getElementById('addProjectBtn').addEventListener('click', () => {
    openProjectModal();
});

// Project form
document.getElementById('projectForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const projectData = {
        title: document.getElementById('projectTitle').value,
        description: document.getElementById('projectDescription').value,
        image: document.getElementById('projectImage').value,
        technologies: projectTechnologies,
        projectUrl: document.getElementById('projectUrl').value,
        githubUrl: document.getElementById('projectGithub').value,
        featured: document.getElementById('projectFeatured').checked
    };

    try {
        const projectId = document.getElementById('projectId').value;

        if (projectId) {
            await API.projects.update(projectId, projectData);
            showAlert('projectsAlert', 'Project updated successfully!', 'success');
        } else {
            await API.projects.create(projectData);
            showAlert('projectsAlert', 'Project created successfully!', 'success');
        }

        closeProjectModal();
        loadProjects();
        loadDashboardData();
    } catch (error) {
        alert('Error saving project: ' + error.message);
    }
});

// Technology tags input
document.getElementById('projectTechInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const value = e.target.value.trim();
        if (value && !projectTechnologies.includes(value)) {
            projectTechnologies.push(value);
            renderTechTags();
            e.target.value = '';
        }
    }
});

function renderTechTags() {
    const container = document.getElementById('projectTechTags');
    container.innerHTML = projectTechnologies.map((tech, index) => `
        <span class="tag-item">
            ${tech}
            <button type="button" class="tag-remove" onclick="removeTechTag(${index})">&times;</button>
        </span>
    `).join('');
}

function removeTechTag(index) {
    projectTechnologies.splice(index, 1);
    renderTechTags();
}

function openProjectModal(project = null) {
    if (project) {
        document.getElementById('projectModalTitle').textContent = 'Edit Project';
        document.getElementById('projectId').value = project._id;
        document.getElementById('projectTitle').value = project.title;
        document.getElementById('projectDescription').value = project.description;
        document.getElementById('projectImage').value = project.image || '';
        document.getElementById('projectUrl').value = project.projectUrl || '';
        document.getElementById('projectGithub').value = project.githubUrl || '';
        document.getElementById('projectFeatured').checked = project.featured;
        projectTechnologies = [...project.technologies];
        renderTechTags();
    } else {
        document.getElementById('projectModalTitle').textContent = 'Add Project';
        document.getElementById('projectForm').reset();
        document.getElementById('projectId').value = '';
        projectTechnologies = [];
        renderTechTags();
    }

    document.getElementById('projectModal').classList.add('active');
}

function closeProjectModal() {
    document.getElementById('projectModal').classList.remove('active');
    document.getElementById('projectForm').reset();
    projectTechnologies = [];
}

async function editProject(id) {
    try {
        const response = await API.projects.getById(id);
        openProjectModal(response.data);
    } catch (error) {
        alert('Error loading project: ' + error.message);
    }
}

async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
        await API.projects.delete(id);
        showAlert('projectsAlert', 'Project deleted successfully!', 'success');
        loadProjects();
        loadDashboardData();
    } catch (error) {
        showAlert('projectsAlert', 'Error deleting project: ' + error.message, 'error');
    }
}

// ============================================
// BLOG MANAGEMENT
// ============================================

async function loadBlogPosts() {
    try {
        const response = await API.blog.getAllAdmin();
        const tbody = document.getElementById('blogTableBody');

        if (response.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No blog posts yet</td></tr>';
            return;
        }

        tbody.innerHTML = response.data.map(post => `
            <tr>
                <td><strong>${post.title}</strong></td>
                <td>${post.category || 'General'}</td>
                <td>
                    ${post.published ?
                '<span class="badge badge-success">Published</span>' :
                '<span class="badge badge-warning">Draft</span>'}
                </td>
                <td>${post.views || 0}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-secondary" onclick="editBlogPost('${post._id}')">Edit</button>
                        <button class="btn btn-danger" onclick="deleteBlogPost('${post._id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        showAlert('blogAlert', 'Error loading blog posts: ' + error.message, 'error');
    }
}

// Add blog button
document.getElementById('addBlogBtn').addEventListener('click', () => {
    openBlogModal();
});

// Blog form
document.getElementById('blogForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const postData = {
        title: document.getElementById('blogTitle').value,
        excerpt: document.getElementById('blogExcerpt').value,
        content: document.getElementById('blogContent').value,
        category: document.getElementById('blogCategory').value || 'General',
        tags: blogTags,
        published: document.getElementById('blogPublished').checked
    };

    try {
        const postId = document.getElementById('blogId').value;

        if (postId) {
            await API.blog.update(postId, postData);
            showAlert('blogAlert', 'Blog post updated successfully!', 'success');
        } else {
            await API.blog.create(postData);
            showAlert('blogAlert', 'Blog post created successfully!', 'success');
        }

        closeBlogModal();
        loadBlogPosts();
        loadDashboardData();
    } catch (error) {
        alert('Error saving blog post: ' + error.message);
    }
});

// Blog tags input
document.getElementById('blogTagInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const value = e.target.value.trim();
        if (value && !blogTags.includes(value)) {
            blogTags.push(value);
            renderBlogTags();
            e.target.value = '';
        }
    }
});

function renderBlogTags() {
    const container = document.getElementById('blogTagsContainer');
    container.innerHTML = blogTags.map((tag, index) => `
        <span class="tag-item">
            ${tag}
            <button type="button" class="tag-remove" onclick="removeBlogTag(${index})">&times;</button>
        </span>
    `).join('');
}

function removeBlogTag(index) {
    blogTags.splice(index, 1);
    renderBlogTags();
}

function openBlogModal(post = null) {
    if (post) {
        document.getElementById('blogModalTitle').textContent = 'Edit Blog Post';
        document.getElementById('blogId').value = post._id;
        document.getElementById('blogTitle').value = post.title;
        document.getElementById('blogExcerpt').value = post.excerpt || '';
        document.getElementById('blogContent').value = post.content;
        document.getElementById('blogCategory').value = post.category || '';
        document.getElementById('blogPublished').checked = post.published;
        blogTags = [...(post.tags || [])];
        renderBlogTags();
    } else {
        document.getElementById('blogModalTitle').textContent = 'Add Blog Post';
        document.getElementById('blogForm').reset();
        document.getElementById('blogId').value = '';
        blogTags = [];
        renderBlogTags();
    }

    document.getElementById('blogModal').classList.add('active');
}

function closeBlogModal() {
    document.getElementById('blogModal').classList.remove('active');
    document.getElementById('blogForm').reset();
    blogTags = [];
}

async function editBlogPost(id) {
    try {
        // Get post by ID (we need to find it in the loaded posts)
        const response = await API.blog.getAllAdmin();
        const post = response.data.find(p => p._id === id);
        if (post) {
            openBlogModal(post);
        }
    } catch (error) {
        alert('Error loading blog post: ' + error.message);
    }
}

async function deleteBlogPost(id) {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
        await API.blog.delete(id);
        showAlert('blogAlert', 'Blog post deleted successfully!', 'success');
        loadBlogPosts();
        loadDashboardData();
    } catch (error) {
        showAlert('blogAlert', 'Error deleting blog post: ' + error.message, 'error');
    }
}

// ============================================
// CONTACT SUBMISSIONS
// ============================================

async function loadContactSubmissions() {
    try {
        const response = await API.contact.getAll();
        const tbody = document.getElementById('contactTableBody');

        if (response.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No contact submissions yet</td></tr>';
            return;
        }

        tbody.innerHTML = response.data.map(contact => `
            <tr>
                <td><strong>${contact.name}</strong></td>
                <td>${contact.email}</td>
                <td>${contact.subject || 'General Inquiry'}</td>
                <td>
                    ${contact.status === 'new' ? '<span class="badge badge-danger">New</span>' :
                contact.status === 'read' ? '<span class="badge badge-warning">Read</span>' :
                    '<span class="badge badge-success">Replied</span>'}
                </td>
                <td>${new Date(contact.createdAt).toLocaleDateString()}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-secondary" onclick="viewContact('${contact._id}')">View</button>
                        <button class="btn btn-danger" onclick="deleteContact('${contact._id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        showAlert('contactAlert', 'Error loading contact submissions: ' + error.message, 'error');
    }
}

async function viewContact(id) {
    try {
        const response = await API.contact.getById(id);
        const contact = response.data;

        document.getElementById('contactDetail').innerHTML = `
            <div class="form-group">
                <label>Name</label>
                <p><strong>${contact.name}</strong></p>
            </div>
            <div class="form-group">
                <label>Email</label>
                <p><a href="mailto:${contact.email}">${contact.email}</a></p>
            </div>
            <div class="form-group">
                <label>Subject</label>
                <p>${contact.subject || 'General Inquiry'}</p>
            </div>
            <div class="form-group">
                <label>Message</label>
                <p style="white-space: pre-wrap;">${contact.message}</p>
            </div>
            <div class="form-group">
                <label>Status</label>
                <select id="contactStatus" class="form-control">
                    <option value="new" ${contact.status === 'new' ? 'selected' : ''}>New</option>
                    <option value="read" ${contact.status === 'read' ? 'selected' : ''}>Read</option>
                    <option value="replied" ${contact.status === 'replied' ? 'selected' : ''}>Replied</option>
                </select>
            </div>
            <div class="form-group">
                <label>Received</label>
                <p>${new Date(contact.createdAt).toLocaleString()}</p>
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                <button class="btn" onclick="updateContactStatus('${contact._id}')">Update Status</button>
                <button class="btn btn-secondary" onclick="closeContactModal()">Close</button>
            </div>
        `;

        document.getElementById('contactModal').classList.add('active');
    } catch (error) {
        alert('Error loading contact: ' + error.message);
    }
}

async function updateContactStatus(id) {
    const status = document.getElementById('contactStatus').value;

    try {
        await API.contact.updateStatus(id, status);
        closeContactModal();
        loadContactSubmissions();
        showAlert('contactAlert', 'Status updated successfully!', 'success');
    } catch (error) {
        alert('Error updating status: ' + error.message);
    }
}

function closeContactModal() {
    document.getElementById('contactModal').classList.remove('active');
}

async function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact submission?')) return;

    try {
        await API.contact.delete(id);
        showAlert('contactAlert', 'Contact submission deleted successfully!', 'success');
        loadContactSubmissions();
        loadDashboardData();
    } catch (error) {
        showAlert('contactAlert', 'Error deleting contact: ' + error.message, 'error');
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showAlert(elementId, message, type) {
    const alertDiv = document.getElementById(elementId);
    alertDiv.innerHTML = `
        <div class="alert alert-${type}">
            ${message}
        </div>
    `;

    setTimeout(() => {
        alertDiv.innerHTML = '';
    }, 5000);
}

console.log('🔐 Admin Dashboard Loaded!');
