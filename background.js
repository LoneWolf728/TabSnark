// Initialize tab count tracking
let tabCount = 0;

// Messages based on tab count severity
const messages = {
  mild: [
    "Really? Another tab?",
    "Sure, open another tab. It's not like your RAM has feelings.",
    "Oh look, another tab joined the party."
  ],
  medium: [
    "Your computer is judging you right now.",
    "Marie Kondo would NOT approve of your tabs.",
    "Do you actually need all these tabs? Just asking for a friend."
  ],
  severe: [
    "Your poor, poor CPU...",
    "I'm not saying you have a problem, but you have a problem.",
    "Tab Anonymous meetings are Tuesdays at 8pm."
  ],
  critical: [
    "This is an intervention. CLOSE SOME TABS.",
    "Your RAM called. It quit.",
    "Achievement unlocked: Chrome crash imminent!"
  ]
};

// Thresholds for different message severity levels
const thresholds = {
  mild: 5,     // 5-9 tabs
  medium: 10,  // 10-19 tabs
  severe: 20,  // 20-29 tabs
  critical: 30 // 30+ tabs
};

// Function to update icon based on tab count
function updateIcon(count) {
  let iconPath;
  
  if (count >= thresholds.critical) {
    iconPath = {
      "16": "icons/icon16-critical.png",
      "48": "icons/icon48-critical.png",
      "128": "icons/icon128-critical.png"
    };
  } else if (count >= thresholds.severe) {
    iconPath = {
      "16": "icons/icon16-severe.png",
      "48": "icons/icon48-severe.png",
      "128": "icons/icon128-severe.png"
    };
  } else if (count >= thresholds.medium) {
    iconPath = {
      "16": "icons/icon16-medium.png",
      "48": "icons/icon48-medium.png",
      "128": "icons/icon128-medium.png"
    };
  } else if (count >= thresholds.mild) {
    iconPath = {
      "16": "icons/icon16-mild.png",
      "48": "icons/icon48-mild.png",
      "128": "icons/icon128-mild.png"
    };
  } else {
    iconPath = {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    };
  }
  
  chrome.action.setIcon({ path: iconPath });
}

// Get random message based on tab count
function getRandomMessage(count) {
  let severity;
  
  if (count >= thresholds.critical) {
    severity = 'critical';
  } else if (count >= thresholds.severe) {
    severity = 'severe';
  } else if (count >= thresholds.medium) {
    severity = 'medium';
  } else if (count >= thresholds.mild) {
    severity = 'mild';
  } else {
    return null; // Not enough tabs to trigger a message
  }
  
  const messageArray = messages[severity];
  const randomIndex = Math.floor(Math.random() * messageArray.length);
  return messageArray[randomIndex];
}

// Function to update badge with current tab count
function updateBadge(count) {
  // Don't show badge text
  chrome.action.setBadgeText({ text: "" });
  
  // Change badge color based on severity
  let color = "#4CAF50"; // Default green
  
  if (count >= thresholds.critical) {
    color = "#F44336"; // Red
  } else if (count >= thresholds.severe) {
    color = "#FF9800"; // Orange
  } else if (count >= thresholds.medium) {
    color = "#FFEB3B"; // Yellow
  }
  
  chrome.action.setBadgeBackgroundColor({ color: color });
}

// Function to check tabs and potentially send notification
function checkTabs() {
  chrome.tabs.query({}, (tabs) => {
    tabCount = tabs.length;
    updateBadge(tabCount);
    updateIcon(tabCount); // Add this line to update the icon
    
    // Store the tab count for popup display
    chrome.storage.local.set({ tabCount: tabCount });
    
    // Check if we need to show a notification (when crossing thresholds)
    chrome.storage.local.get(['lastTabCount', 'lastNotificationTime'], (data) => {
      const lastCount = data.lastTabCount || 0;
      const lastNotificationTime = data.lastNotificationTime || 0;
      const currentTime = Date.now();
      
      // Only notify if we've crossed a threshold and it's been at least 5 minutes
      const crossedThreshold = 
        (lastCount < thresholds.mild && tabCount >= thresholds.mild) ||
        (lastCount < thresholds.medium && tabCount >= thresholds.medium) ||
        (lastCount < thresholds.severe && tabCount >= thresholds.severe) ||
        (lastCount < thresholds.critical && tabCount >= thresholds.critical);
      
      if (crossedThreshold && (currentTime - lastNotificationTime > 5 * 60 * 1000)) {
        const message = getRandomMessage(tabCount);
        if (message) {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: 'Tab Intervention',
            message: message
          });
          
          // Update last notification time
          chrome.storage.local.set({ lastNotificationTime: currentTime });
        }
      }
      
      // Update last tab count
      chrome.storage.local.set({ lastTabCount: tabCount });
    });
  });
}

// Listen for tab events
chrome.tabs.onCreated.addListener(checkTabs);
chrome.tabs.onRemoved.addListener(checkTabs);

// Initial check when extension loads
checkTabs();

// Periodically check tabs (every minute)
setInterval(checkTabs, 60 * 1000);