// Advanced Memory and Performance Monitor for Elite Chambers Extension
class PerformanceOptimizer {
    constructor() {
        this.memoryThreshold = 50 * 1024 * 1024; // 50MB threshold
        this.cpuThreshold = 80; // 80% CPU usage threshold
        this.timers = new Map();
        this.intervals = new Map();
        this.listeners = new Map();
        this.observers = new Map();
        this.animationFrames = new Set();
        this.workers = new Set();
        this.connections = new Set();
        this.isMonitoring = false;
        this.performanceMetrics = {
            memoryUsage: [],
            cpuUsage: [],
            taskCount: 0,
            lastCleanup: Date.now()
        };
        this.init();
    }

    init() {
        this.startMonitoring();
        this.setupCleanupTriggers();
        this.optimizeExistingCode();
        console.log('🚀 Performance Optimizer initialized');
    }

    // Memory Management
    startMonitoring() {
        if (this.isMonitoring) return;
        this.isMonitoring = true;

        // Monitor memory usage every 30 seconds
        const memoryMonitor = setInterval(() => {
            this.checkMemoryUsage();
        }, 30000);
        this.intervals.set('memoryMonitor', memoryMonitor);

        // Monitor CPU usage every 15 seconds
        const cpuMonitor = setInterval(() => {
            this.checkCPUUsage();
        }, 15000);
        this.intervals.set('cpuMonitor', cpuMonitor);

        // Cleanup routine every 5 minutes
        const cleanupRoutine = setInterval(() => {
            this.performCleanup();
        }, 300000);
        this.intervals.set('cleanupRoutine', cleanupRoutine);
    }

    checkMemoryUsage() {
        if (performance.memory) {
            const usage = performance.memory.usedJSHeapSize;
            this.performanceMetrics.memoryUsage.push({
                timestamp: Date.now(),
                usage: usage
            });

            // Keep only last 100 measurements
            if (this.performanceMetrics.memoryUsage.length > 100) {
                this.performanceMetrics.memoryUsage.shift();
            }

            if (usage > this.memoryThreshold) {
                console.warn('🚨 Memory usage high:', Math.round(usage / 1024 / 1024) + 'MB');
                this.performEmergencyCleanup();
            }
        }
    }

    checkCPUUsage() {
        const start = performance.now();
        
        // Simple CPU usage estimation
        setTimeout(() => {
            const elapsed = performance.now() - start;
            const cpuUsage = Math.min(100, elapsed * 10);
            
            this.performanceMetrics.cpuUsage.push({
                timestamp: Date.now(),
                usage: cpuUsage
            });

            // Keep only last 100 measurements
            if (this.performanceMetrics.cpuUsage.length > 100) {
                this.performanceMetrics.cpuUsage.shift();
            }

            if (cpuUsage > this.cpuThreshold) {
                console.warn('🚨 CPU usage high:', Math.round(cpuUsage) + '%');
                this.throttleOperations();
            }
        }, 10);
    }

    // Timer Management
    createTimer(callback, delay, id = null) {
        const timerId = id || 'timer_' + Date.now();
        const timer = setTimeout(() => {
            callback();
            this.timers.delete(timerId);
        }, delay);
        
        this.timers.set(timerId, timer);
        return timerId;
    }

    createInterval(callback, delay, id = null) {
        const intervalId = id || 'interval_' + Date.now();
        const interval = setInterval(callback, delay);
        
        this.intervals.set(intervalId, interval);
        return intervalId;
    }

    clearTimer(id) {
        if (this.timers.has(id)) {
            clearTimeout(this.timers.get(id));
            this.timers.delete(id);
        }
    }

    clearInterval(id) {
        if (this.intervals.has(id)) {
            clearInterval(this.intervals.get(id));
            this.intervals.delete(id);
        }
    }

    // Event Listener Management
    addListener(element, event, callback, options = {}) {
        const listenerId = 'listener_' + Date.now();
        const wrappedCallback = this.throttleCallback(callback, 100);
        
        element.addEventListener(event, wrappedCallback, options);
        
        this.listeners.set(listenerId, {
            element,
            event,
            callback: wrappedCallback,
            options
        });
        
        return listenerId;
    }

    removeListener(id) {
        if (this.listeners.has(id)) {
            const listener = this.listeners.get(id);
            listener.element.removeEventListener(
                listener.event,
                listener.callback,
                listener.options
            );
            this.listeners.delete(id);
        }
    }

    // Observer Management
    createObserver(callback, options = {}) {
        const observerId = 'observer_' + Date.now();
        const observer = new MutationObserver(this.throttleCallback(callback, 200));
        
        this.observers.set(observerId, observer);
        return { id: observerId, observer };
    }

    destroyObserver(id) {
        if (this.observers.has(id)) {
            const observer = this.observers.get(id);
            observer.disconnect();
            this.observers.delete(id);
        }
    }

