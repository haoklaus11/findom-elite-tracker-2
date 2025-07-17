// Admin Panel Core Functionality
class AdminPanel {
    constructor() {
        this.currentTab = 'tasks';
        this.tasks = [];
        this.users = [];
        this.codes = [];
        this.tributes = [];
        this.settings = {};
        this.init();
    }

    init() {
        this.loadSettings();
        this.loadData();
        this.setupEventListeners();
        this.showNotification('Admin panel initialized', 'success');
    }

    loadSettings() {
        const saved = localStorage.getItem('admin_settings');
        this.settings = saved ? JSON.parse(saved) : {
            githubRepo: '',
            githubToken: '',
            syncInterval: 15,
            discordWebhook: '',
            discordChannel: '#tributes',
            defaultPoints: 25,
            sessionDuration: 30,
            tributeAmounts: [25, 50, 75, 100]
        };
    }

    saveSettings() {
        localStorage.setItem('admin_settings', JSON.stringify(this.settings));
    }

    loadData() {
        // Load tasks
        const savedTasks = localStorage.getItem('admin_tasks');
        this.tasks = savedTasks ? JSON.parse(savedTasks) : this.getDefaultTasks();

        // Load users
        const savedUsers = localStorage.getItem('admin_users');
        this.users = savedUsers ? JSON.parse(savedUsers) : this.getDefaultUsers();

        // Load codes
        const savedCodes = localStorage.getItem('admin_codes');
        this.codes = savedCodes ? JSON.parse(savedCodes) : [];

        // Load tributes
        const savedTributes = localStorage.getItem('admin_tributes');
        this.tributes = savedTributes ? JSON.parse(savedTributes) : this.getDefaultTributes();

        this.refreshAllDisplays();
    }

    saveData() {
        localStorage.setItem('admin_tasks', JSON.stringify(this.tasks));
        localStorage.setItem('admin_users', JSON.stringify(this.users));
        localStorage.setItem('admin_codes', JSON.stringify(this.codes));
        localStorage.setItem('admin_tributes', JSON.stringify(this.tributes));
    }

    getDefaultTasks() {
        return [
            {
                id: 'task_1',
                title: 'Daily Tribute Submission',
                description: 'Submit your daily tribute to show devotion',
                difficulty: 'easy',
                points: 50,
                deadline: 24,
                status: 'active',
                assignedTo: null,
                createdAt: new Date().toISOString(),
                completedBy: []
            },
            {
                id: 'task_2',
                title: 'Weekly Report',
                description: 'Submit your weekly progress report',
                difficulty: 'medium',
                points: 100,
                deadline: 168,
                status: 'pending',
                assignedTo: null,
                createdAt: new Date().toISOString(),
                completedBy: []
            }
        ];
    }

    getDefaultUsers() {
        return [
            {
                id: 'user_1',
                username: 'devotedpet1',
                email: 'user1@example.com',
                status: 'active',
                joinedAt: new Date().toISOString(),
                lastSeen: new Date().toISOString(),
                totalTributes: 250,
                completedTasks: 15,
                obedienceLevel: 72
            },
            {
                id: 'user_2',
                username: 'submissive2',
                email: 'user2@example.com',
                status: 'active',
                joinedAt: new Date().toISOString(),
                lastSeen: new Date().toISOString(),
                totalTributes: 150,
                completedTasks: 8,
                obedienceLevel: 45
            }
        ];
    }

    getDefaultTributes() {
        return [
            {
                id: 'tribute_1',
                userId: 'user_1',
                username: 'devotedpet1',
                amount: 50,
                timestamp: new Date().toISOString(),
                status: 'completed',
                platform: 'throne'
            },
            {
                id: 'tribute_2',
                userId: 'user_2',
                username: 'submissive2',
                amount: 25,
                timestamp: new Date().toISOString(),
                status: 'completed',
                platform: 'throne'
            }
        ];
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('createTaskForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createTask();
        });

        // Settings forms
        document.getElementById('githubRepo')?.addEventListener('change', (e) => {
            this.settings.githubRepo = e.target.value;
            this.saveSettings();
        });

