// GitHub Extension Integration - Client Side
class ExtensionGitHubSync {
    constructor() {
        this.adminSettings = null;
        this.syncInterval = null;
        this.init();
    }

    init() {
        this.loadAdminSettings();
        this.setupAutoSync();
    }

    loadAdminSettings() {
        // Load settings from admin panel
        const settings = localStorage.getItem('admin_settings');
        if (settings) {
            this.adminSettings = JSON.parse(settings);
        }
    }

    // Fetch tasks from GitHub for extension users
    async fetchTasksFromGitHub() {
        if (!this.adminSettings || !this.adminSettings.githubRepo) {
            console.log('GitHub not configured');
            return [];
        }

        try {
            const response = await fetch(`https://api.github.com/repos/${this.adminSettings.githubRepo}/contents/tasks`);
            const files = await response.json();
            
            const tasks = [];
            for (const file of files) {
                if (file.name.endsWith('.json') && file.name.startsWith('task-')) {
                    const taskResponse = await fetch(file.download_url);
                    const task = await taskResponse.json();
                    tasks.push(task);
                }
            }
            
            return tasks;
        } catch (error) {
            console.error('Error fetching tasks from GitHub:', error);
            return [];
        }
    }

    // Fetch configuration from GitHub
    async fetchConfigFromGitHub() {
        if (!this.adminSettings || !this.adminSettings.githubRepo) {
            return null;
        }

        try {
            const response = await fetch(`https://api.github.com/repos/${this.adminSettings.githubRepo}/contents/config/extension-settings.json`);
            const file = await response.json();
            const configResponse = await fetch(file.download_url);
            const config = await configResponse.json();
            
            return config;
        } catch (error) {
            console.error('Error fetching config from GitHub:', error);
            return null;
        }
    }

    // Submit task completion to GitHub
    async submitTaskCompletion(taskId, userId, proof = null) {
        if (!this.adminSettings || !this.adminSettings.githubRepo || !this.adminSettings.githubToken) {
            console.log('GitHub not configured for submissions');
            return false;
        }

        try {
            const submission = {
                taskId: taskId,
                userId: userId,
                timestamp: new Date().toISOString(),
                proof: proof,
                status: 'pending_approval'
            };

            const content = JSON.stringify(submission, null, 2);
            const encodedContent = btoa(unescape(encodeURIComponent(content)));
            
            const response = await fetch(`https://api.github.com/repos/${this.adminSettings.githubRepo}/contents/submissions/submission-${Date.now()}.json`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.adminSettings.githubToken}`,
                    'Accept': 'application/vnd.github+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Task completion submission for ${taskId}`,
                    content: encodedContent
                })
            });

            return response.ok;
        } catch (error) {
            console.error('Error submitting task completion:', error);
            return false;
        }
    }

    // Submit tribute notification to GitHub
    async submitTributeNotification(amount, userId, transactionId) {
        if (!this.adminSettings || !this.adminSettings.githubRepo || !this.adminSettings.githubToken) {
            console.log('GitHub not configured for tribute notifications');
            return false;
        }

        try {
            const tribute = {
                amount: amount,
                userId: userId,
                transactionId: transactionId,
                timestamp: new Date().toISOString(),
                status: 'completed'
            };

            const content = JSON.stringify(tribute, null, 2);
            const encodedContent = btoa(unescape(encodeURIComponent(content)));
            
            const response = await fetch(`https://api.github.com/repos/${this.adminSettings.githubRepo}/contents/tributes/tribute-${Date.now()}.json`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.adminSettings.githubToken}`,
                    'Accept': 'application/vnd.github+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Tribute submission: $${amount}`,
                    content: encodedContent
                })
            });

            return response.ok;
        } catch (error) {
            console.error('Error submitting tribute notification:', error);
            return false;
        }
    }

    // Validate activation code against GitHub
    async validateActivationCode(code) {
        if (!this.adminSettings || !this.adminSettings.githubRepo) {
            return false;
        }

        try {
            const response = await fetch(`https://api.github.com/repos/${this.adminSettings.githubRepo}/contents/admin/activation-codes.json`);
            const file = await response.json();
            const codesResponse = await fetch(file.download_url);
            const codes = await codesResponse.json();
            
            const validCode = codes.find(c => 
                c.code === code && 
                c.status === 'active' && 
                c.currentUses < c.maxUses &&
                new Date(c.expiresAt) > new Date()
            );
            
            return validCode ? validCode : false;
        } catch (error) {
            console.error('Error validating activation code:', error);
            return false;
        }
    }

    // Setup automatic synchronization
    setupAutoSync() {
        if (this.adminSettings && this.adminSettings.syncInterval > 0) {
            this.syncInterval = setInterval(() => {
                this.syncExtensionData();
            }, this.adminSettings.syncInterval * 60 * 1000);
        }
    }

    async syncExtensionData() {
        try {
            // Fetch latest tasks
            const tasks = await this.fetchTasksFromGitHub();
            if (tasks.length > 0) {
                localStorage.setItem('github_tasks', JSON.stringify(tasks));
            }

            // Fetch latest config
            const config = await this.fetchConfigFromGitHub();
            if (config) {
                localStorage.setItem('github_config', JSON.stringify(config));
            }

            console.log('Extension data synchronized with GitHub');
        } catch (error) {
            console.error('Error synchronizing extension data:', error);
        }
    }

    // Get tasks for current user
    getTasksForUser(userId) {
        const tasks = localStorage.getItem('github_tasks');
        if (!tasks) return [];

        const parsedTasks = JSON.parse(tasks);
        return parsedTasks.filter(task => 
            task.status === 'active' && 
            (task.assignedTo === null || task.assignedTo === userId)
        );
    }
}

