// This script runs in the context of web pages

chrome.storage.local.get(['tabCount', 'thresholds', 'sassLevel'], (data) => {
    const count = data.tabCount || 0;
    const thresholds = data.thresholds || {
      critical: 30
    };
    
    // Only inject banner for critical tab counts
    if (count >= thresholds.critical) {
      // Create and inject banner
      const banner = document.createElement('div');
      banner.style.position = 'fixed';
      banner.style.top = '0';
      banner.style.left = '0';
      banner.style.right = '0';
      banner.style.backgroundColor = 'rgba(244, 67, 54, 0.9)'; // Red with transparency
      banner.style.color = 'white';
      banner.style.padding = '10px';
      banner.style.textAlign = 'center';
      banner.style.fontFamily = 'Arial, sans-serif';
      banner.style.zIndex = '9999';
      banner.style.fontSize = '14px';
      banner.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
      
      banner.textContent = `You now have ${count} tabs open. Is this tab REALLY necessary?`;
      
      // Add a close button
      const closeButton = document.createElement('span');
      closeButton.textContent = '×';
      closeButton.style.position = 'absolute';
      closeButton.style.right = '10px';
      closeButton.style.top = '50%';
      closeButton.style.transform = 'translateY(-50%)';
      closeButton.style.cursor = 'pointer';
      closeButton.style.fontSize = '20px';
      closeButton.style.fontWeight = 'bold';
      
      closeButton.addEventListener('click', () => {
        document.body.removeChild(banner);
      });
      
      banner.appendChild(closeButton);
      
      // Add banner to page
      if (document.body) {
        document.body.appendChild(banner);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
          if (banner && banner.parentNode) {
            document.body.removeChild(banner);
          }
        }, 5000);
      }
    }
  });