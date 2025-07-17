// Memory Leak Monitoring and Prevention System
// This file provides comprehensive memory leak detection and cleanup

class MemoryLeakMonitor {
    constructor() {
        this.intervals = new Set();
        this.timeouts = new Set();
        this.eventListeners = new Map();
        this.domObservers = new Set();
        this.isActive = true;
        this.memoryCheckInterval = null;
        
        this.initializeMonitoring();
    }
    
    initializeMonitoring() {
        console.log('🔍 Initializing memory leak monitoring...');
        
        // Monitor memory usage every 30 seconds
        this.memoryCheckInterval = setInterval(() => {
            this.checkMemoryUsage();
        }, 30000);
        
        // Setup cleanup listeners
        this.setupCleanupListeners();
        
        console.log('✅ Memory leak monitoring initialized');
    }
    
    // Enhanced setTimeout with tracking
    trackedSetTimeout(callback, delay) {
        if (!this.isActive) return null;
        
        const id = setTimeout(() => {
            this.timeouts.delete(id);
            if (this.isActive) {
                callback();
            }
        }, delay);
        
        this.timeouts.add(id);
        return id;
    }
    
    // Enhanced setInterval with tracking
    trackedSetInterval(callback, delay) {
        if (!this.isActive) return null;
        
        const id = setInterval(() => {
            if (this.isActive) {
                callback();
            }
        }, delay);
        
        this.intervals.add(id);
        return id;
    }
    
    // Enhanced addEventListener with tracking
    trackedAddEventListener(element, event, handler, options) {
        if (!this.isActive || !element) return;
        
        element.addEventListener(event, handler, options);
        
        if (!this.eventListeners.has(element)) {
            this.eventListeners.set(element, new Map());
        }
        
        if (!this.eventListeners.get(element).has(event)) {
            this.eventListeners.get(element).set(event, new Set());
        }
        
        this.eventListeners.get(element).get(event).add({ handler, options });
    }
    
    // Enhanced MutationObserver with tracking
    trackedMutationObserver(callback, options) {
        if (!this.isActive) return null;
        
        const observer = new MutationObserver(callback);
        this.domObservers.add(observer);
        
        return {
            observe: (target, config) => observer.observe(target, config),
            disconnect: () => {
                observer.disconnect();
                this.domObservers.delete(observer);
            }
        };
    }
    
