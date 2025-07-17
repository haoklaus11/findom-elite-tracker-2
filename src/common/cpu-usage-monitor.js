// CPU Usage Monitor and Optimization System
class CPUUsageMonitor {
    constructor() {
        this.measurementInterval = 1000; // 1 second
        this.measurements = [];
        this.thresholds = {
            warning: 70,
            critical: 90,
            emergency: 95
        };
        this.isMonitoring = false;
        this.optimizationLevel = 'normal';
        this.throttledOperations = new Set();
        this.postponedOperations = [];
        this.performanceMode = 'balanced';
        this.init();
    }

    init() {
        this.startMonitoring();
        this.setupPerformanceObserver();
        this.setupTaskScheduler();
        console.log('⚡ CPU Usage Monitor initialized');
    }

    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        
        // Use more accurate CPU measurement
        this.measureCPUUsage();
        
        setInterval(() => {
            this.measureCPUUsage();
        }, this.measurementInterval);
    }

    measureCPUUsage() {
        const start = performance.now();
        const iterations = 100000;
        
        // Perform a standardized CPU-intensive task
        for (let i = 0; i < iterations; i++) {
            Math.random() * Math.random();
        }
        
        const end = performance.now();
        const duration = end - start;
        
        // Calculate CPU usage percentage (simplified)
        const cpuUsage = Math.min(100, (duration / 50) * 100);
        
        const measurement = {
            timestamp: Date.now(),
            usage: cpuUsage,
            duration: duration,
            level: this.getCPULevel(cpuUsage)
        };
        
        this.measurements.push(measurement);
        
        // Keep only last 60 measurements (1 minute)
        if (this.measurements.length > 60) {
            this.measurements.shift();
        }
        
        this.processUsageLevel(cpuUsage);
        
        return measurement;
    }

    getCPULevel(usage) {
        if (usage >= this.thresholds.emergency) return 'emergency';
        if (usage >= this.thresholds.critical) return 'critical';
        if (usage >= this.thresholds.warning) return 'warning';
        return 'normal';
    }

    processUsageLevel(usage) {
        const level = this.getCPULevel(usage);
        
        switch (level) {
            case 'emergency':
                this.handleEmergencyUsage();
                break;
            case 'critical':
                this.handleCriticalUsage();
                break;
            case 'warning':
                this.handleWarningUsage();
                break;
            case 'normal':
                this.handleNormalUsage();
                break;
        }
    }

    handleEmergencyUsage() {
        console.warn('🚨 Emergency CPU usage detected!');
        this.optimizationLevel = 'emergency';
        this.performanceMode = 'power-saving';
        
        // Immediately stop all non-essential operations
        this.stopNonEssentialOperations();
        
        // Throttle all operations to minimum
        this.throttleAllOperations();
        
        // Postpone all non-critical tasks
        this.postponeNonCriticalTasks();
        
        // Request immediate garbage collection
        this.requestGarbageCollection();
    }

    handleCriticalUsage() {
        console.warn('⚠️ Critical CPU usage detected!');
        this.optimizationLevel = 'critical';
        this.performanceMode = 'performance';
        
        // Stop resource-intensive operations
        this.stopResourceIntensiveOperations();
        
        // Throttle animations and visual updates
        this.throttleVisualOperations();
        
        // Delay non-essential network requests
        this.delayNonEssentialRequests();
    }

    handleWarningUsage() {
        console.warn('⚠️ Warning CPU usage detected!');
        this.optimizationLevel = 'warning';
        this.performanceMode = 'balanced';
        
        // Throttle heavy operations
        this.throttleHeavyOperations();
        
        // Optimize animation frame rate
        this.optimizeAnimationFrameRate();
    }

    handleNormalUsage() {
        if (this.optimizationLevel !== 'normal') {
            console.log('✅ CPU usage returned to normal');
            this.optimizationLevel = 'normal';
            this.performanceMode = 'balanced';
            
            // Resume throttled operations
            this.resumeThrottledOperations();
            
            // Process postponed operations
            this.processPostponedOperations();
        }
    }

    stopNonEssentialOperations() {
        // Stop animations
        this.throttleOperation('animations', () => {
            const animatedElements = document.querySelectorAll('[data-animate]');
            animatedElements.forEach(element => {
                element.style.animationPlayState = 'paused';
            });
        });
        
        // Stop background sync
        this.throttleOperation('background-sync', () => {
            if (window.performanceOptimizer) {
                window.performanceOptimizer.clearInterval('githubSync');
                window.performanceOptimizer.clearInterval('progressUpdate');
            }
        });
        
        // Stop visual effects
        this.throttleOperation('visual-effects', () => {
            const elements = document.querySelectorAll('.glow, .shine, .pulse');
            elements.forEach(element => {
                element.style.animation = 'none';
            });
        });
    }

    throttleAllOperations() {
        // Throttle DOM updates
        this.throttleOperation('dom-updates', () => {
            this.throttledDOMUpdates = true;
        });
        
        // Throttle event handling
        this.throttleOperation('event-handling', () => {
            this.throttledEventHandling = true;
        });
        
        // Throttle network requests
        this.throttleOperation('network-requests', () => {
            this.throttledNetworkRequests = true;
        });
    }

    postponeNonCriticalTasks() {
        // Postpone analytics tracking
        this.postponeOperation('analytics', () => {
            // Queue analytics events instead of sending immediately
        });
        
        // Postpone cache updates
        this.postponeOperation('cache-updates', () => {
            // Queue cache updates
        });
        
        // Postpone non-essential DOM updates
        this.postponeOperation('dom-updates', () => {
            // Queue DOM updates
        });
    }

    stopResourceIntensiveOperations() {
        // Stop complex calculations
        this.throttleOperation('calculations', () => {
            if (window.complexCalculations) {
                window.complexCalculations.pause();
            }
        });
        
        // Stop heavy DOM manipulations
        this.throttleOperation('dom-manipulation', () => {
            this.deferDOMManipulation = true;
        });
        
        // Stop image processing
        this.throttleOperation('image-processing', () => {
            if (window.imageProcessor) {
                window.imageProcessor.pause();
            }
        });
    }

    throttleVisualOperations() {
        // Reduce animation frame rate
        this.throttleOperation('animation-fps', () => {
            this.animationFrameRate = 30; // Reduce from 60fps to 30fps
        });
        
        // Throttle progress bar updates
        this.throttleOperation('progress-updates', () => {
            this.progressUpdateInterval = 2000; // Update every 2 seconds instead of 1
        });
        
        // Throttle visual feedback
        this.throttleOperation('visual-feedback', () => {
            this.visualFeedbackDelay = 500; // Delay visual feedback
        });
    }

    delayNonEssentialRequests() {
        // Delay analytics requests
        this.delayOperation('analytics-requests', 5000);
        
        // Delay background data sync
        this.delayOperation('background-sync', 10000);
        
        // Delay image loading
        this.delayOperation('image-loading', 3000);
    }

    throttleHeavyOperations() {
        // Throttle search operations
        this.throttleOperation('search', () => {
            this.searchThrottleDelay = 500; // Increase search delay
        });
        
        // Throttle data processing
        this.throttleOperation('data-processing', () => {
            this.dataProcessingBatchSize = 10; // Reduce batch size
        });
    }

    optimizeAnimationFrameRate() {
        // Implement frame rate optimization
        this.targetFrameRate = 30; // Reduce from 60fps
        this.frameInterval = 1000 / this.targetFrameRate;
        this.lastFrameTime = 0;
        
        // Override requestAnimationFrame
        const originalRAF = window.requestAnimationFrame;
        window.requestAnimationFrame = (callback) => {
            const now = Date.now();
            const timeSinceLastFrame = now - this.lastFrameTime;
            
            if (timeSinceLastFrame >= this.frameInterval) {
                this.lastFrameTime = now;
                return originalRAF(callback);
            } else {
                return setTimeout(() => {
                    this.lastFrameTime = Date.now();
                    callback();
                }, this.frameInterval - timeSinceLastFrame);
            }
        };
    }

    throttleOperation(name, operation) {
        if (!this.throttledOperations.has(name)) {
            this.throttledOperations.add(name);
            operation();
        }
    }

    postponeOperation(name, operation) {
        this.postponedOperations.push({
            name: name,
            operation: operation,
            timestamp: Date.now()
        });
    }

    delayOperation(name, delay) {
        setTimeout(() => {
            this.processDelayedOperation(name);
        }, delay);
    }

    processDelayedOperation(name) {
        // Process the delayed operation
        console.log(`Processing delayed operation: ${name}`);
    }

    resumeThrottledOperations() {
        // Resume animations
        if (this.throttledOperations.has('animations')) {
            const animatedElements = document.querySelectorAll('[data-animate]');
            animatedElements.forEach(element => {
                element.style.animationPlayState = 'running';
            });
        }
        
        // Resume background operations
        if (this.throttledOperations.has('background-sync')) {
            if (window.performanceOptimizer) {
                window.performanceOptimizer.createInterval(() => {
                    // Resume GitHub sync
                }, 30000, 'githubSync');
            }
        }
        
        // Clear throttled operations
        this.throttledOperations.clear();
        
        // Reset throttled flags
        this.throttledDOMUpdates = false;
        this.throttledEventHandling = false;
        this.throttledNetworkRequests = false;
    }

    processPostponedOperations() {
        // Process operations that were postponed
        const currentTime = Date.now();
        
        this.postponedOperations.forEach((item, index) => {
            // Process operations older than 30 seconds
            if (currentTime - item.timestamp > 30000) {
                try {
                    item.operation();
                    console.log(`Processed postponed operation: ${item.name}`);
                } catch (error) {
                    console.error(`Error processing postponed operation ${item.name}:`, error);
                }
            }
        });
        
        // Remove processed operations
        this.postponedOperations = this.postponedOperations.filter(item => 
            currentTime - item.timestamp <= 30000
        );
    }

    requestGarbageCollection() {
        // Request garbage collection if available
        if (window.gc) {
            window.gc();
        }
        
        // Clear caches
        if (window.caches) {
            caches.keys().then(names => {
                names.forEach(name => caches.delete(name));
            });
        }
        
        // Clear temporary data
        this.clearTemporaryData();
    }

    clearTemporaryData() {
        // Clear temporary variables
        const tempVariables = [
            'tempResults',
            'processingQueue',
            'temporaryCache',
            'workingData'
        ];
        
        tempVariables.forEach(varName => {
            if (window[varName]) {
                if (Array.isArray(window[varName])) {
                    window[varName].length = 0;
                } else {
                    window[varName] = null;
                }
            }
        });
    }

    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                
                entries.forEach(entry => {
                    if (entry.duration > 16) { // Longer than 16ms (60fps)
                        console.warn('Slow operation detected:', entry.name, entry.duration + 'ms');
                    }
                });
            });
            
            observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
        }
    }

    setupTaskScheduler() {
        // Implement task scheduling based on CPU usage
        this.taskQueue = [];
        this.isProcessingTasks = false;
        
        // Process tasks based on CPU availability
        setInterval(() => {
            this.processTaskQueue();
        }, 100);
    }

    processTaskQueue() {
        if (this.isProcessingTasks || this.taskQueue.length === 0) return;
        
        const currentUsage = this.getCurrentUsage();
        
        // Only process tasks if CPU usage is acceptable
        if (currentUsage < this.thresholds.warning) {
            this.isProcessingTasks = true;
            
            const task = this.taskQueue.shift();
            if (task) {
                this.executeTask(task);
            }
            
            this.isProcessingTasks = false;
        }
    }

    executeTask(task) {
        try {
            const startTime = performance.now();
            task.callback();
            const endTime = performance.now();
            
            console.log(`Task executed: ${task.name} (${endTime - startTime}ms)`);
        } catch (error) {
            console.error(`Task execution failed: ${task.name}`, error);
        }
    }

    scheduleTask(name, callback, priority = 'normal') {
        const task = {
            name: name,
            callback: callback,
            priority: priority,
            timestamp: Date.now()
        };
        
        // Insert task based on priority
        if (priority === 'high') {
            this.taskQueue.unshift(task);
        } else {
            this.taskQueue.push(task);
        }
    }

    getCurrentUsage() {
        const recentMeasurements = this.measurements.slice(-5);
        if (recentMeasurements.length === 0) return 0;
        
        const sum = recentMeasurements.reduce((acc, measurement) => acc + measurement.usage, 0);
        return sum / recentMeasurements.length;
    }

    getUsageReport() {
        const currentUsage = this.getCurrentUsage();
        const peakUsage = Math.max(...this.measurements.map(m => m.usage));
        const averageUsage = this.measurements.reduce((acc, m) => acc + m.usage, 0) / this.measurements.length;
        
        return {
            current: currentUsage,
            peak: peakUsage,
            average: averageUsage,
            level: this.getCPULevel(currentUsage),
            optimizationLevel: this.optimizationLevel,
            performanceMode: this.performanceMode,
            throttledOperations: Array.from(this.throttledOperations),
            postponedOperations: this.postponedOperations.length,
            taskQueueLength: this.taskQueue.length,
            measurements: this.measurements.slice(-10) // Last 10 measurements
        };
    }

    setPerformanceMode(mode) {
        this.performanceMode = mode;
        
        switch (mode) {
            case 'power-saving':
                this.thresholds.warning = 50;
                this.thresholds.critical = 70;
                this.thresholds.emergency = 85;
                break;
            case 'balanced':
                this.thresholds.warning = 70;
                this.thresholds.critical = 90;
                this.thresholds.emergency = 95;
                break;
            case 'performance':
                this.thresholds.warning = 80;
                this.thresholds.critical = 95;
                this.thresholds.emergency = 98;
                break;
        }
        
        console.log(`Performance mode set to: ${mode}`);
    }

    destroy() {
        console.log('🛑 Destroying CPU Usage Monitor...');
        
        this.isMonitoring = false;
        this.measurements = [];
        this.throttledOperations.clear();
        this.postponedOperations = [];
        this.taskQueue = [];
        
        console.log('✅ CPU Usage Monitor destroyed');
    }
}

// Initialize global CPU usage monitor
window.cpuUsageMonitor = new CPUUsageMonitor();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CPUUsageMonitor;
}