        document.getElementById('githubToken')?.addEventListener('change', (e) => {
            this.settings.githubToken = e.target.value;
            this.saveSettings();
        });

        document.getElementById('discordWebhook')?.addEventListener('change', (e) => {
            this.settings.discordWebhook = e.target.value;
            this.saveSettings();
        });
    }

    // Task Management
    createTask() {
        const form = document.getElementById('createTaskForm');
        const formData = new FormData(form);
        
        const task = {
            id: 'task_' + Date.now(),
            title: formData.get('title') || document.getElementById('taskTitle').value,
            description: formData.get('description') || document.getElementById('taskDescription').value,
            difficulty: formData.get('difficulty') || document.getElementById('taskDifficulty').value,
            points: parseInt(formData.get('points') || document.getElementById('taskPoints').value),
            deadline: parseInt(formData.get('deadline') || document.getElementById('taskDeadline').value),
            status: 'active',
            assignedTo: formData.get('assignedTo') || document.getElementById('taskAssignUser').value || null,
            createdAt: new Date().toISOString(),
            completedBy: []
        };

        this.tasks.push(task);
        this.saveData();
        this.refreshTasksDisplay();
        this.closeModal('createTaskModal');
        this.showNotification('Task created successfully!', 'success');
        
        // Sync with GitHub if configured
        if (this.settings.githubRepo && this.settings.githubToken) {
            this.syncTaskToGitHub(task);
        }
    }

    approveTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = 'active';
            this.saveData();
            this.refreshTasksDisplay();
            this.showNotification('Task approved!', 'success');
        }
    }

    denyTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = 'denied';
            this.saveData();
            this.refreshTasksDisplay();
            this.showNotification('Task denied!', 'info');
        }
    }

    assignTaskToUser(taskId, userId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.assignedTo = userId;
            this.saveData();
            this.refreshTasksDisplay();
            this.showNotification('Task assigned successfully!', 'success');
        }
    }

    // User Management
    updateUserStatus(userId, status) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            user.status = status;
            this.saveData();
            this.refreshUsersDisplay();
            this.showNotification(`User ${status} successfully!`, 'success');
        }
    }

    deleteUser(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            this.users = this.users.filter(u => u.id !== userId);
            this.saveData();
            this.refreshUsersDisplay();
            this.showNotification('User deleted successfully!', 'success');
        }
    }

    // Activation Code Management
    generateActivationCode() {
        const codeType = document.getElementById('codeType').value;
        const duration = parseInt(document.getElementById('codeDuration').value);
        const maxUses = parseInt(document.getElementById('codeMaxUses').value);
        
        const code = {
            id: 'code_' + Date.now(),
            code: this.generateRandomCode(),
            type: codeType,
            duration: duration,
            maxUses: maxUses,
            currentUses: 0,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + (duration * 24 * 60 * 60 * 1000)).toISOString(),
            status: 'active'
        };

        this.codes.push(code);
        this.saveData();
        this.refreshCodesDisplay();
        this.showNotification('Activation code generated!', 'success');
    }

    generateRandomCode(length = 12) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    deactivateCode(codeId) {
        const code = this.codes.find(c => c.id === codeId);
        if (code) {
            code.status = 'inactive';
            this.saveData();
            this.refreshCodesDisplay();
            this.showNotification('Code deactivated!', 'info');
        }
    }

    // Display Methods
    refreshAllDisplays() {
        this.refreshTasksDisplay();
        this.refreshUsersDisplay();
        this.refreshCodesDisplay();
        this.refreshTributesDisplay();
        this.refreshStats();
    }

    refreshTasksDisplay() {
        const container = document.getElementById('tasksContainer');
        if (!container) return;

        container.innerHTML = '';
        
        this.tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            container.appendChild(taskElement);
        });
    }

    createTaskElement(task) {
        const div = document.createElement('div');
        div.className = 'task-card';
        div.innerHTML = `
            <h3>${task.title}</h3>
            <div class="task-status ${task.status}">${task.status.toUpperCase()}</div>
            <p><strong>Description:</strong> ${task.description}</p>
            <p><strong>Difficulty:</strong> ${task.difficulty}</p>
            <p><strong>Points:</strong> ${task.points}</p>
            <p><strong>Deadline:</strong> ${task.deadline} hours</p>
            <p><strong>Assigned To:</strong> ${task.assignedTo || 'All Users'}</p>
            <p><strong>Completed By:</strong> ${task.completedBy.length} users</p>
            <div class="task-actions">
                ${task.status === 'pending' ? `
                    <button class="approve-btn" onclick="adminPanel.approveTask('${task.id}')">Approve</button>
                    <button class="deny-btn" onclick="adminPanel.denyTask('${task.id}')">Deny</button>
                ` : ''}
                <button class="assign-btn" onclick="adminPanel.showAssignModal('${task.id}')">Assign</button>
                <button class="edit-btn" onclick="adminPanel.editTask('${task.id}')">Edit</button>
                <button class="delete-btn" onclick="adminPanel.deleteTask('${task.id}')">Delete</button>
            </div>
        `;
        return div;
    }

    refreshUsersDisplay() {
        const container = document.getElementById('usersContainer');
        if (!container) return;

        container.innerHTML = '';
        
        this.users.forEach(user => {
            const userElement = this.createUserElement(user);
            container.appendChild(userElement);
        });
    }

    createUserElement(user) {
        const div = document.createElement('div');
        div.className = 'user-card';
        div.innerHTML = `
            <h3>${user.username}</h3>
            <div class="user-status ${user.status}">${user.status.toUpperCase()}</div>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Joined:</strong> ${new Date(user.joinedAt).toLocaleDateString()}</p>
            <p><strong>Last Seen:</strong> ${new Date(user.lastSeen).toLocaleDateString()}</p>
            <p><strong>Total Tributes:</strong> $${user.totalTributes}</p>
            <p><strong>Completed Tasks:</strong> ${user.completedTasks}</p>
            <p><strong>Obedience Level:</strong> ${user.obedienceLevel}%</p>
            <div class="user-actions">
                ${user.status === 'active' ? `
                    <button class="deny-btn" onclick="adminPanel.updateUserStatus('${user.id}', 'inactive')">Deactivate</button>
                ` : `
                    <button class="approve-btn" onclick="adminPanel.updateUserStatus('${user.id}', 'active')">Activate</button>
                `}
                <button class="assign-btn" onclick="adminPanel.showUserTasks('${user.id}')">View Tasks</button>
                <button class="edit-btn" onclick="adminPanel.editUser('${user.id}')">Edit</button>
                <button class="delete-btn" onclick="adminPanel.deleteUser('${user.id}')">Delete</button>
            </div>
        `;
        return div;
    }

    refreshCodesDisplay() {
        const container = document.getElementById('codesContainer');
        if (!container) return;

        container.innerHTML = '';
        
        this.codes.forEach(code => {
            const codeElement = this.createCodeElement(code);
            container.appendChild(codeElement);
        });
    }

    createCodeElement(code) {
        const div = document.createElement('div');
        div.className = 'code-card';
        div.innerHTML = `
            <h3>${code.code}</h3>
            <div class="code-status ${code.status}">${code.status.toUpperCase()}</div>
            <p><strong>Type:</strong> ${code.type}</p>
            <p><strong>Duration:</strong> ${code.duration} days</p>
            <p><strong>Uses:</strong> ${code.currentUses}/${code.maxUses}</p>
            <p><strong>Created:</strong> ${new Date(code.createdAt).toLocaleDateString()}</p>
            <p><strong>Expires:</strong> ${new Date(code.expiresAt).toLocaleDateString()}</p>
            <div class="code-actions">
                <button class="edit-btn" onclick="adminPanel.copyCode('${code.code}')">Copy Code</button>
                ${code.status === 'active' ? `
                    <button class="deny-btn" onclick="adminPanel.deactivateCode('${code.id}')">Deactivate</button>
                ` : ''}
                <button class="delete-btn" onclick="adminPanel.deleteCode('${code.id}')">Delete</button>
            </div>
        `;
        return div;
    }

    refreshTributesDisplay() {
        const container = document.getElementById('tributesContainer');
        if (!container) return;

        container.innerHTML = '';
        
        this.tributes.forEach(tribute => {
            const tributeElement = this.createTributeElement(tribute);
            container.appendChild(tributeElement);
        });
    }

    createTributeElement(tribute) {
        const div = document.createElement('div');
        div.className = 'tribute-card';
        div.innerHTML = `
            <h3>$${tribute.amount}</h3>
            <p><strong>User:</strong> ${tribute.username}</p>
            <p><strong>Date:</strong> ${new Date(tribute.timestamp).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date(tribute.timestamp).toLocaleTimeString()}</p>
            <p><strong>Status:</strong> ${tribute.status}</p>
            <p><strong>Platform:</strong> ${tribute.platform}</p>
            <div class="tribute-actions">
                <button class="edit-btn" onclick="adminPanel.viewTributeDetails('${tribute.id}')">View Details</button>
                <button class="approve-btn" onclick="adminPanel.verifyTribute('${tribute.id}')">Verify</button>
            </div>
        `;
        return div;
    }

    refreshStats() {
        // Update user stats
        const totalUsers = this.users.length;
        const activeUsers = this.users.filter(u => u.status === 'active').length;
        const totalTributeAmount = this.tributes.reduce((sum, t) => sum + t.amount, 0);

        document.getElementById('totalUsers').textContent = totalUsers;
        document.getElementById('activeUsers').textContent = activeUsers;
        document.getElementById('totalTributes').textContent = `$${totalTributeAmount}`;

        // Update tribute stats
        const today = new Date().toDateString();
        const todayTributes = this.tributes.filter(t => 
            new Date(t.timestamp).toDateString() === today
        ).reduce((sum, t) => sum + t.amount, 0);
        
        const averageTribute = this.tributes.length > 0 ? 
            Math.round(totalTributeAmount / this.tributes.length) : 0;

        document.getElementById('totalTributeAmount').textContent = `$${totalTributeAmount}`;
        document.getElementById('todayTributes').textContent = `$${todayTributes}`;
        document.getElementById('averageTribute').textContent = `$${averageTribute}`;
    }

    // Utility Methods
    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    copyCode(code) {
        navigator.clipboard.writeText(code).then(() => {
            this.showNotification('Code copied to clipboard!', 'success');
        });
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Settings Management
    saveGitHubSettings() {
        this.settings.githubRepo = document.getElementById('githubRepo').value;
        this.settings.githubToken = document.getElementById('githubToken').value;
        this.settings.syncInterval = parseInt(document.getElementById('syncInterval').value);
        this.saveSettings();
        this.showNotification('GitHub settings saved!', 'success');
    }

    saveDiscordSettings() {
        this.settings.discordWebhook = document.getElementById('discordWebhook').value;
        this.settings.discordChannel = document.getElementById('discordChannel').value;
        this.saveSettings();
        this.showNotification('Discord settings saved!', 'success');
    }

    saveExtensionSettings() {
        this.settings.defaultPoints = parseInt(document.getElementById('defaultPoints').value);
        this.settings.sessionDuration = parseInt(document.getElementById('sessionDuration').value);
        this.settings.tributeAmounts = document.getElementById('tributeAmounts').value.split(',').map(a => parseInt(a.trim()));
        this.saveSettings();
        this.showNotification('Extension settings saved!', 'success');
    }

    // Admin Authentication
    adminLogout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('admin_authenticated');
            window.location.href = 'admin-login.html';
        }
    }
}

