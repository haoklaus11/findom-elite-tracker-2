class StorageHealthMonitor {
    constructor() {
        this.maxStorageSize = 5 * 1024 * 1024; // 5MB limit
        this.maxTasks = 1000;
        this.cleanupInterval = 24 * 60 * 60 * 1000; // 24 hours
        this.init();
    }

    init() {
        console.log('Storage Health Monitor initialized');
        this.scheduleCleanup();
        this.monitorStorageHealth();
    }

    async monitorStorageHealth() {
        try {
            const usage = await this.getStorageUsage();
            console.log('Storage usage:', usage);
            
            if (usage.bytes > this.maxStorageSize * 0.8) {
                console.warn('Storage approaching limit, triggering cleanup');
                this.performCleanup();
            }
        } catch (error) {
            console.error('Storage health monitoring error:', error);
        }
    }

    async getStorageUsage() {
        try {
            const bytesInUse = await chrome.storage.local.getBytesInUse();
            return {
                bytes: bytesInUse,
                percentage: (bytesInUse / this.maxStorageSize) * 100,
                formatted: this.formatBytes(bytesInUse)
            };
        } catch (error) {
            console.error('Error getting storage usage:', error);
            return { bytes: 0, percentage: 0, formatted: '0 B' };
        }
    }

    async performCleanup() {
        try {
            const result = await chrome.storage.local.get(['tasks', 'interactions']);
            const tasks = result.tasks || [];
            const interactions = result.interactions || [];

            // Clean old completed tasks (older than 30 days)
            const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
            const cleanTasks = tasks.filter(task => {
                if (task.completed && new Date(task.created).getTime() < thirtyDaysAgo) {
                    return false;
                }
                return true;
            });

            // Limit total tasks to max
            const limitedTasks = cleanTasks.slice(0, this.maxTasks);

            // Clean old interactions (keep only last 100)
            const limitedInteractions = interactions.slice(-100);

            // Update storage
            await chrome.storage.local.set({
                tasks: limitedTasks,
                interactions: limitedInteractions,
                lastCleanup: Date.now()
            });

            console.log(`Cleanup completed:
                Tasks: ${tasks.length} → ${limitedTasks.length}
                Interactions: ${interactions.length} → ${limitedInteractions.length}`);

        } catch (error) {
            console.error('Cleanup error:', error);
        }
    }

    scheduleCleanup() {
        // Schedule automatic cleanup every 24 hours
        setInterval(() => {
            this.performCleanup();
            this.monitorStorageHealth();
        }, this.cleanupInterval);
    }

    formatBytes(bytes) {
        const sizes = ['B', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 B';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    async getHealthReport() {
        try {
            const usage = await this.getStorageUsage();
            const result = await chrome.storage.local.get(['tasks', 'interactions', 'lastCleanup']);
            
            return {
                storage: usage,
                tasks: {
                    total: (result.tasks || []).length,
                    completed: (result.tasks || []).filter(t => t.completed).length,
                    active: (result.tasks || []).filter(t => !t.completed).length
                },
                interactions: (result.interactions || []).length,
                lastCleanup: result.lastCleanup || 'Never',
                status: usage.percentage > 80 ? 'WARNING' : 'HEALTHY'
            };
        } catch (error) {
            console.error('Error generating health report:', error);
            return {
                storage: { bytes: 0, percentage: 0, formatted: '0 B' },
                tasks: { total: 0, completed: 0, active: 0 },
                interactions: 0,
                lastCleanup: 'Never',
                status: 'ERROR'
            };
        }
    }
}

// Export for use in background script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageHealthMonitor;
} else {
    window.StorageHealthMonitor = StorageHealthMonitor;
}
