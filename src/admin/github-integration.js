// GitHub Integration for Admin Panel
class GitHubIntegration {
    constructor(adminPanel) {
        this.adminPanel = adminPanel;
        this.apiBase = 'https://api.github.com';
        this.repoStructure = {
            tasks: 'tasks',
            users: 'users',
            config: 'config',
            admin: 'admin'
        };
    }

    // GitHub API Methods
    async makeGitHubRequest(endpoint, method = 'GET', data = null) {
        const settings = this.adminPanel.settings;
        if (!settings.githubToken || !settings.githubRepo) {
            throw new Error('GitHub credentials not configured');
        }

        const headers = {
            'Authorization': `Bearer ${settings.githubToken}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        };

        if (data) {
            headers['Content-Type'] = 'application/json';
        }

        const config = {
            method,
            headers
        };

        if (data) {
            config.body = JSON.stringify(data);
        }

        const response = await fetch(`${this.apiBase}${endpoint}`, config);
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    }

    // Repository Setup
    async setupRepository() {
        const settings = this.adminPanel.settings;
        
        try {
            // Check if repository exists
            await this.makeGitHubRequest(`/repos/${settings.githubRepo}`);
            
            // Create directory structure
            await this.createDirectoryStructure();
            
            // Initialize with default files
            await this.initializeDefaultFiles();
            
            this.adminPanel.showNotification('Repository setup complete!', 'success');
        } catch (error) {
            console.error('Repository setup failed:', error);
            this.adminPanel.showNotification('Repository setup failed: ' + error.message, 'error');
        }
    }

    async createDirectoryStructure() {
        const settings = this.adminPanel.settings;
        const directories = [
            'tasks/README.md',
            'users/README.md',
            'config/README.md',
            'admin/README.md'
        ];

        for (const dir of directories) {
            try {
                await this.createFile(dir, this.getDirectoryReadme(dir));
            } catch (error) {
                console.log(`Directory ${dir} might already exist`);
            }
        }
    }

    async initializeDefaultFiles() {
        // Create task configuration
        await this.createFile('config/task-config.json', JSON.stringify({
            defaultPoints: 25,
            difficulties: ['easy', 'medium', 'hard', 'extreme'],
            categories: ['daily', 'weekly', 'special', 'punishment'],
            maxDeadline: 168 // hours
        }, null, 2));

        // Create extension settings
        await this.createFile('config/extension-settings.json', JSON.stringify({
            tributeAmounts: [25, 50, 75, 100],
            sessionDuration: 30,
            discordIntegration: true,
            notificationSettings: {
                taskReminders: true,
                tributeConfirmations: true
            }
        }, null, 2));

        // Create admin settings
        await this.createFile('admin/admin-config.json', JSON.stringify({
            autoApprovalEnabled: false,
            requireProofForTasks: true,
            maxUsersPerCode: 1,
            defaultCodeDuration: 30
        }, null, 2));
    }

    // File Operations
    async createFile(path, content, message = null) {
        const settings = this.adminPanel.settings;
        const encodedContent = btoa(unescape(encodeURIComponent(content)));
        
        const data = {
            message: message || `Create ${path}`,
            content: encodedContent
        };

        return await this.makeGitHubRequest(
            `/repos/${settings.githubRepo}/contents/${path}`,
            'PUT',
            data
        );
    }

    async updateFile(path, content, sha, message = null) {
        const settings = this.adminPanel.settings;
        const encodedContent = btoa(unescape(encodeURIComponent(content)));
        
        const data = {
            message: message || `Update ${path}`,
            content: encodedContent,
            sha: sha
        };

        return await this.makeGitHubRequest(
            `/repos/${settings.githubRepo}/contents/${path}`,
            'PUT',
            data
        );
    }

    async getFile(path) {
        const settings = this.adminPanel.settings;
        const response = await this.makeGitHubRequest(
            `/repos/${settings.githubRepo}/contents/${path}`
        );
        
        const content = atob(response.content);
        return {
            content,
            sha: response.sha
        };
    }

    async deleteFile(path, sha, message = null) {
        const settings = this.adminPanel.settings;
        
        const data = {
            message: message || `Delete ${path}`,
            sha: sha
        };

        return await this.makeGitHubRequest(
            `/repos/${settings.githubRepo}/contents/${path}`,
            'DELETE',
            data
        );
    }

    // Task Synchronization
    async syncTasksToGitHub() {
        try {
            const tasks = this.adminPanel.tasks;
            
            for (const task of tasks) {
                const filename = `tasks/task-${task.id}.json`;
                const content = JSON.stringify(task, null, 2);
                
                try {
                    // Try to get existing file
                    const existing = await this.getFile(filename);
                    await this.updateFile(filename, content, existing.sha, `Update task ${task.id}`);
                } catch (error) {
                    // File doesn't exist, create it
                    await this.createFile(filename, content, `Create task ${task.id}`);
                }
            }
            
            this.adminPanel.showNotification('Tasks synced to GitHub!', 'success');
        } catch (error) {
            console.error('Task sync failed:', error);
            this.adminPanel.showNotification('Task sync failed: ' + error.message, 'error');
        }
    }

    async syncTasksFromGitHub() {
        try {
            const settings = this.adminPanel.settings;
            const response = await this.makeGitHubRequest(
                `/repos/${settings.githubRepo}/contents/tasks`
            );
            
            const tasks = [];
            
            for (const file of response) {
                if (file.name.endsWith('.json') && file.name.startsWith('task-')) {
                    const fileContent = await this.getFile(`tasks/${file.name}`);
                    const task = JSON.parse(fileContent.content);
                    tasks.push(task);
                }
            }
            
            this.adminPanel.tasks = tasks;
            this.adminPanel.saveData();
            this.adminPanel.refreshTasksDisplay();
            this.adminPanel.showNotification('Tasks synced from GitHub!', 'success');
        } catch (error) {
            console.error('Task sync from GitHub failed:', error);
            this.adminPanel.showNotification('Task sync failed: ' + error.message, 'error');
        }
    }

    // User Data Synchronization
    async syncUsersToGitHub() {
        try {
            const users = this.adminPanel.users;
            
            for (const user of users) {
                const filename = `users/user-${user.id}.json`;
                const content = JSON.stringify(user, null, 2);
                
                try {
                    const existing = await this.getFile(filename);
                    await this.updateFile(filename, content, existing.sha, `Update user ${user.id}`);
                } catch (error) {
                    await this.createFile(filename, content, `Create user ${user.id}`);
                }
            }
            
            this.adminPanel.showNotification('Users synced to GitHub!', 'success');
        } catch (error) {
            console.error('User sync failed:', error);
            this.adminPanel.showNotification('User sync failed: ' + error.message, 'error');
        }
    }

    async syncUsersFromGitHub() {
        try {
            const settings = this.adminPanel.settings;
            const response = await this.makeGitHubRequest(
                `/repos/${settings.githubRepo}/contents/users`
            );
            
            const users = [];
            
            for (const file of response) {
                if (file.name.endsWith('.json') && file.name.startsWith('user-')) {
                    const fileContent = await this.getFile(`users/${file.name}`);
                    const user = JSON.parse(fileContent.content);
                    users.push(user);
                }
            }
            
            this.adminPanel.users = users;
            this.adminPanel.saveData();
            this.adminPanel.refreshUsersDisplay();
            this.adminPanel.showNotification('Users synced from GitHub!', 'success');
        } catch (error) {
            console.error('User sync from GitHub failed:', error);
            this.adminPanel.showNotification('User sync failed: ' + error.message, 'error');
        }
    }

    // Configuration Synchronization
    async syncConfigToGitHub() {
        try {
            const settings = this.adminPanel.settings;
            const config = {
                taskConfig: {
                    defaultPoints: settings.defaultPoints,
                    tributeAmounts: settings.tributeAmounts,
                    sessionDuration: settings.sessionDuration
                },
                discordConfig: {
                    webhook: settings.discordWebhook,
                    channel: settings.discordChannel
                },
                syncConfig: {
                    interval: settings.syncInterval
                }
            };
            
            const content = JSON.stringify(config, null, 2);
            
            try {
                const existing = await this.getFile('config/extension-settings.json');
                await this.updateFile('config/extension-settings.json', content, existing.sha, 'Update extension settings');
            } catch (error) {
                await this.createFile('config/extension-settings.json', content, 'Create extension settings');
            }
            
            this.adminPanel.showNotification('Configuration synced to GitHub!', 'success');
        } catch (error) {
            console.error('Config sync failed:', error);
            this.adminPanel.showNotification('Config sync failed: ' + error.message, 'error');
        }
    }

    async syncConfigFromGitHub() {
        try {
            const fileContent = await this.getFile('config/extension-settings.json');
            const config = JSON.parse(fileContent.content);
            
            // Update admin panel settings
            if (config.taskConfig) {
                this.adminPanel.settings.defaultPoints = config.taskConfig.defaultPoints;
                this.adminPanel.settings.tributeAmounts = config.taskConfig.tributeAmounts;
                this.adminPanel.settings.sessionDuration = config.taskConfig.sessionDuration;
            }
            
            if (config.discordConfig) {
                this.adminPanel.settings.discordWebhook = config.discordConfig.webhook;
                this.adminPanel.settings.discordChannel = config.discordConfig.channel;
            }
            
            if (config.syncConfig) {
                this.adminPanel.settings.syncInterval = config.syncConfig.interval;
            }
            
            this.adminPanel.saveSettings();
            this.adminPanel.showNotification('Configuration synced from GitHub!', 'success');
        } catch (error) {
            console.error('Config sync from GitHub failed:', error);
            this.adminPanel.showNotification('Config sync failed: ' + error.message, 'error');
        }
    }

    // Activation Codes Synchronization
    async syncActivationCodesToGitHub() {
        try {
            const codes = this.adminPanel.codes;
            const content = JSON.stringify(codes, null, 2);
            
            try {
                const existing = await this.getFile('admin/activation-codes.json');
                await this.updateFile('admin/activation-codes.json', content, existing.sha, 'Update activation codes');
            } catch (error) {
                await this.createFile('admin/activation-codes.json', content, 'Create activation codes');
            }
            
            this.adminPanel.showNotification('Activation codes synced to GitHub!', 'success');
        } catch (error) {
            console.error('Activation codes sync failed:', error);
            this.adminPanel.showNotification('Activation codes sync failed: ' + error.message, 'error');
        }
    }

    async syncActivationCodesFromGitHub() {
        try {
            const fileContent = await this.getFile('admin/activation-codes.json');
            const codes = JSON.parse(fileContent.content);
            
            this.adminPanel.codes = codes;
            this.adminPanel.saveData();
            this.adminPanel.refreshCodesDisplay();
            this.adminPanel.showNotification('Activation codes synced from GitHub!', 'success');
        } catch (error) {
            console.error('Activation codes sync from GitHub failed:', error);
            this.adminPanel.showNotification('Activation codes sync failed: ' + error.message, 'error');
        }
    }

    // Full Synchronization
    async syncAllToGitHub() {
        try {
            await this.syncTasksToGitHub();
            await this.syncUsersToGitHub();
            await this.syncConfigToGitHub();
            await this.syncActivationCodesToGitHub();
            this.adminPanel.showNotification('Full sync to GitHub complete!', 'success');
        } catch (error) {
            console.error('Full sync to GitHub failed:', error);
            this.adminPanel.showNotification('Full sync failed: ' + error.message, 'error');
        }
    }

    async syncAllFromGitHub() {
        try {
            await this.syncTasksFromGitHub();
            await this.syncUsersFromGitHub();
            await this.syncConfigFromGitHub();
            await this.syncActivationCodesFromGitHub();
            this.adminPanel.showNotification('Full sync from GitHub complete!', 'success');
        } catch (error) {
            console.error('Full sync from GitHub failed:', error);
            this.adminPanel.showNotification('Full sync failed: ' + error.message, 'error');
        }
    }

    // Webhook Management
    async createWebhook(url, events = ['push', 'pull_request']) {
        const settings = this.adminPanel.settings;
        
        const data = {
            name: 'web',
            active: true,
            events: events,
            config: {
                url: url,
                content_type: 'json',
                insecure_ssl: '0'
            }
        };

        try {
            const response = await this.makeGitHubRequest(
                `/repos/${settings.githubRepo}/hooks`,
                'POST',
                data
            );
            
            this.adminPanel.showNotification('Webhook created successfully!', 'success');
            return response;
        } catch (error) {
            console.error('Webhook creation failed:', error);
            this.adminPanel.showNotification('Webhook creation failed: ' + error.message, 'error');
            throw error;
        }
    }

    // Utility Methods
    getDirectoryReadme(path) {
        const dirName = path.split('/')[0];
        const readmeContent = {
            tasks: `# Tasks Directory\n\nThis directory contains all task definitions for the Elite Chambers extension.\n\n## File Structure\n- \`task-[id].json\` - Individual task definitions\n- Task files are automatically synced with the admin panel\n\n## Task Schema\n\`\`\`json\n{\n  "id": "task_123",\n  "title": "Task Title",\n  "description": "Task description",\n  "difficulty": "easy|medium|hard|extreme",\n  "points": 25,\n  "deadline": 24,\n  "status": "active|pending|completed",\n  "assignedTo": "user_id or null",\n  "createdAt": "ISO timestamp",\n  "completedBy": []\n}\n\`\`\``,
            users: `# Users Directory\n\nThis directory contains user data and progress tracking.\n\n## File Structure\n- \`user-[id].json\` - Individual user profiles\n- User files are automatically synced with the admin panel\n\n## User Schema\n\`\`\`json\n{\n  "id": "user_123",\n  "username": "username",\n  "email": "email@example.com",\n  "status": "active|inactive",\n  "joinedAt": "ISO timestamp",\n  "lastSeen": "ISO timestamp",\n  "totalTributes": 0,\n  "completedTasks": 0,\n  "obedienceLevel": 0\n}\n\`\`\``,
            config: `# Configuration Directory\n\nThis directory contains configuration files for the extension.\n\n## Files\n- \`extension-settings.json\` - Main extension configuration\n- \`task-config.json\` - Task system configuration\n- Configuration is automatically synced with the admin panel`,
            admin: `# Admin Directory\n\nThis directory contains admin-specific data and configurations.\n\n## Files\n- \`activation-codes.json\` - Generated activation codes\n- \`admin-config.json\` - Admin panel configuration\n- Files are automatically synced with the admin panel`
        };
        
        return readmeContent[dirName] || `# ${dirName.charAt(0).toUpperCase() + dirName.slice(1)} Directory\n\nThis directory is part of the Elite Chambers extension.`;
    }

