class OptionsManager {
    constructor() {
        this.currentTab = 'general';
        this.settings = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSettings();
        this.startMemoryMonitoring();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                this.switchTab(tabId);
            });
        });

        // Setting change listeners
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.saveSetting(e.target.id, e.target.checked);
            });
        });

        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('input', (e) => {
                this.saveSetting(e.target.id, parseInt(e.target.value) || 0);
            });
        });

        document.querySelectorAll('select').forEach(select => {
            select.addEventListener('change', (e) => {
                this.saveSetting(e.target.id, e.target.value);
            });
        });

        // Button listeners
        document.getElementById('exportData').addEventListener('click', () => this.exportData());
        document.getElementById('importData').addEventListener('click', () => this.importData());
        document.getElementById('resetSettings').addEventListener('click', () => this.resetSettings());
        document.getElementById('clearAllData').addEventListener('click', () => this.clearAllData());
    }

    switchTab(tabId) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');

        this.currentTab = tabId;
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.local.get(['settings']);
            this.settings = result.settings || {};
            
            // Load all settings into UI
            this.loadGeneralSettings();
            this.loadTrackingSettings();
            this.loadClientSettings();
            this.loadAnalyticsSettings();
            this.loadDataSettings();
            
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    loadGeneralSettings() {
        // Notifications
        document.getElementById('enableNotifications').checked = this.settings.enableNotifications !== false;
        document.getElementById('soundNotifications').checked = this.settings.soundNotifications === true;
        document.getElementById('desktopNotifications').checked = this.settings.desktopNotifications === true;
        
        // Display
        document.getElementById('darkMode').checked = this.settings.darkMode === true;
        document.getElementById('compactView').checked = this.settings.compactView === true;
        
        // Privacy
        document.getElementById('incognitoMode').checked = this.settings.incognitoMode === true;
        document.getElementById('autoDelete').checked = this.settings.autoDelete === true;
    }

    loadTrackingSettings() {
        // Platforms
        document.getElementById('trackThrone').checked = this.settings.trackThrone !== false;
        document.getElementById('trackCashApp').checked = this.settings.trackCashApp !== false;
        document.getElementById('trackVenmo').checked = this.settings.trackVenmo !== false;
        document.getElementById('trackPayPal').checked = this.settings.trackPayPal !== false;
        document.getElementById('trackAmazon').checked = this.settings.trackAmazon !== false;
        
        // Options
        document.getElementById('autoCapture').checked = this.settings.autoCapture !== false;
        document.getElementById('trackLocation').checked = this.settings.trackLocation === true;
        document.getElementById('trackTimes').checked = this.settings.trackTimes !== false;
        
        // Goals
        document.getElementById('dailyGoal').value = this.settings.dailyGoal || 0;
        document.getElementById('weeklyGoal').value = this.settings.weeklyGoal || 0;
        document.getElementById('monthlyGoal').value = this.settings.monthlyGoal || 0;
    }

    loadClientSettings() {
        document.getElementById('trackClients').checked = this.settings.trackClients !== false;
        document.getElementById('clientProfiles').checked = this.settings.clientProfiles === true;
        document.getElementById('clientNotes').checked = this.settings.clientNotes === true;
        document.getElementById('clientSpending').checked = this.settings.clientSpending !== false;
        document.getElementById('clientRanking').checked = this.settings.clientRanking === true;
        document.getElementById('loyaltySystem').checked = this.settings.loyaltySystem === true;
    }

    loadAnalyticsSettings() {
        document.getElementById('detailedReports').checked = this.settings.detailedReports !== false;
        document.getElementById('trendAnalysis').checked = this.settings.trendAnalysis === true;
        document.getElementById('exportReports').checked = this.settings.exportReports === true;
        document.getElementById('dataRetention').value = this.settings.dataRetention || '90';
    }

    loadDataSettings() {
        this.updateStorageInfo();
    }

    async saveSetting(key, value) {
        try {
            this.settings[key] = value;
            await chrome.storage.local.set({ settings: this.settings });
            this.showNotification(`Setting saved: ${key}`, 'success');
        } catch (error) {
            console.error('Error saving setting:', error);
            this.showNotification('Error saving setting', 'error');
        }
    }

    async exportData() {
        try {
            const result = await chrome.storage.local.get(null);
            const dataStr = JSON.stringify(result, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `findom-elite-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            
            URL.revokeObjectURL(url);
            this.showNotification('Data exported successfully!', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showNotification('Failed to export data', 'error');
        }
    }

    async importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                const text = await file.text();
                const data = JSON.parse(text);
                
                if (confirm('This will replace all current data. Continue?')) {
                    await chrome.storage.local.clear();
                    await chrome.storage.local.set(data);
                    this.loadSettings();
                    this.showNotification('Data imported successfully!', 'success');
                }
            } catch (error) {
                console.error('Error importing data:', error);
                this.showNotification('Error importing data. Please check the file format.', 'error');
            }
        };
        
        input.click();
    }

    async resetSettings() {
        if (confirm('Are you sure you want to reset all settings to default?')) {
            try {
                await chrome.storage.local.remove(['settings']);
                this.settings = {};
                this.loadSettings();
                this.showNotification('Settings reset to default', 'success');
            } catch (error) {
                console.error('Error resetting settings:', error);
                this.showNotification('Error resetting settings', 'error');
            }
        }
    }

    async clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            try {
                await chrome.storage.local.clear();
                this.settings = {};
                this.loadSettings();
                this.showNotification('All data cleared', 'success');
            } catch (error) {
                console.error('Error clearing data:', error);
                this.showNotification('Error clearing data', 'error');
            }
        }
    }

    async updateStorageInfo() {
        try {
            const result = await chrome.storage.local.get(null);
            const dataStr = JSON.stringify(result);
            const usedBytes = new Blob([dataStr]).size;
            const usedKB = Math.round(usedBytes / 1024);
            const usedMB = (usedKB / 1024).toFixed(2);
            
            document.getElementById('storageUsed').textContent = 
                usedMB > 1 ? `${usedMB} MB` : `${usedKB} KB`;
            
            // Update storage bar (assuming 10MB limit)
            const percentage = (usedBytes / (10 * 1024 * 1024)) * 100;
            document.getElementById('storageFill').style.width = `${Math.min(percentage, 100)}%`;
            
        } catch (error) {
            console.error('Error updating storage info:', error);
        }
    }

    startMemoryMonitoring() {
        setInterval(() => {
            if (performance.memory) {
                const used = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
                document.getElementById('memoryUsage').textContent = `${used} MB`;
            }
        }, 5000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-size: 14px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            info: '#2196F3',
            warning: '#ff9800'
        };

        notification.style.background = colors[type] || colors.info;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.optionsManager = new OptionsManager();
});

// Add slide-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);