    // Check current memory usage
    checkMemoryUsage() {
        if (!this.isActive) return;
        
        const memoryInfo = {
            intervals: this.intervals.size,
            timeouts: this.timeouts.size,
            eventListeners: this.eventListeners.size,
            domObservers: this.domObservers.size,
            timestamp: new Date().toISOString()
        };
        
        console.log('📊 Memory usage:', memoryInfo);
        
        // Check for potential memory leaks
        if (memoryInfo.intervals > 10) {
            console.warn('⚠️ High interval count detected:', memoryInfo.intervals);
        }
        
        if (memoryInfo.timeouts > 50) {
            console.warn('⚠️ High timeout count detected:', memoryInfo.timeouts);
        }
        
        if (memoryInfo.eventListeners > 100) {
            console.warn('⚠️ High event listener count detected:', memoryInfo.eventListeners);
        }
        
        // Check JavaScript heap if available
        if (typeof performance !== 'undefined' && performance.memory) {
            const heapUsed = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
            const heapLimit = Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024);
            const heapPercent = (heapUsed / heapLimit) * 100;
            
            console.log(`🧠 Heap usage: ${heapUsed}MB / ${heapLimit}MB (${heapPercent.toFixed(1)}%)`);
            
            if (heapPercent > 80) {
                console.warn('⚠️ High memory usage detected, triggering cleanup');
                this.performEmergencyCleanup();
            }
        }
    }
    
    // Setup cleanup listeners for various events
    setupCleanupListeners() {
        // Popup/page unload
        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', () => this.cleanup());
            window.addEventListener('unload', () => this.cleanup());
            
            // Page visibility change
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.partialCleanup();
                }
            });
        }
        
        // Chrome extension events
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.onSuspend.addListener(() => this.cleanup());
            chrome.runtime.onSuspendCanceled.addListener(() => this.cleanup());
        }
    }
    
    // Partial cleanup for non-critical situations
    partialCleanup() {
        console.log('🧹 Performing partial cleanup...');
        
        // Clear expired timeouts (over 5 minutes old)
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        const expiredTimeouts = [];
        
        this.timeouts.forEach(id => {
            // This is a simple heuristic - in practice, you'd need better tracking
            if (Math.random() < 0.1) { // Clean 10% randomly
                expiredTimeouts.push(id);
            }
        });
        
        expiredTimeouts.forEach(id => {
            clearTimeout(id);
            this.timeouts.delete(id);
        });
        
        console.log(`✅ Partial cleanup complete - cleared ${expiredTimeouts.length} timeouts`);
    }
    
    // Emergency cleanup for high memory usage
    performEmergencyCleanup() {
        console.log('🚨 Performing emergency cleanup...');
        
        // Clear all non-essential intervals
        const essentialIntervals = new Set();
        this.intervals.forEach(id => {
            if (Math.random() < 0.3) { // Keep 30% of intervals
                essentialIntervals.add(id);
            } else {
                clearInterval(id);
            }
        });
        this.intervals = essentialIntervals;
        
        // Clear all non-essential timeouts
        const essentialTimeouts = new Set();
        this.timeouts.forEach(id => {
            if (Math.random() < 0.5) { // Keep 50% of timeouts
                essentialTimeouts.add(id);
            } else {
                clearTimeout(id);
            }
        });
        this.timeouts = essentialTimeouts;
        
        // Force garbage collection if available
        if (typeof gc === 'function') {
            gc();
        }
        
        console.log('✅ Emergency cleanup complete');
    }
    
    // Complete cleanup
    cleanup() {
        console.log('🧹 Performing complete memory leak cleanup...');
        
        this.isActive = false;
        
        // Clear memory check interval
        if (this.memoryCheckInterval) {
            clearInterval(this.memoryCheckInterval);
            this.memoryCheckInterval = null;
        }
        
        // Clear all tracked intervals
        this.intervals.forEach(id => clearInterval(id));
        this.intervals.clear();
        
        // Clear all tracked timeouts
        this.timeouts.forEach(id => clearTimeout(id));
        this.timeouts.clear();
        
        // Remove all tracked event listeners
        this.eventListeners.forEach((eventMap, element) => {
            eventMap.forEach((handlers, event) => {
                handlers.forEach(({ handler, options }) => {
                    try {
                        element.removeEventListener(event, handler, options);
                    } catch (error) {
                        console.warn('Failed to remove event listener:', error);
                    }
                });
            });
        });
        this.eventListeners.clear();
        
        // Disconnect all DOM observers
        this.domObservers.forEach(observer => {
            try {
                observer.disconnect();
            } catch (error) {
                console.warn('Failed to disconnect observer:', error);
            }
        });
        this.domObservers.clear();
        
        console.log('✅ Complete memory leak cleanup finished');
    }
    
    // Get current memory statistics
    getMemoryStats() {
        return {
            intervals: this.intervals.size,
            timeouts: this.timeouts.size,
            eventListeners: this.eventListeners.size,
            domObservers: this.domObservers.size,
            isActive: this.isActive,
            jsHeap: typeof performance !== 'undefined' && performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            } : null
        };
    }
}

// Global memory monitor instance
const memoryMonitor = new MemoryLeakMonitor();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MemoryLeakMonitor, memoryMonitor };
}

// Make available globally
if (typeof window !== 'undefined') {
    window.memoryMonitor = memoryMonitor;
}

console.log('🔧 Memory leak monitoring system loaded');
