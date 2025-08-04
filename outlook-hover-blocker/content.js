// Outlook Hover Disabler Content Script - Lightweight Version

(function() {
    'use strict';
    
    // Much simpler CSS-only approach to avoid browser freezing
    const disableHoverCSS = `
        /* Hide all hover cards and tooltips */
        div[role="tooltip"],
        div[class*="hover-card"],
        div[class*="HoverCard"], 
        div[class*="persona-card"],
        div[class*="PersonaCard"],
        div[class*="ms-Callout"],
        div[class*="ms-HoverCard"],
        div[class*="personaHoverCard"],
        ._3T2dX6RUsRTgHx6pCdYp1I,
        [data-testid*="hover-card"],
        [aria-label*="Contact card"],
        .ms-Layer[role="dialog"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
            position: absolute !important;
            left: -9999px !important;
            top: -9999px !important;
            z-index: -1 !important;
        }
        
        /* Prevent hover states from showing */
        button[data-testid*="persona"]:hover,
        button[class*="persona"]:hover,
        .ms-Persona:hover,
        [class*="recipientWell"] button:hover {
            background: inherit !important;
            box-shadow: none !important;
            transform: none !important;
        }
        
        /* Disable pointer events only on specific hover trigger elements */
        button[data-testid*="persona"] .ms-Persona-imageArea,
        button[class*="persona"] img,
        .ms-Persona .ms-Persona-imageArea {
            pointer-events: none !important;
        }
    `;
    
    // Simple function to add CSS
    function addDisableHoverStyles() {
        // Remove existing style if it exists
        const existingStyle = document.getElementById('outlook-hover-disabler-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        const style = document.createElement('style');
        style.textContent = disableHoverCSS;
        style.id = 'outlook-hover-disabler-styles';
        document.head.appendChild(style);
    }
    
    // Lightweight approach to remove title attributes
    function removeTooltips() {
        const selectors = [
            'button[data-testid*="persona"]',
            'button[class*="persona"]', 
            '.ms-Persona',
            '[class*="recipientWell"] button'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.removeAttribute('title');
                // Mark as processed to avoid reprocessing
                element.setAttribute('data-hover-processed', 'true');
            });
        });
    }
    
    // Very lightweight observer that only processes new elements
    function setupLightweightObserver() {
        const observer = new MutationObserver(function(mutations) {
            let hasNewElements = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    hasNewElements = true;
                }
            });
            
            // Only process if there are actually new elements
            if (hasNewElements) {
                // Small delay to let elements settle
                setTimeout(removeTooltips, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        return observer;
    }
    
    // Initialize with minimal impact
    function init() {
        console.log('Outlook Hover Disabler (lightweight) initializing...');
        
        // Add CSS styles - this is the main method of disabling hovers
        addDisableHoverStyles();
        
        // Remove title attributes from existing elements
        removeTooltips();
        
        // Set up lightweight observer for new elements
        setupLightweightObserver();
        
        console.log('Outlook Hover Disabler initialized successfully');
    }
    
    // Wait for page to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();