// Enhanced tribute submission with GitHub integration
async function submitTribute(amount) {
    const githubSync = new ExtensionGitHubSync();
    const tributeBtn = document.getElementById(`submitTribute${amount}`);
    const originalText = tributeBtn.innerHTML;
    
    // Show loading state
    tributeBtn.innerHTML = `
        <span class="tribute-icon">⏳</span>
        <span class="tribute-text">Processing...</span>
    `;
    tributeBtn.disabled = true;

    try {
        // Get user data
        const username = localStorage.getItem('username') || 'unknown';
        const userId = localStorage.getItem('user_id') || 'user_' + Date.now();
        
        // Open payment page
        const throneUrl = `https://throne.com/your-profile-name/tribute/${amount}`;
        window.open(throneUrl, '_blank');
        
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Submit to GitHub
        const transactionId = 'txn_' + Date.now();
        const githubSubmitted = await githubSync.submitTributeNotification(amount, userId, transactionId);
        
        // Submit to Discord
        await submitTributeToDiscord(amount, username, githubSubmitted);
        
        // Update progress
        updateTributeProgress(amount);
        
        // Show success notification
        showNotification(`Tribute of $${amount} submitted successfully!`, 'success');
        
    } catch (error) {
        console.error('Tribute submission error:', error);
        showNotification('Error submitting tribute. Please try again.', 'error');
    } finally {
        // Reset button
        tributeBtn.innerHTML = originalText;
        tributeBtn.disabled = false;
    }
}

// Enhanced task completion with GitHub integration
async function completeTask() {
    const githubSync = new ExtensionGitHubSync();
    const taskBtn = document.getElementById('completeTaskBtn');
    const originalText = taskBtn.innerHTML;
    
    // Show loading state
    taskBtn.innerHTML = `
        <span class="task-icon">⏳</span>
        <span class="task-text">Processing...</span>
    `;
    taskBtn.disabled = true;

    try {
        // Get user data
        const username = localStorage.getItem('username') || 'unknown';
        const userId = localStorage.getItem('user_id') || 'user_' + Date.now();
        
        // Get current task (for demo, using a default task)
        const currentTask = 'task_daily_devotion';
        
        // Submit completion to GitHub
        const githubSubmitted = await githubSync.submitTaskCompletion(currentTask, userId);
        
        // Submit to Discord
        await submitTaskCompletionToDiscord(currentTask, username, githubSubmitted);
        
        // Update progress
        updateTaskProgress();
        
        // Show success notification
        showNotification('Task completed successfully!', 'success');
        
    } catch (error) {
        console.error('Task completion error:', error);
        showNotification('Error completing task. Please try again.', 'error');
    } finally {
        // Reset button
        taskBtn.innerHTML = originalText;
        taskBtn.disabled = false;
    }
}

