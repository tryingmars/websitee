// ============================================
// API INTEGRATION FOR MAIN WEBSITE
// ============================================

// Load projects from API
async function loadProjects() {
    try {
        // Check if API is available
        if (typeof API === 'undefined') {
            console.log('API not loaded, skipping dynamic content');
            return;
        }

        const response = await API.projects.getAll();

        if (response.success && response.data.length > 0) {
            const projectsGrid = document.querySelector('.projects-grid');
            const emptyState = document.querySelector('.empty-state');

            // Hide empty state
            if (emptyState) {
                emptyState.style.display = 'none';
            }

            // Create projects grid if it doesn't exist
            if (!projectsGrid) {
                const projectsSection = document.querySelector('#projects .container');
                const newGrid = document.createElement('div');
                newGrid.className = 'projects-grid';
                projectsSection.appendChild(newGrid);
            }

            // Render projects
            const grid = document.querySelector('.projects-grid');
            grid.innerHTML = response.data.map(project => `
                <div class="project-card glass-card">
                    <div class="project-image">${project.image || '🚀'}</div>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tags">
                        ${project.technologies.map(tech =>
                `<span class="tag">${tech}</span>`
            ).join('')}
                    </div>
                    ${project.projectUrl || project.githubUrl ? `
                        <div class="project-links" style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                            ${project.projectUrl ? `<a href="${project.projectUrl}" target="_blank" class="cta-button" style="font-size: 0.85rem; padding: 0.5rem 1rem;">View Project</a>` : ''}
                            ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="cta-button" style="font-size: 0.85rem; padding: 0.5rem 1rem; background: var(--glass-bg);">GitHub</a>` : ''}
                        </div>
                    ` : ''}
                </div>
            `).join('');

            grid.style.display = 'grid';
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Handle contact form submission
function setupContactForm() {
    // Check if we're on a page with contact section
    const contactSection = document.querySelector('#contact');
    if (!contactSection) return;

    // Check if API is available
    if (typeof API === 'undefined') {
        console.log('API not loaded, contact form will not be functional');
        return;
    }

    // Create contact form if it doesn't exist
    let contactForm = document.querySelector('#contactForm');
    if (!contactForm) {
        const contactContent = document.querySelector('#contact .contact-content');
        if (contactContent) {
            const formHTML = `
                <form id="contactForm" style="margin-top: 2rem;">
                    <div style="margin-bottom: 1rem;">
                        <input type="text" id="contactName" placeholder="Your Name" required
                            style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); font-family: inherit;">
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <input type="email" id="contactEmail" placeholder="Your Email" required
                            style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); font-family: inherit;">
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <input type="text" id="contactSubject" placeholder="Subject"
                            style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); font-family: inherit;">
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <textarea id="contactMessage" placeholder="Your Message" required rows="5"
                            style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); font-family: inherit; resize: vertical;"></textarea>
                    </div>
                    <button type="submit" class="cta-button" style="width: 100%;">Send Message</button>
                    <div id="contactFormMessage" style="margin-top: 1rem;"></div>
                </form>
            `;
            contactContent.insertAdjacentHTML('beforeend', formHTML);
            contactForm = document.querySelector('#contactForm');
        }
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const messageDiv = document.getElementById('contactFormMessage');
            const originalBtnText = submitBtn.textContent;

            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            const contactData = {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                subject: document.getElementById('contactSubject').value || 'General Inquiry',
                message: document.getElementById('contactMessage').value
            };

            try {
                const response = await API.contact.submit(contactData);

                if (response.success) {
                    messageDiv.innerHTML = `
                        <div style="padding: 1rem; background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: var(--radius-md); color: #22c55e;">
                            ${response.message || 'Thank you for your message! I will get back to you soon.'}
                        </div>
                    `;
                    contactForm.reset();
                }
            } catch (error) {
                messageDiv.innerHTML = `
                    <div style="padding: 1rem; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: var(--radius-md); color: #ef4444;">
                        ${error.message || 'Failed to send message. Please try again.'}
                    </div>
                `;
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;

                // Clear message after 5 seconds
                setTimeout(() => {
                    messageDiv.innerHTML = '';
                }, 5000);
            }
        });
    }
}

// Initialize on page load
window.addEventListener('load', () => {
    loadProjects();
    setupContactForm();
});

console.log('📡 API Integration Loaded!');
