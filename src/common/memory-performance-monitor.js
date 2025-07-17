// Enhanced Memory Performance Monitor
// Works in both Chrome Extension and VS Code environments

class MemoryPerformanceMonitor {
    constructor() {
        this.isActive = true;
        this.memoryCheckInterval = null;
        this.performanceStats = {
            startTime: Date.now(),
            memoryPeaks: [],
            gcEvents: [],
            leakDetections: []
        };
        
        this.initializeMonitoring();
    }
    
    initializeMonitoring() {
        console.log('🔍 Initializing memory performance monitoring...');
        
        // Check for memory API availability
        if (typeof performance !== 'undefined' && performance.memory) {
            this.enableAdvancedMonitoring();
        } else {
            console.warn('⚠️ Performance.memory API not available, using basic monitoring');
            this.enableBasicMonitoring();
        }
        
        // Monitor memory usage every 30 seconds
        this.memoryCheckInterval = setInterval(() => {
            this.checkMemoryUsage();
        }, 30000);
        
        console.log('✅ Memory performance monitoring initialized');
    }
    
    enableAdvancedMonitoring() {
        console.log('🚀 Advanced memory monitoring enabled');
        
        // Monitor garbage collection events
        if (typeof PerformanceObserver !== 'undefined') {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        if (entry.name === 'gc') {
                            this.performanceStats.gcEvents.push({
                                timestamp: Date.now(),
                                duration: entry.duration,
                                startTime: entry.startTime
                            });
                        }
                    });
                });
                
                observer.observe({ entryTypes: ['measure'] });
            } catch (error) {
                console.warn('⚠️ PerformanceObserver not supported:', error);
            }
        }
    }
    
    enableBasicMonitoring() {
        console.log('📊 Basic memory monitoring enabled');
        
        // Use basic memory tracking
        this.trackBasicMemoryUsage();
    }
    
    checkMemoryUsage() {
        if (!this.isActive) return;
        
        try {
            let memoryInfo = null;
            
            // Try Chrome extension memory API
            if (typeof chrome !== 'undefined' && chrome.system && chrome.system.memory) {
                chrome.system.memory.getInfo((info) => {
                    this.analyzeMemoryInfo({
                        totalCapacity: info.capacity,
                        availableCapacity: info.availableCapacity,
                        usedCapacity: info.capacity - info.availableCapacity
                    });
                });
                return;
            }
            
            // Try performance.memory API
            if (typeof performance !== 'undefined' && performance.memory) {
                memoryInfo = {
                    usedJSHeapSize: performance.memory.usedJSHeapSize,
                    totalJSHeapSize: performance.memory.totalJSHeapSize,
                    jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
                };
                
                this.analyzeMemoryInfo(memoryInfo);
                return;
            }
            
            // Fallback to basic monitoring
            this.trackBasicMemoryUsage();
            
        } catch (error) {
            console.warn('⚠️ Memory check error:', error);
        }
    }
    
    analyzeMemoryInfo(memoryInfo) {
        const timestamp = Date.now();
        
        // Calculate memory usage percentage
        let usagePercentage = 0;
        if (memoryInfo.usedJSHeapSize && memoryInfo.jsHeapSizeLimit) {
            usagePercentage = (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100;
        } else if (memoryInfo.usedCapacity && memoryInfo.totalCapacity) {
            usagePercentage = (memoryInfo.usedCapacity / memoryInfo.totalCapacity) * 100;
        }
        
        // Track memory peaks
        if (usagePercentage > 80) {
            this.performanceStats.memoryPeaks.push({
                timestamp,
                usagePercentage,
                memoryInfo
            });
            
            console.warn('🚨 High memory usage detected:', usagePercentage.toFixed(2) + '%');
        }
        
        // Detect potential memory leaks
        if (this.performanceStats.memoryPeaks.length > 5) {
            this.detectMemoryLeaks();
        }
        
        console.log('📊 Memory usage:', usagePercentage.toFixed(2) + '%');
    }
    
    trackBasicMemoryUsage() {
        // Basic memory tracking using DOM and event listener counts
        const stats = {
            timestamp: Date.now(),
            domNodes: document.querySelectorAll('*').length,
            eventListeners: this.countEventListeners(),
            timers: this.countActiveTimers()
        };
        
        console.log('📊 Basic memory stats:', stats);
    }
    
    countEventListeners() {
        // Try to estimate event listener count
        let count = 0;
        try {
            const elements = document.querySelectorAll('*');
            elements.forEach(element => {
                if (element._listeners) {
                    count += Object.keys(element._listeners).length;
                }
            });
        } catch (error) {
            // Fallback estimation
            count = document.querySelectorAll('*[onclick], button, input, a').length;
        }
        return count;
    }
    
    countActiveTimers() {
        // Estimate active timers (this is approximate)
        let count = 0;
        try {
            // Check global timer trackers
            if (typeof timeoutIds !== 'undefined') count += timeoutIds.size;
            if (typeof intervalIds !== 'undefined') count += intervalIds.size;
            if (typeof globalMemoryTracker !== 'undefined' && globalMemoryTracker.getMemoryStats) {
                const stats = globalMemoryTracker.getMemoryStats();
                count += (stats.timeouts || 0) + (stats.intervals || 0);
            }
        } catch (error) {
            console.warn('⚠️ Timer count estimation error:', error);
        }
        return count;
    }
    
    detectMemoryLeaks() {
        console.log('🔍 Analyzing memory patterns for leaks...');
        
        const recentPeaks = this.performanceStats.memoryPeaks.slice(-5);
        const averageUsage = recentPeaks.reduce((sum, peak) => sum + peak.usagePercentage, 0) / recentPeaks.length;
        
        if (averageUsage > 85) {
            this.performanceStats.leakDetections.push({
                timestamp: Date.now(),
                averageUsage,
                peakCount: recentPeaks.length,
                suspectedLeak: true
            });
            
            console.error('🚨 Potential memory leak detected! Average usage:', averageUsage.toFixed(2) + '%');
            
            // Trigger cleanup
            if (typeof cleanupMemoryLeaks === 'function') {
                cleanupMemoryLeaks();
            }
        }
    }
    
    getPerformanceReport() {
        const uptime = Date.now() - this.performanceStats.startTime;
        
        return {
            uptime: uptime,
            uptimeFormatted: this.formatDuration(uptime),
            memoryPeaks: this.performanceStats.memoryPeaks.length,
            gcEvents: this.performanceStats.gcEvents.length,
            leakDetections: this.performanceStats.leakDetections.length,
            lastMemoryPeak: this.performanceStats.memoryPeaks[this.performanceStats.memoryPeaks.length - 1],
            lastGC: this.performanceStats.gcEvents[this.performanceStats.gcEvents.length - 1],
            lastLeakDetection: this.performanceStats.leakDetections[this.performanceStats.leakDetections.length - 1]
        };
    }
    
    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }
    
    cleanup() {
        console.log('🧹 Cleaning up memory performance monitor...');
        
        this.isActive = false;
        
        if (this.memoryCheckInterval) {
            clearInterval(this.memoryCheckInterval);
            this.memoryCheckInterval = null;
        }
        
        // Clear performance stats
        this.performanceStats = {
            startTime: 0,
            memoryPeaks: [],
            gcEvents: [],
            leakDetections: []
        };
        
        console.log('✅ Memory performance monitor cleaned up');
    }
}

// Initialize performance monitor if not already available
if (typeof window !== 'undefined' && !window.memoryPerformanceMonitor) {
    window.memoryPerformanceMonitor = new MemoryPerformanceMonitor();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MemoryPerformanceMonitor;
}