    // Auto-sync functionality
    startAutoSync() {
        const settings = this.adminPanel.settings;
        if (settings.syncInterval && settings.syncInterval > 0) {
            this.autoSyncInterval = setInterval(() => {
                this.syncAllToGitHub();
            }, settings.syncInterval * 60 * 1000); // Convert minutes to milliseconds
        }
    }

    stopAutoSync() {
        if (this.autoSyncInterval) {
            clearInterval(this.autoSyncInterval);
            this.autoSyncInterval = null;
        }
    }
}

// GitHub Integration Functions (called from admin panel)
async function syncWithGitHub() {
    if (!window.githubIntegration) {
        window.githubIntegration = new GitHubIntegration(window.adminPanel);
    }
    
    try {
        await window.githubIntegration.syncAllFromGitHub();
        await window.githubIntegration.syncAllToGitHub();
    } catch (error) {
        console.error('GitHub sync failed:', error);
        window.adminPanel.showNotification('GitHub sync failed: ' + error.message, 'error');
    }
}

async function setupGitHubRepository() {
    if (!window.githubIntegration) {
        window.githubIntegration = new GitHubIntegration(window.adminPanel);
    }
    
    try {
        await window.githubIntegration.setupRepository();
    } catch (error) {
        console.error('Repository setup failed:', error);
        window.adminPanel.showNotification('Repository setup failed: ' + error.message, 'error');
    }
}

// Initialize GitHub integration when admin panel loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait for admin panel to be initialized
    setTimeout(() => {
        if (window.adminPanel) {
            window.githubIntegration = new GitHubIntegration(window.adminPanel);
            
            // Start auto-sync if configured
            if (window.adminPanel.settings.syncInterval > 0) {
                window.githubIntegration.startAutoSync();
            }
        }
    }, 1000);
});
