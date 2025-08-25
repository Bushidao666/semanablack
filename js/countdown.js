document.addEventListener('DOMContentLoaded', function() {
    const ZOOM_LINK = 'https://us06web.zoom.us/j/82637560760';
    const TARGET_HOUR = 20; // 20:00 (8 PM)
    const TARGET_MINUTE = 0;
    
    const ctaButton = document.querySelector('.cta-button');
    const ctaTitle = document.querySelector('.cta-title');
    const ctaSubtitle = document.querySelector('.cta-subtitle');
    
    let countdownInterval;
    
    function updateCountdown() {
        const now = new Date();
        const today = new Date();
        
        // Set target time for today at 20:00
        today.setHours(TARGET_HOUR, TARGET_MINUTE, 0, 0);
        
        // If it's past 20:00 today, set target for tomorrow
        if (now > today) {
            today.setDate(today.getDate() + 1);
        }
        
        const timeDiff = today - now;
        
        // Calculate time components
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        // Check if it's time to enable the button (between 20:00 and 20:59)
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        if (currentHour === TARGET_HOUR || (currentHour === TARGET_HOUR && currentMinute < 60)) {
            // Live is NOW - Enable button
            enableLiveButton();
        } else if (timeDiff > 0) {
            // Show countdown
            updateCountdownDisplay(hours, minutes, seconds);
        }
    }
    
    function updateCountdownDisplay(hours, minutes, seconds) {
        // Format time with leading zeros
        const formatTime = (num) => num.toString().padStart(2, '0');
        
        // Update button text with countdown
        ctaButton.innerHTML = `
            <span class="cta-button__text">LIBERAÇÃO EM: ${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}</span>
            <span class="cta-button__arrow">⏱</span>
        `;
        
        // Update title with countdown
        ctaTitle.innerHTML = `LIVE HOJE ÀS 20:00 • FALTAM ${hours}H ${minutes}MIN`;
        
        // Keep button disabled with red style
        ctaButton.disabled = true;
        ctaButton.style.opacity = '0.8';
        ctaButton.style.cursor = 'not-allowed';
        ctaButton.classList.remove('cta-button--live');
        
        // Update subtitle
        ctaSubtitle.textContent = 'Link será liberado automaticamente às 20:00';
    }
    
    function enableLiveButton() {
        // Clear interval
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        
        // Update button to active state
        ctaButton.innerHTML = `
            <span class="cta-button__text">ENTRAR NA LIVE AGORA</span>
            <span class="cta-button__arrow">→</span>
        `;
        
        // Update title
        ctaTitle.innerHTML = '🔴 LIVE ACONTECENDO AGORA!';
        ctaTitle.style.animation = 'pulse-text 1s infinite';
        
        // Update subtitle
        ctaSubtitle.innerHTML = '<strong>Clique no botão abaixo para acessar a live</strong>';
        
        // Enable button
        ctaButton.disabled = false;
        ctaButton.style.opacity = '1';
        ctaButton.style.cursor = 'pointer';
        
        // Add click event to open Zoom link
        ctaButton.onclick = function() {
            window.open(ZOOM_LINK, '_blank');
        };
        
        // Add pulsing effect to button
        ctaButton.classList.add('cta-button--live');
    }
    
    // Check if we should start in live mode
    function checkInitialState() {
        const now = new Date();
        const currentHour = now.getHours();
        
        // If it's between 20:00 and 20:59, start in live mode
        if (currentHour === TARGET_HOUR) {
            enableLiveButton();
        } else {
            // Start countdown
            updateCountdown();
            countdownInterval = setInterval(updateCountdown, 1000);
        }
    }
    
    // Initialize
    checkInitialState();
    
    // Add visual countdown in the header
    function addHeaderCountdown() {
        const datesBadge = document.querySelector('.date-badge');
        if (datesBadge) {
            const countdownElement = document.createElement('div');
            countdownElement.className = 'header-countdown';
            countdownElement.style.cssText = `
                margin-top: 10px;
                font-family: var(--font-mono);
                font-size: 14px;
                color: var(--color-primary);
                text-transform: uppercase;
                letter-spacing: 0.1em;
            `;
            datesBadge.parentElement.appendChild(countdownElement);
            
            setInterval(() => {
                const now = new Date();
                const today = new Date();
                today.setHours(TARGET_HOUR, TARGET_MINUTE, 0, 0);
                
                if (now > today) {
                    today.setDate(today.getDate() + 1);
                }
                
                const timeDiff = today - now;
                const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
                
                if (now.getHours() === TARGET_HOUR) {
                    countdownElement.innerHTML = '🔴 AO VIVO AGORA';
                    countdownElement.style.color = 'var(--color-danger)';
                } else if (timeDiff > 0) {
                    const formatTime = (num) => num.toString().padStart(2, '0');
                    countdownElement.innerHTML = `⏱ ${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
                }
            }, 1000);
        }
    }
    
    addHeaderCountdown();
});