    // Animation Frame Management
    requestAnimationFrame(callback) {
        const frameId = requestAnimationFrame(() => {
            callback();
            this.animationFrames.delete(frameId);
        });
        
        this.animationFrames.add(frameId);
        return frameId;
    }

    cancelAnimationFrame(frameId) {
        if (this.animationFrames.has(frameId)) {
            cancelAnimationFrame(frameId);
            this.animationFrames.delete(frameId);
        }
    }

    // Web Worker Management
    createWorker(scriptUrl) {
        const worker = new Worker(scriptUrl);
        this.workers.add(worker);
        
        worker.addEventListener('error', (error) => {
            console.error('Worker error:', error);
            this.terminateWorker(worker);
        });
        
        return worker;
    }

    terminateWorker(worker) {
        if (this.workers.has(worker)) {
            worker.terminate();
            this.workers.delete(worker);
        }
    }

    // Connection Management (WebSocket, EventSource, etc.)
    registerConnection(connection) {
        this.connections.add(connection);
        
        connection.addEventListener('close', () => {
            this.connections.delete(connection);
        });
        
        connection.addEventListener('error', () => {
            this.closeConnection(connection);
        });
    }

    closeConnection(connection) {
        if (this.connections.has(connection)) {
            if (connection.close) {
                connection.close();
            }
            this.connections.delete(connection);
        }
    }