// Tab Management
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Add active class to selected nav tab
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update current tab
    if (window.adminPanel) {
        window.adminPanel.currentTab = tabName;
    }
}

// Filter Functions
function filterTasks(filter) {
    const tasks = document.querySelectorAll('.task-card');
    const buttons = document.querySelectorAll('.task-filters .filter-btn');
    
    // Update button states
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter tasks
    tasks.forEach(task => {
        const status = task.querySelector('.task-status').textContent.toLowerCase();
        if (filter === 'all' || status.includes(filter)) {
            task.style.display = 'block';
        } else {
            task.style.display = 'none';
        }
    });
}

function filterTributes(filter) {
    const tributes = document.querySelectorAll('.tribute-card');
    const buttons = document.querySelectorAll('.tribute-filters .filter-btn');
    
    // Update button states
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter tributes based on date
    const now = new Date();
    tributes.forEach(tribute => {
        const tributeDate = new Date(tribute.querySelector('p:nth-child(3)').textContent.split(': ')[1]);
        let show = false;
        
        switch (filter) {
            case 'all':
                show = true;
                break;
            case 'today':
                show = tributeDate.toDateString() === now.toDateString();
                break;
            case 'week':
                const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
                show = tributeDate >= weekAgo;
                break;
            case 'month':
                const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
                show = tributeDate >= monthAgo;
                break;
        }
        
        tribute.style.display = show ? 'block' : 'none';
    });
}