// Enhanced proof submission with GitHub integration
async function submitProofToDiscord() {
    const githubSync = new ExtensionGitHubSync();
    const proofText = document.getElementById('proofText').value;
    const proofFile = document.getElementById('proofFile').files[0];
    
    if (!proofText.trim()) {
        showNotification('Please enter proof details', 'error');
        return;
    }

    try {
        // Get user data
        const username = localStorage.getItem('username') || 'unknown';
        const userId = localStorage.getItem('user_id') || 'user_' + Date.now();
        
        // Prepare proof data
        const proofData = {
            text: proofText,
            file: proofFile ? {
                name: proofFile.name,
                size: proofFile.size,
                type: proofFile.type
            } : null,
            timestamp: new Date().toISOString()
        };
        
        // Submit to GitHub
        const githubSubmitted = await githubSync.submitTaskCompletion('proof_submission', userId, proofData);
        
        // Submit to Discord
        const discordWebhook = localStorage.getItem('discord_webhook') || 'YOUR_DISCORD_WEBHOOK_URL';
        
        if (discordWebhook && discordWebhook !== 'YOUR_DISCORD_WEBHOOK_URL') {
            const discordData = {
                embeds: [{
                    title: "📸 Proof Submission",
                    description: proofText,
                    color: 0x9b59b6,
                    fields: [
                        {
                            name: "Submitted by",
                            value: username,
                            inline: true
                        },
                        {
                            name: "Timestamp",
                            value: new Date().toLocaleString(),
                            inline: true
                        },
                        {
                            name: "GitHub Status",
                            value: githubSubmitted ? "✅ Synced" : "❌ Failed",
                            inline: true
                        }
                    ],
                    footer: {
                        text: "Elite Chambers - Proof Tracking"
                    }
                }]
            };
            
            await fetch(discordWebhook, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(discordData)
            });
        }
        
        // Close modal and show success
        closeProofModal();
        showNotification('Proof submitted successfully!', 'success');
        
    } catch (error) {
        console.error('Proof submission error:', error);
        showNotification('Error submitting proof. Please try again.', 'error');
    }
}

// Enhanced sync empire with GitHub integration
async function syncEmpire() {
    const githubSync = new ExtensionGitHubSync();
    const syncBtn = document.getElementById('syncEmpireBtn');
    const originalText = syncBtn.innerHTML;
    
    // Show loading state
    syncBtn.innerHTML = `
        <span class="task-icon">⏳</span>
        <span class="task-text">Syncing...</span>
    `;
    syncBtn.disabled = true;

    try {
        // Sync with GitHub
        await githubSync.syncExtensionData();
        
        // Update local data
        const tasks = localStorage.getItem('github_tasks');
        const config = localStorage.getItem('github_config');
        
        if (tasks) {
            // Update task display
            console.log('Tasks updated from GitHub');
        }
        
        if (config) {
            // Update configuration
            console.log('Configuration updated from GitHub');
        }
        
        // Show success notification
        showNotification('Empire synchronized successfully!', 'success');
        
    } catch (error) {
        console.error('Empire sync error:', error);
        showNotification('Error synchronizing empire. Please try again.', 'error');
    } finally {
        // Reset button
        syncBtn.innerHTML = originalText;
        syncBtn.disabled = false;
    }
}

