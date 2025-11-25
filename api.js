// API Configuration
const API_BASE_URL = 'https://website-myme.onrender.com/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Set token in localStorage
const setToken = (token) => localStorage.setItem('token', token);

// Remove token from localStorage
const removeToken = () => localStorage.removeItem('token');

// API request helper
const apiRequest = async (endpoint, options = {}) => {
    const token = getToken();

    const config = {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers
        },
        ...options
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Authentication API
const authAPI = {
    register: (userData) => apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),

    login: async (credentials) => {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        if (data.token) {
            setToken(data.token);
        }
        return data;
    },

    logout: () => {
        removeToken();
    },

    getCurrentUser: () => apiRequest('/auth/me'),

    isAuthenticated: () => !!getToken()
};

// Projects API
const projectsAPI = {
    getAll: () => apiRequest('/projects'),

    getById: (id) => apiRequest(`/projects/${id}`),

    create: (projectData) => apiRequest('/projects', {
        method: 'POST',
        body: JSON.stringify(projectData)
    }),

    update: (id, projectData) => apiRequest(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(projectData)
    }),

    delete: (id) => apiRequest(`/projects/${id}`, {
        method: 'DELETE'
    })
};

// Blog API
const blogAPI = {
    getAll: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/blog${queryString ? '?' + queryString : ''}`);
    },

    getAllAdmin: () => apiRequest('/blog/all'),

    getBySlug: (slug) => apiRequest(`/blog/${slug}`),

    create: (postData) => apiRequest('/blog', {
        method: 'POST',
        body: JSON.stringify(postData)
    }),

    update: (id, postData) => apiRequest(`/blog/${id}`, {
        method: 'PUT',
        body: JSON.stringify(postData)
    }),

    delete: (id) => apiRequest(`/blog/${id}`, {
        method: 'DELETE'
    })
};

// Contact API
const contactAPI = {
    submit: (contactData) => apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify(contactData)
    }),

    getAll: (status) => {
        const queryString = status ? `?status=${status}` : '';
        return apiRequest(`/contact${queryString}`);
    },

    getById: (id) => apiRequest(`/contact/${id}`),

    updateStatus: (id, status) => apiRequest(`/contact/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    }),

    delete: (id) => apiRequest(`/contact/${id}`, {
        method: 'DELETE'
    })
};

// Upload API
const uploadAPI = {
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            headers: {
                ...(token && { Authorization: `Bearer ${token}` })
            },
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Upload failed');
        }

        return data;
    }
};

// Export all APIs
const API = {
    auth: authAPI,
    projects: projectsAPI,
    blog: blogAPI,
    contact: contactAPI,
    upload: uploadAPI,
    baseUrl: API_BASE_URL
};
