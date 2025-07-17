// Memory Leak Detection and Prevention System
class MemoryLeakDetector {
    constructor() {
        this.snapshots = [];
        this.thresholds = {
            heapGrowth: 5 * 1024 * 1024, // 5MB
            nodeCount: 1000,
            listenerCount: 100,
            objectCount: 10000
        };
        this.detectedLeaks = new Set();
        this.isMonitoring = false;
        this.monitoringInterval = null;
        this.init();
    }

    init() {
        this.startMonitoring();
        this.setupLeakDetection();
        console.log('🔍 Memory Leak Detector initialized');
    }

    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        this.monitoringInterval = setInterval(() => {
            this.takeSnapshot();
            this.analyzeMemoryUsage();
        }, 60000); // Check every minute
    }

    takeSnapshot() {
        const snapshot = {
            timestamp: Date.now(),
            memory: this.getMemoryInfo(),
            domNodes: this.getDOMNodeCount(),
            eventListeners: this.getEventListenerCount(),
            timers: this.getTimerCount(),
            objects: this.getObjectCount()
        };
        
        this.snapshots.push(snapshot);
        
        // Keep only last 10 snapshots
        if (this.snapshots.length > 10) {
            this.snapshots.shift();
        }
        
        return snapshot;
    }

    getMemoryInfo() {
        if (performance.memory) {
            return {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    }

    getDOMNodeCount() {
        return document.querySelectorAll('*').length;
    }

    getEventListenerCount() {
        // Estimate based on common event types
        const eventTypes = ['click', 'scroll', 'resize', 'load', 'unload'];
        let count = 0;
        
        eventTypes.forEach(type => {
            const elements = document.querySelectorAll(`[data-${type}]`);
            count += elements.length;
        });
        
        return count;
    }

    getTimerCount() {
        // Access global performance optimizer if available
        if (window.performanceOptimizer) {
            return window.performanceOptimizer.timers.size + 
                   window.performanceOptimizer.intervals.size;
        }
        return 0;
    }

    getObjectCount() {
        // Estimate object count (simplified)
        let count = 0;
        for (let key in window) {
            if (typeof window[key] === 'object' && window[key] !== null) {
                count++;
            }
        }
        return count;
    }

    analyzeMemoryUsage() {
        if (this.snapshots.length < 2) return;
        
        const current = this.snapshots[this.snapshots.length - 1];
        const previous = this.snapshots[this.snapshots.length - 2];
        
        // Check for memory leaks
        this.detectHeapGrowth(current, previous);
        this.detectDOMNodeGrowth(current, previous);
        this.detectEventListenerGrowth(current, previous);
        this.detectTimerGrowth(current, previous);
        this.detectObjectGrowth(current, previous);
    }

    detectHeapGrowth(current, previous) {
        if (!current.memory || !previous.memory) return;
        
        const growth = current.memory.used - previous.memory.used;
        if (growth > this.thresholds.heapGrowth) {
            this.reportLeak('heap-growth', {
                growth: growth,
                current: current.memory.used,
                previous: previous.memory.used,
                timestamp: current.timestamp
            });
        }
    }

    detectDOMNodeGrowth(current, previous) {
        const growth = current.domNodes - previous.domNodes;
        if (growth > this.thresholds.nodeCount) {
            this.reportLeak('dom-node-growth', {
                growth: growth,
                current: current.domNodes,
                previous: previous.domNodes,
                timestamp: current.timestamp
            });
        }
    }

    detectEventListenerGrowth(current, previous) {
        const growth = current.eventListeners - previous.eventListeners;
        if (growth > this.thresholds.listenerCount) {
            this.reportLeak('event-listener-growth', {
                growth: growth,
                current: current.eventListeners,
                previous: previous.eventListeners,
                timestamp: current.timestamp
            });
        }
    }

    detectTimerGrowth(current, previous) {
        const growth = current.timers - previous.timers;
        if (growth > 10) { // More than 10 new timers
            this.reportLeak('timer-growth', {
                growth: growth,
                current: current.timers,
                previous: previous.timers,
                timestamp: current.timestamp
            });
        }
    }

    detectObjectGrowth(current, previous) {
        const growth = current.objects - previous.objects;
        if (growth > this.thresholds.objectCount) {
            this.reportLeak('object-growth', {
                growth: growth,
                current: current.objects,
                previous: previous.objects,
                timestamp: current.timestamp
            });
        }
    }

    reportLeak(type, data) {
        const leakId = `${type}-${data.timestamp}`;
        
        if (this.detectedLeaks.has(leakId)) return;
        
        this.detectedLeaks.add(leakId);
        
        console.warn(`🚨 Memory leak detected: ${type}`, data);
        
        // Attempt automatic remediation
        this.attemptRemediation(type, data);
        
        // Report to analytics if available
        this.reportToAnalytics(type, data);
    }

    attemptRemediation(type, data) {
        switch (type) {
            case 'heap-growth':
                this.performHeapCleanup();
                break;
            case 'dom-node-growth':
                this.performDOMCleanup();
                break;
            case 'event-listener-growth':
                this.performEventListenerCleanup();
                break;
            case 'timer-growth':
                this.performTimerCleanup();
                break;
            case 'object-growth':
                this.performObjectCleanup();
                break;
        }
    }

    performHeapCleanup() {
        console.log('🧹 Performing heap cleanup...');
        
        // Clear caches
        if (window.caches) {
            caches.keys().then(names => {
                names.forEach(name => caches.delete(name));
            });
        }
        
        // Clear unused variables
        this.clearUnusedVariables();
        
        // Force garbage collection
        if (window.gc) {
            window.gc();
        }
    }

    performDOMCleanup() {
        console.log('🧹 Performing DOM cleanup...');
        
        // Remove orphaned elements
        const orphanedElements = document.querySelectorAll('[data-orphaned]');
        orphanedElements.forEach(element => {
            element.remove();
        });
        
        // Clean up detached nodes
        this.cleanupDetachedNodes();
        
        // Clear DOM caches
        if (window.optimizedElements) {
            window.optimizedElements = null;
        }
    }

    performEventListenerCleanup() {
        console.log('🧹 Performing event listener cleanup...');
        
        // Use performance optimizer to clean up listeners
        if (window.performanceOptimizer) {
            const optimizer = window.performanceOptimizer;
            const listenersToRemove = [];
            
            optimizer.listeners.forEach((listener, id) => {
                // Check if element still exists in DOM
                if (!document.contains(listener.element)) {
                    listenersToRemove.push(id);
                }
            });
            
            listenersToRemove.forEach(id => {
                optimizer.removeListener(id);
            });
        }
    }

    performTimerCleanup() {
        console.log('🧹 Performing timer cleanup...');
        
        if (window.performanceOptimizer) {
            const optimizer = window.performanceOptimizer;
            optimizer.clearNonEssentialTimers();
        }
    }

    performObjectCleanup() {
        console.log('🧹 Performing object cleanup...');
        
        // Clear global object references
        const globalObjectsToClean = [
            'tempData',
            'cachedResults',
            'processedData',
            'temporaryStorage'
        ];
        
        globalObjectsToClean.forEach(objName => {
            if (window[objName]) {
                window[objName] = null;
            }
        });
        
        // Clear function caches
        this.clearFunctionCaches();
    }

    clearUnusedVariables() {
        // Clear specific known variables that can accumulate
        const variablesToClear = [
            'tributeHistory',
            'taskCache',
            'userActivityLog',
            'temporaryResults'
        ];
        
        variablesToClear.forEach(varName => {
            if (window[varName]) {
                if (Array.isArray(window[varName])) {
                    window[varName].length = 0;
                } else {
                    window[varName] = null;
                }
            }
        });
    }

    cleanupDetachedNodes() {
        // Use TreeWalker to find detached nodes
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_ELEMENT,
            {
                acceptNode: function(node) {
                    return !node.isConnected ? 
                        NodeFilter.FILTER_ACCEPT : 
                        NodeFilter.FILTER_SKIP;
                }
            }
        );
        
        const detachedNodes = [];
        let node;
        
        while (node = walker.nextNode()) {
            detachedNodes.push(node);
        }
        
        detachedNodes.forEach(node => {
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
        });
    }

    clearFunctionCaches() {
        // Clear memoization caches
        if (window.memoCache) {
            window.memoCache.clear();
        }
        
        // Clear any function-specific caches
        const functionsWithCaches = [
            'calculateTributeAmount',
            'processTaskData',
            'formatUserData',
            'validateInput'
        ];
        
        functionsWithCaches.forEach(funcName => {
            if (window[funcName] && window[funcName].cache) {
                window[funcName].cache.clear();
            }
        });
    }

    reportToAnalytics(type, data) {
        // Send leak report to analytics service
        if (window.analytics && window.analytics.track) {
            window.analytics.track('memory_leak_detected', {
                type: type,
                growth: data.growth,
                current: data.current,
                previous: data.previous,
                timestamp: data.timestamp,
                userAgent: navigator.userAgent,
                url: window.location.href
            });
        }
    }

    setupLeakDetection() {
        // Set up additional leak detection mechanisms
        this.setupMutationObserver();
        this.setupTimerLeakDetection();
        this.setupEventListenerLeakDetection();
    }

    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            let nodeCount = 0;
            mutations.forEach((mutation) => {
                nodeCount += mutation.addedNodes.length;
            });
            
            if (nodeCount > 100) {
                console.warn('🚨 Large DOM mutation detected:', nodeCount, 'nodes added');
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    setupTimerLeakDetection() {
        const originalSetTimeout = window.setTimeout;
        const originalSetInterval = window.setInterval;
        const originalClearTimeout = window.clearTimeout;
        const originalClearInterval = window.clearInterval;
        
        let timerCount = 0;
        
        window.setTimeout = function(...args) {
            timerCount++;
            return originalSetTimeout.apply(this, args);
        };
        
        window.setInterval = function(...args) {
            timerCount++;
            return originalSetInterval.apply(this, args);
        };
        
        window.clearTimeout = function(...args) {
            timerCount = Math.max(0, timerCount - 1);
            return originalClearTimeout.apply(this, args);
        };
        
        window.clearInterval = function(...args) {
            timerCount = Math.max(0, timerCount - 1);
            return originalClearInterval.apply(this, args);
        };
        
        // Monitor timer count
        setInterval(() => {
            if (timerCount > 50) {
                console.warn('🚨 High timer count detected:', timerCount);
            }
        }, 30000);
    }

    setupEventListenerLeakDetection() {
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
        
        let listenerCount = 0;
        
        EventTarget.prototype.addEventListener = function(...args) {
            listenerCount++;
            return originalAddEventListener.apply(this, args);
        };
        
        EventTarget.prototype.removeEventListener = function(...args) {
            listenerCount = Math.max(0, listenerCount - 1);
            return originalRemoveEventListener.apply(this, args);
        };
        
        // Monitor listener count
        setInterval(() => {
            if (listenerCount > 200) {
                console.warn('🚨 High event listener count detected:', listenerCount);
            }
        }, 30000);
    }

    getLeakReport() {
        return {
            snapshots: this.snapshots,
            detectedLeaks: Array.from(this.detectedLeaks),
            currentStats: this.getCurrentStats(),
            recommendations: this.getRecommendations()
        };
    }

    getCurrentStats() {
        const latest = this.snapshots[this.snapshots.length - 1];
        return latest || null;
    }

    getRecommendations() {
        const recommendations = [];
        
        if (this.detectedLeaks.size > 0) {
            recommendations.push('Multiple memory leaks detected. Consider implementing more aggressive cleanup.');
        }
        
        const latest = this.getCurrentStats();
        if (latest) {
            if (latest.memory && latest.memory.used > 50 * 1024 * 1024) {
                recommendations.push('High memory usage detected. Consider reducing cache sizes.');
            }
            
            if (latest.domNodes > 1000) {
                recommendations.push('High DOM node count. Consider virtual scrolling or pagination.');
            }
            
            if (latest.timers > 20) {
                recommendations.push('High timer count. Consider consolidating timer operations.');
            }
        }
        
        return recommendations;
    }

    destroy() {
        console.log('🛑 Destroying Memory Leak Detector...');
        
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }
        
        this.snapshots = [];
        this.detectedLeaks.clear();
        this.isMonitoring = false;
        
        console.log('✅ Memory Leak Detector destroyed');
    }
}

// Initialize global memory leak detector
window.memoryLeakDetector = new MemoryLeakDetector();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MemoryLeakDetector;
}