function searchUsers() {
    const query = document.getElementById('userSearchInput').value.toLowerCase();
    const users = document.querySelectorAll('.user-card');
    
    users.forEach(user => {
        const username = user.querySelector('h3').textContent.toLowerCase();
        const email = user.querySelector('p:nth-child(3)').textContent.toLowerCase();
        
        if (username.includes(query) || email.includes(query)) {
            user.style.display = 'block';
        } else {
            user.style.display = 'none';
        }
    });
}

// Modal Functions
function createNewTask() {
    document.getElementById('createTaskModal').style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Initialize admin panel when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is authenticated
    const isAuthenticated = localStorage.getItem('admin_authenticated');
    if (!isAuthenticated) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Initialize admin panel
    window.adminPanel = new AdminPanel();
    
    // Load settings into forms
    const settings = window.adminPanel.settings;
    document.getElementById('githubRepo').value = settings.githubRepo || '';
    document.getElementById('githubToken').value = settings.githubToken || '';
    document.getElementById('syncInterval').value = settings.syncInterval || 15;
    document.getElementById('discordWebhook').value = settings.discordWebhook || '';
    document.getElementById('discordChannel').value = settings.discordChannel || '#tributes';
    document.getElementById('defaultPoints').value = settings.defaultPoints || 25;
    document.getElementById('sessionDuration').value = settings.sessionDuration || 30;
    document.getElementById('tributeAmounts').value = settings.tributeAmounts?.join(',') || '25,50,75,100';
    
    // Load performance settings
    if (settings.performance) {
        document.getElementById('monitoringFrequency').value = settings.performance.monitoringFrequency || 30;
        document.getElementById('memoryThreshold').value = settings.performance.memoryThreshold || 50;
        document.getElementById('cpuThreshold').value = settings.performance.cpuThreshold || 80;
        document.getElementById('autoCleanup').value = settings.performance.autoCleanup || 'enabled';
    }
    
    // Initialize performance monitoring
    initializePerformanceMonitoring();
});

