// DOM elements
const tabCountElement = document.getElementById('tabCount');
const messageElement = document.getElementById('message');
const sassLevelSelect = document.getElementById('sassLevel');
const mildThresholdInput = document.getElementById('mildThreshold');
const mediumThresholdInput = document.getElementById('mediumThreshold');
const severeThresholdInput = document.getElementById('severeThreshold');
const criticalThresholdInput = document.getElementById('criticalThreshold');
const saveSettingsButton = document.getElementById('saveSettings');

// Messages based on tab count severity and sass level
const messages = {
  mild: {
    mild: [
      "Maybe consider closing a tab or two?",
      "Just a friendly reminder about your tabs.",
      "Your tabs are starting to accumulate."
    ],
    medium: [
      "Really? Another tab?",
      "Sure, open another tab. It's not like your RAM has feelings.",
      "Oh look, another tab joined the party."
    ],
    spicy: [
      "Your computer quietly sighs at your tab choices.",
      "Marie Kondo would NOT approve of your tabs.",
      "Do you actually need all these tabs? Just asking for a friend."
    ],
    brutal: [
      "Control yourself. It's just a website.",
      "Let's be honest, you're not going back to half these tabs.",
      "Tab hoarding is still hoarding."
    ]
  },
  medium: {
    mild: [
      "That's quite a collection of tabs you have there.",
      "Your tabs are becoming a bit numerous.",
      "Have you considered bookmarks?"
    ],
    medium: [
      "Your computer is judging you right now.",
      "Tab city, population: too many.",
      "I bet you don't even remember what's in those middle tabs."
    ],
    spicy: [
      "Your browser tabs are like rabbits, multiplying uncontrollably.",
      "Congratulations on your tab collection. Very impressive. *eye roll*",
      "Do you feel accomplished with all these tabs? Just curious."
    ],
    brutal: [
      "This isn't 'research'. This is procrastination in disguise.",
      "You have a problem. The first step is admitting it.",
      "Close. Some. Tabs. Please. I'm begging you."
    ]
  },
  severe: {
    mild: [
      "Your tab count is getting rather high.",
      "Perhaps it's time to organize your tabs?",
      "That's a substantial number of tabs open."
    ],
    medium: [
      "Your poor, poor CPU...",
      "I'm not saying you have a problem, but you have a problem.",
      "Tab Anonymous meetings are Tuesdays at 8pm."
    ],
    spicy: [
      "Each new tab is a cry for help at this point.",
      "Your RAM is writing its will right now.",
      "I'd ask if you're ok, but your tab count already answered."
    ],
    brutal: [
      "This is digital hoarding and you need an intervention.",
      "What exactly are you trying to prove with all these tabs?",
      "Close a tab. Any tab. I don't even care which one anymore."
    ]
  },
  critical: {
    mild: [
      "You have reached a concerning number of tabs.",
      "Your browser might be struggling a bit now.",
      "Perhaps consider addressing your tab situation?"
    ],
    medium: [
      "This is an intervention. CLOSE SOME TABS.",
      "Your RAM called. It quit.",
      "Achievement unlocked: Chrome crash imminent!"
    ],
    spicy: [
      "Your computer is plotting revenge for this tab abuse.",
      "Is this some kind of personal vendetta against your machine?",
      "Congratulations! You've reached tab absurdity level."
    ],
    brutal: [
      "This isn't 'multitasking'. This is chaos.",
      "You need professional help with your tab addiction.",
      "At this point, just restart your computer. It's mercy."
    ]
  }
};

// Get random message based on tab count and sass level
function getRandomMessage(count, sassLevel) {
  // Default to medium sass if not specified
  sassLevel = sassLevel || 'medium';
  
  let severity;
  
  // Get current thresholds
  chrome.storage.local.get(['thresholds'], (data) => {
    const thresholds = data.thresholds || {
      mild: 5,
      medium: 10,
      severe: 20,
      critical: 30
    };
    
    if (count >= thresholds.critical) {
      severity = 'critical';
    } else if (count >= thresholds.severe) {
      severity = 'severe';
    } else if (count >= thresholds.medium) {
      severity = 'medium';
    } else if (count >= thresholds.mild) {
      severity = 'mild';
    } else {
      messageElement.textContent = "You're doing great! (For now...)";
      return;
    }
    
    const messageArray = messages[severity][sassLevel];
    const randomIndex = Math.floor(Math.random() * messageArray.length);
    messageElement.textContent = messageArray[randomIndex];
  });
}

// Load current settings
function loadSettings() {
  chrome.storage.local.get(['sassLevel', 'thresholds'], (data) => {
    const sassLevel = data.sassLevel || 'medium';
    const thresholds = data.thresholds || {
      mild: 5,
      medium: 10,
      severe: 20,
      critical: 30
    };
    
    // Update UI with saved settings
    sassLevelSelect.value = sassLevel;
    mildThresholdInput.value = thresholds.mild;
    mediumThresholdInput.value = thresholds.medium;
    severeThresholdInput.value = thresholds.severe;
    criticalThresholdInput.value = thresholds.critical;
  });
}

// Save settings
function saveSettings() {
  const sassLevel = sassLevelSelect.value;
  const thresholds = {
    mild: parseInt(mildThresholdInput.value, 10),
    medium: parseInt(mediumThresholdInput.value, 10),
    severe: parseInt(severeThresholdInput.value, 10),
    critical: parseInt(criticalThresholdInput.value, 10)
  };
  
  // Validate thresholds (ascending order)
  if (thresholds.mild < 1 || 
      thresholds.medium <= thresholds.mild || 
      thresholds.severe <= thresholds.medium || 
      thresholds.critical <= thresholds.severe) {
    alert("Thresholds must be in ascending order and at least 1!");
    return;
  }
  
  chrome.storage.local.set({ 
    sassLevel: sassLevel,
    thresholds: thresholds
  }, () => {
    // Show saved confirmation
    saveSettingsButton.textContent = "Saved!";
    setTimeout(() => {
      saveSettingsButton.textContent = "Save Settings";
    }, 1500);
    
    // Refresh message with new settings
    chrome.storage.local.get(['tabCount'], (data) => {
      getRandomMessage(data.tabCount, sassLevel);
    });
  });
}

// Update UI with tab count and message
function updateUI() {
  chrome.storage.local.get(['tabCount', 'sassLevel'], (data) => {
    const count = data.tabCount || 0;
    const sassLevel = data.sassLevel || 'medium';
    
    tabCountElement.textContent = count;
    getRandomMessage(count, sassLevel);
    
    // Update tab count text color based on severity
    chrome.storage.local.get(['thresholds'], (data) => {
      const thresholds = data.thresholds || {
        mild: 5,
        medium: 10,
        severe: 20,
        critical: 30
      };
      
      if (count >= thresholds.critical) {
        tabCountElement.style.color = '#F44336'; // Red
      } else if (count >= thresholds.severe) {
        tabCountElement.style.color = '#FF9800'; // Orange
      } else if (count >= thresholds.medium) {
        tabCountElement.style.color = '#FFEB3B'; // Yellow
      } else if (count >= thresholds.mild) {
        tabCountElement.style.color = '#4CAF50'; // Green
      } else {
        tabCountElement.style.color = '#4285f4'; // Blue
      }
    });
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  updateUI();
  
  // Set up event listeners
  saveSettingsButton.addEventListener('click', saveSettings);
});