    // Utility Functions
    throttleCallback(callback, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                return callback.apply(this, args);
            }
        };
    }

    debounceCallback(callback, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => callback.apply(this, args), delay);
        };
    }

    // Cleanup Operations
    performCleanup() {
        console.log('🧹 Performing routine cleanup...');
        
        // Clear old performance metrics
        const cutoffTime = Date.now() - (60 * 60 * 1000); // 1 hour ago
        this.performanceMetrics.memoryUsage = this.performanceMetrics.memoryUsage.filter(
            item => item.timestamp > cutoffTime
        );
        this.performanceMetrics.cpuUsage = this.performanceMetrics.cpuUsage.filter(
            item => item.timestamp > cutoffTime
        );

        // Clear old localStorage items
        this.cleanupLocalStorage();

        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }

        // Clear DOM references
        this.clearDOMReferences();

        this.performanceMetrics.lastCleanup = Date.now();
        console.log('✅ Cleanup completed');
    }

    performEmergencyCleanup() {
        console.log('🚨 Performing emergency cleanup...');
        
        // Clear all non-essential timers
        this.clearNonEssentialTimers();
        
        // Clear all cached data
        this.clearCaches();
        
        // Stop all animations
        this.stopAllAnimations();
        
        // Force garbage collection
        if (window.gc) {
            window.gc();
        }
        
        console.log('✅ Emergency cleanup completed');
    }

    clearNonEssentialTimers() {
        // Keep only essential timers
        const essentialTimers = ['memoryMonitor', 'cpuMonitor', 'cleanupRoutine'];
        
        for (const [id, timer] of this.timers) {
            if (!essentialTimers.includes(id)) {
                clearTimeout(timer);
                this.timers.delete(id);
            }
        }
        
        for (const [id, interval] of this.intervals) {
            if (!essentialTimers.includes(id)) {
                clearInterval(interval);
                this.intervals.delete(id);
            }
        }
    }

    clearCaches() {
        // Clear in-memory caches
        if (typeof window.caches !== 'undefined') {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
            });
        }

        // Clear extension storage selectively
        this.clearNonEssentialStorage();
    }

    clearNonEssentialStorage() {
        const essentialKeys = ['username', 'sessionToken', 'userSettings'];
        
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (!essentialKeys.includes(key)) {
                localStorage.removeItem(key);
            }
        }
    }

    stopAllAnimations() {
        // Cancel all animation frames
        this.animationFrames.forEach(frameId => {
            cancelAnimationFrame(frameId);
        });
        this.animationFrames.clear();
        
        // Stop CSS animations
        const animatedElements = document.querySelectorAll('[style*="animation"]');
        animatedElements.forEach(element => {
            element.style.animation = 'none';
        });
    }

    clearDOMReferences() {
        // Clear any stored DOM references
        const elementsToNull = [
            'cachedElements',
            'domRefs',
            'elementCache'
        ];
        
        elementsToNull.forEach(prop => {
            if (window[prop]) {
                window[prop] = null;
            }
        });
    }

    throttleOperations() {
        console.log('⚡ Throttling operations due to high CPU usage...');
        
        // Increase intervals for non-critical operations
        const throttledIntervals = ['githubSync', 'progressUpdate', 'uiUpdate'];
        
        throttledIntervals.forEach(intervalName => {
            if (this.intervals.has(intervalName)) {
                this.clearInterval(intervalName);
                // Restart with longer delay
                const originalDelay = 15000; // 15 seconds
                const throttledDelay = originalDelay * 2; // 30 seconds
                
                this.createInterval(() => {
                    // Reduced frequency operation
                }, throttledDelay, intervalName);
            }
        });
    }

    // Setup cleanup triggers
    setupCleanupTriggers() {
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            this.destroy();
        });

        // Cleanup on visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.performCleanup();
            }
        });

        // Cleanup on low memory
        if ('memory' in performance) {
            this.createInterval(() => {
                if (performance.memory.usedJSHeapSize > this.memoryThreshold) {
                    this.performEmergencyCleanup();
                }
            }, 10000, 'memoryWatcher');
        }
    }

    // Optimize existing code
    optimizeExistingCode() {
        // Optimize DOM queries
        this.optimizeDOMQueries();
        
        // Optimize event listeners
        this.optimizeEventListeners();
        
        // Optimize animations
        this.optimizeAnimations();
        
        // Optimize network requests
        this.optimizeNetworkRequests();
    }

    optimizeDOMQueries() {
        // Cache frequently accessed elements
        const commonElements = {
            mainDashboard: document.getElementById('mainDashboard'),
            taskList: document.getElementById('taskList'),
            progressBars: document.querySelectorAll('.progress-bar'),
            tributeButtons: document.querySelectorAll('.tribute-btn'),
            taskButtons: document.querySelectorAll('.task-btn')
        };
        
        // Store in optimized cache
        window.optimizedElements = commonElements;
    }

    optimizeEventListeners() {
        // Use event delegation for dynamic elements
        const taskList = document.getElementById('taskList');
        if (taskList) {
            this.addListener(taskList, 'click', (e) => {
                const target = e.target.closest('.task-btn-primary');
                if (target) {
                    this.handleTaskClick(target);
                }
            });
        }
    }

    optimizeAnimations() {
        // Use CSS animations instead of JavaScript where possible
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach(element => {
            element.style.willChange = 'transform, opacity';
        });
    }

    optimizeNetworkRequests() {
        // Implement request batching
        this.requestQueue = [];
        this.requestBatcher = this.debounceCallback(() => {
            this.processBatchedRequests();
        }, 500);
    }

    processBatchedRequests() {
        if (this.requestQueue.length === 0) return;
        
        const batch = this.requestQueue.splice(0, 5); // Process 5 at a time
        
        batch.forEach(request => {
            // Process individual request
            this.processRequest(request);
        });
        
        // Continue processing if queue not empty
        if (this.requestQueue.length > 0) {
            this.createTimer(() => {
                this.processBatchedRequests();
            }, 1000);
        }
    }

    processRequest(request) {
        // Implement actual request processing
        console.log('Processing request:', request);
    }

    // Performance monitoring
    getPerformanceStats() {
        return {
            memoryUsage: this.getCurrentMemoryUsage(),
            cpuUsage: this.getCurrentCPUUsage(),
            activeTimers: this.timers.size,
            activeIntervals: this.intervals.size,
            activeListeners: this.listeners.size,
            activeObservers: this.observers.size,
            activeAnimationFrames: this.animationFrames.size,
            activeWorkers: this.workers.size,
            activeConnections: this.connections.size,
            lastCleanup: this.performanceMetrics.lastCleanup
        };
    }

    getCurrentMemoryUsage() {
        if (performance.memory) {
            return {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    }

    getCurrentCPUUsage() {
        const recent = this.performanceMetrics.cpuUsage.slice(-10);
        if (recent.length === 0) return 0;
        
        const sum = recent.reduce((acc, item) => acc + item.usage, 0);
        return Math.round(sum / recent.length);
    }

    // Destruction
    destroy() {
        console.log('🛑 Destroying Performance Optimizer...');
        
        // Clear all timers
        this.timers.forEach(timer => clearTimeout(timer));
        this.timers.clear();
        
        // Clear all intervals
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals.clear();
        
        // Remove all listeners
        this.listeners.forEach(listener => {
            listener.element.removeEventListener(
                listener.event,
                listener.callback,
                listener.options
            );
        });
        this.listeners.clear();
        
        // Disconnect all observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        // Cancel all animation frames
        this.animationFrames.forEach(frameId => cancelAnimationFrame(frameId));
        this.animationFrames.clear();
        
        // Terminate all workers
        this.workers.forEach(worker => worker.terminate());
        this.workers.clear();
        
        // Close all connections
        this.connections.forEach(connection => {
            if (connection.close) connection.close();
        });
        this.connections.clear();
        
        this.isMonitoring = false;
        
        console.log('✅ Performance Optimizer destroyed');
    }
}

// Initialize global performance optimizer
window.performanceOptimizer = new PerformanceOptimizer();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}