// ===== PERFORMANCE MONITORING FUNCTIONS =====

// Open performance dashboard
function openPerformanceDashboard() {
    if (window.performanceDashboard) {
        window.performanceDashboard.show();
    } else {
        showNotification('Performance dashboard not available', 'error');
    }
}

// Run performance check
function runPerformanceCheck() {
    try {
        const performanceData = {
            memory: null,
            cpu: null,
            operations: null,
            leaks: null
        };
        
        // Get memory data
        if (window.performanceOptimizer) {
            performanceData.memory = window.performanceOptimizer.getCurrentMemoryUsage();
        }
        
        // Get CPU data
        if (window.cpuUsageMonitor) {
            performanceData.cpu = window.cpuUsageMonitor.getUsageReport();
        }
        
        // Get operations data
        if (window.performanceOptimizer) {
            performanceData.operations = window.performanceOptimizer.getPerformanceStats();
        }
        
        // Get memory leak data
        if (window.memoryLeakDetector) {
            performanceData.leaks = window.memoryLeakDetector.getLeakReport();
        }
        
        // Update performance overview
        updatePerformanceOverview(performanceData);
        
        showNotification('Performance check completed', 'success');
    } catch (error) {
        console.error('Performance check failed:', error);
        showNotification('Performance check failed', 'error');
    }
}