// Enhanced view commands with GitHub integration
async function viewCommands() {
    const githubSync = new ExtensionGitHubSync();
    
    try {
        // Get user data
        const userId = localStorage.getItem('user_id') || 'user_' + Date.now();
        
        // Get tasks from GitHub
        const tasks = githubSync.getTasksForUser(userId);
        
        if (tasks.length > 0) {
            // Display tasks in a modal or update UI
            let commandsText = "📋 Your Current Commands:\n\n";
            tasks.forEach((task, index) => {
                commandsText += `${index + 1}. ${task.title}\n`;
                commandsText += `   Description: ${task.description}\n`;
                commandsText += `   Points: ${task.points}\n`;
                commandsText += `   Deadline: ${task.deadline} hours\n\n`;
            });
            
            alert(commandsText);
        } else {
            alert("No commands available at this time. Check back later!");
        }
        
        // Show success notification
        showNotification('Commands retrieved successfully!', 'success');
        
    } catch (error) {
        console.error('View commands error:', error);
        showNotification('Error retrieving commands. Please try again.', 'error');
    }
}

// Enhanced initialization with GitHub integration
function initializeEnhancedButtons() {
    console.log('🔗 Initializing GitHub integration...');
    
    // Initialize GitHub sync
    window.githubSync = new ExtensionGitHubSync();
    
    // Load GitHub settings from admin if available
    const adminSettings = localStorage.getItem('admin_settings');
    if (adminSettings) {
        const settings = JSON.parse(adminSettings);
        
        // Update Discord webhook if configured
        if (settings.discordWebhook) {
            localStorage.setItem('discord_webhook', settings.discordWebhook);
        }
        
        // Update tribute amounts if configured
        if (settings.tributeAmounts) {
            // Update tribute buttons with new amounts
            console.log('Tribute amounts updated:', settings.tributeAmounts);
        }
    }
    
    // Start automatic sync
    window.githubSync.setupAutoSync();
    
    console.log('✅ GitHub integration initialized');
}

// Utility functions for GitHub integration
async function submitTributeToDiscord(amount, username, githubStatus) {
    const discordWebhook = localStorage.getItem('discord_webhook') || 'YOUR_DISCORD_WEBHOOK_URL';
    
    if (discordWebhook && discordWebhook !== 'YOUR_DISCORD_WEBHOOK_URL') {
        const discordData = {
            embeds: [{
                title: "💰 Tribute Submission",
                description: `A tribute of $${amount} has been submitted`,
                color: 0xe74c3c,
                fields: [
                    {
                        name: "Amount",
                        value: `$${amount}`,
                        inline: true
                    },
                    {
                        name: "Submitted by",
                        value: username,
                        inline: true
                    },
                    {
                        name: "GitHub Status",
                        value: githubStatus ? "✅ Synced" : "❌ Failed",
                        inline: true
                    }
                ],
                footer: {
                    text: "Elite Chambers - Tribute Tracking"
                }
            }]
        };
        
        await fetch(discordWebhook, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(discordData)
        });
    }
}

async function submitTaskCompletionToDiscord(taskId, username, githubStatus) {
    const discordWebhook = localStorage.getItem('discord_webhook') || 'YOUR_DISCORD_WEBHOOK_URL';
    
    if (discordWebhook && discordWebhook !== 'YOUR_DISCORD_WEBHOOK_URL') {
        const discordData = {
            embeds: [{
                title: "✅ Task Completion",
                description: `Task ${taskId} has been completed`,
                color: 0x27ae60,
                fields: [
                    {
                        name: "Task ID",
                        value: taskId,
                        inline: true
                    },
                    {
                        name: "Completed by",
                        value: username,
                        inline: true
                    },
                    {
                        name: "GitHub Status",
                        value: githubStatus ? "✅ Synced" : "❌ Failed",
                        inline: true
                    }
                ],
                footer: {
                    text: "Elite Chambers - Task Tracking"
                }
            }]
        };
        
        await fetch(discordWebhook, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(discordData)
        });
    }
}