// Update performance overview
function updatePerformanceOverview(data) {
    // Update memory usage
    if (data.memory) {
        const memoryMB = Math.round(data.memory.used / 1024 / 1024);
        const memoryPercentage = Math.round((data.memory.used / data.memory.limit) * 100);
        
        document.getElementById('memoryUsageValue').textContent = memoryMB + ' MB';
        
        const memoryStatus = document.getElementById('memoryUsageStatus');
        if (memoryPercentage > 80) {
            memoryStatus.textContent = 'Critical';
            memoryStatus.className = 'perf-status critical';
        } else if (memoryPercentage > 60) {
            memoryStatus.textContent = 'Warning';
            memoryStatus.className = 'perf-status warning';
        } else {
            memoryStatus.textContent = 'Normal';
            memoryStatus.className = 'perf-status normal';
        }
    }
    
    // Update CPU usage
    if (data.cpu) {
        document.getElementById('cpuUsageValue').textContent = Math.round(data.cpu.current) + '%';
        
        const cpuStatus = document.getElementById('cpuUsageStatus');
        if (data.cpu.level === 'critical' || data.cpu.level === 'emergency') {
            cpuStatus.textContent = 'Critical';
            cpuStatus.className = 'perf-status critical';
        } else if (data.cpu.level === 'warning') {
            cpuStatus.textContent = 'Warning';
            cpuStatus.className = 'perf-status warning';
        } else {
            cpuStatus.textContent = 'Normal';
            cpuStatus.className = 'perf-status normal';
        }
    }
    
    // Update operations
    if (data.operations) {
        const totalOps = (data.operations.activeTimers || 0) + 
                        (data.operations.activeListeners || 0) + 
                        (data.operations.activeObservers || 0);
        
        document.getElementById('operationsValue').textContent = totalOps;
        
        const opsStatus = document.getElementById('operationsStatus');
        if (totalOps > 100) {
            opsStatus.textContent = 'High';
            opsStatus.className = 'perf-status high';
        } else if (totalOps > 50) {
            opsStatus.textContent = 'Medium';
            opsStatus.className = 'perf-status medium';
        } else {
            opsStatus.textContent = 'Low';
            opsStatus.className = 'perf-status low';
        }
    }
    
    // Update memory leaks
    if (data.leaks) {
        const leakCount = data.leaks.detectedLeaks ? data.leaks.detectedLeaks.length : 0;
        
        document.getElementById('leaksValue').textContent = leakCount;
        
        const leaksStatus = document.getElementById('leaksStatus');
        if (leakCount > 0) {
            leaksStatus.textContent = 'Detected';
            leaksStatus.className = 'perf-status detected';
        } else {
            leaksStatus.textContent = 'None';
            leaksStatus.className = 'perf-status none';
        }
    }
    
    // Update recommendations
    updatePerformanceRecommendations(data);
}

// Update performance recommendations
function updatePerformanceRecommendations(data) {
    const recommendations = [];
    
    // Memory recommendations
    if (data.memory) {
        const memoryPercentage = (data.memory.used / data.memory.limit) * 100;
        if (memoryPercentage > 80) {
            recommendations.push({
                icon: '💾',
                text: 'Memory usage is high. Consider clearing caches or reducing data storage.',
                level: 'warning'
            });
        }
    }
    
    // CPU recommendations
    if (data.cpu && data.cpu.level === 'warning') {
        recommendations.push({
            icon: '⚡',
            text: 'CPU usage is elevated. Consider reducing animation frequency or background operations.',
            level: 'warning'
        });
    }
    
    // Operations recommendations
    if (data.operations) {
        if (data.operations.activeTimers > 20) {
            recommendations.push({
                icon: '🔧',
                text: 'High number of active timers. Consider consolidating timer operations.',
                level: 'info'
            });
        }
        if (data.operations.activeListeners > 100) {
            recommendations.push({
                icon: '🔧',
                text: 'High number of event listeners. Consider using event delegation.',
                level: 'info'
            });
        }
    }
    
    // Memory leak recommendations
    if (data.leaks && data.leaks.detectedLeaks && data.leaks.detectedLeaks.length > 0) {
        recommendations.push({
            icon: '🚨',
            text: 'Memory leaks detected. Automatic cleanup will be performed.',
            level: 'error'
        });
    }
    
    // Update recommendations display
    const recommendationsContainer = document.getElementById('performanceRecommendations');
    if (recommendations.length === 0) {
        recommendationsContainer.innerHTML = `
            <div class="recommendation-item">
                <div class="recommendation-icon">✅</div>
                <div class="recommendation-text">System performance is optimal</div>
            </div>
        `;
    } else {
        recommendationsContainer.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item ${rec.level}">
                <div class="recommendation-icon">${rec.icon}</div>
                <div class="recommendation-text">${rec.text}</div>
            </div>
        `).join('');
    }
}

// Clear performance data
function clearPerformanceData() {
    try {
        // Clear performance optimizer data
        if (window.performanceOptimizer) {
            window.performanceOptimizer.performCleanup();
        }
        
        // Clear memory leak detector data
        if (window.memoryLeakDetector) {
            window.memoryLeakDetector.snapshots = [];
            window.memoryLeakDetector.detectedLeaks.clear();
        }
        
        // Clear CPU usage monitor data
        if (window.cpuUsageMonitor) {
            window.cpuUsageMonitor.measurements = [];
        }
        
        // Clear performance dashboard data
        if (window.performanceDashboard) {
            window.performanceDashboard.clearData();
        }
        
        // Reset performance overview
        document.getElementById('memoryUsageValue').textContent = '0 MB';
        document.getElementById('cpuUsageValue').textContent = '0%';
        document.getElementById('operationsValue').textContent = '0';
        document.getElementById('leaksValue').textContent = '0';
        
        // Reset status indicators
        document.getElementById('memoryUsageStatus').textContent = 'Normal';
        document.getElementById('cpuUsageStatus').textContent = 'Normal';
        document.getElementById('operationsStatus').textContent = 'Low';
        document.getElementById('leaksStatus').textContent = 'None';
        
        showNotification('Performance data cleared', 'success');
    } catch (error) {
        console.error('Failed to clear performance data:', error);
        showNotification('Failed to clear performance data', 'error');
    }
}

// Save performance settings
function savePerformanceSettings() {
    try {
        const settings = {
            monitoringFrequency: document.getElementById('monitoringFrequency').value,
            memoryThreshold: document.getElementById('memoryThreshold').value,
            cpuThreshold: document.getElementById('cpuThreshold').value,
            autoCleanup: document.getElementById('autoCleanup').value
        };
        
        // Apply settings to performance monitors
        if (window.performanceOptimizer) {
            window.performanceOptimizer.memoryThreshold = settings.memoryThreshold * 1024 * 1024;
        }
        
        if (window.cpuUsageMonitor) {
            window.cpuUsageMonitor.thresholds.warning = settings.cpuThreshold;
            window.cpuUsageMonitor.measurementInterval = settings.monitoringFrequency * 1000;
        }
        
        // Save settings
        window.adminPanel.settings.performance = settings;
        window.adminPanel.saveSettings();
        
        showNotification('Performance settings saved', 'success');
    } catch (error) {
        console.error('Failed to save performance settings:', error);
        showNotification('Failed to save performance settings', 'error');
    }
}

// Initialize performance monitoring
function initializePerformanceMonitoring() {
    // Run initial performance check
    setTimeout(() => {
        runPerformanceCheck();
    }, 1000);
    
    // Set up automatic performance updates
    setInterval(() => {
        if (window.adminPanel.currentTab === 'performance') {
            runPerformanceCheck();
        }
    }, 10000); // Update every 10 seconds
}

// ===== END PERFORMANCE MONITORING FUNCTIONS =====
