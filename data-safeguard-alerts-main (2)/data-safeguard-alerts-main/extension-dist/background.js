
// Background script for Checksum Calculator extension
console.log('Background script loaded');

// Keep track of processed downloads
const processedDownloads = new Set();

// API endpoint for PostgreSQL storage
const API_URL = 'http://localhost:3000/api';

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  
  chrome.storage.local.set({ 
    settings: { 
      useChecksum: true,
      enableDuplicateDetection: true,
      usePostgres: true
    } 
  });

  // Initialize notifications permission
  if (chrome.notifications) {
    console.log('Notifications API available');
  } else {
    console.error('Notifications API not available');
  }
});

// Calculate checksum for a file
async function calculateChecksum(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async function(e) {
      try {
        const arrayBuffer = e.target.result;
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        resolve(hashHex);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = function(error) {
      reject(error);
    };
    reader.readAsArrayBuffer(blob);
  });
}

// Save checksum to PostgreSQL
async function saveChecksum(record) {
  try {
    const response = await fetch(`${API_URL}/checksums`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(record),
      mode: 'cors',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    console.log('Checksum saved to PostgreSQL:', record);
    return true;
  } catch (error) {
    console.error('Error saving checksum to PostgreSQL:', error);
    return false;
  }
}

// Get file checksums from PostgreSQL
async function getChecksums() {
  try {
    const response = await fetch(`${API_URL}/checksums`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch checksums from PostgreSQL database');
    }
    const data = await response.json();
    console.log('Checksums fetched from PostgreSQL:', data);
    return data;
  } catch (error) {
    console.error('Error fetching checksums from PostgreSQL:', error);
    return [];
  }
}

// Process download and create checksum
async function processDownload(downloadItem) {
  try {
    const response = await fetch(downloadItem.url);
    if (!response.ok) {
      throw new Error('Failed to fetch file from URL');
    }
    
    const blob = await response.blob();
    const checksum = await calculateChecksum(blob);
    
    // Save to PostgreSQL
    const record = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      fileName: downloadItem.filename.split('/').pop(),
      checksum: checksum,
      timestamp: Date.now(),
      path: downloadItem.filename
    };
    
    await saveChecksum(record);
    
    // Check if it's a duplicate
    const checksums = await getChecksums();
    const duplicates = checksums.filter(item => 
      item.checksum === checksum && item.id !== record.id
    );
    
    if (duplicates.length > 0) {
      console.log('Duplicate file detected:', duplicates);
      
      // Pause the download
      chrome.downloads.pause(downloadItem.id, () => {
        if (chrome.runtime.lastError) {
          console.error('Error pausing download:', chrome.runtime.lastError);
        } else {
          console.log('Download paused successfully:', downloadItem.id);
        }
      });
      
      // Show Chrome notification
      showDuplicateAlert(downloadItem, record, checksum);
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error processing download:', error);
    return false;
  }
}

// Show duplicate alert
function showDuplicateAlert(downloadItem, record, checksum) {
  // Show Chrome notification
  if (chrome.notifications) {
    chrome.notifications.create(`duplicate-${downloadItem.id}`, {
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Duplicate File Detected',
      message: `The file "${record.fileName}" already exists. Do you want to continue downloading?`,
      buttons: [
        { title: 'Continue Download' },
        { title: 'Cancel Download' }
      ],
      requireInteraction: true
    }, (notificationId) => {
      if (chrome.runtime.lastError) {
        console.error('Error creating notification:', chrome.runtime.lastError);
      } else {
        console.log('Notification created:', notificationId);
      }
    });
  } else {
    console.error('Chrome notifications API not available');
    // Fallback - resume download and alert via message
    chrome.downloads.resume(downloadItem.id);
  }
  
  // Send message to frontend
  chrome.runtime.sendMessage({
    action: 'duplicateDetected',
    file: {
      fileName: record.fileName,
      fileSize: downloadItem.fileSize || 'Unknown',
      downloadId: downloadItem.id,
      originalChecksum: checksum,
      filePath: record.path || '/downloads/'
    }
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error sending message to frontend:', chrome.runtime.lastError);
    } else if (response) {
      console.log('Message received by frontend:', response);
    }
  });
}

// Listen for notification button clicks
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  const downloadId = notificationId.replace('duplicate-', '');
  
  if (buttonIndex === 0) {
    // Continue download
    chrome.downloads.resume(parseInt(downloadId), () => {
      if (chrome.runtime.lastError) {
        console.error('Error resuming download:', chrome.runtime.lastError);
      } else {
        console.log('User chose to continue download:', downloadId);
      }
    });
  } else {
    // Cancel download
    chrome.downloads.cancel(parseInt(downloadId), () => {
      if (chrome.runtime.lastError) {
        console.error('Error canceling download:', chrome.runtime.lastError);
      } else {
        console.log('User chose to cancel download:', downloadId);
      }
    });
  }
  
  // Clear the notification
  chrome.notifications.clear(notificationId);
});

// Listen for messages from frontend
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in background:', message);
  
  if (message.action === 'resumeDownload') {
    const downloadId = message.downloadId;
    console.log('User approved download, resuming:', downloadId);
    
    chrome.downloads.resume(parseInt(downloadId), () => {
      if (chrome.runtime.lastError) {
        console.error('Error resuming download:', chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError });
      } else {
        console.log('Download resumed successfully');
        sendResponse({ success: true });
      }
    });
    
    return true; // Keep message channel open for async response
  }
  
  if (message.action === 'cancelDownload') {
    const downloadId = message.downloadId;
    console.log('User canceled download, removing:', downloadId);
    
    chrome.downloads.cancel(parseInt(downloadId), () => {
      if (chrome.runtime.lastError) {
        console.error('Error canceling download:', chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError });
      } else {
        console.log('Download canceled successfully');
        sendResponse({ success: true });
      }
    });
    
    return true; // Keep message channel open for async response
  }
  
  // Send response to acknowledge message receipt
  sendResponse({ received: true });
  return false;
});

// Intercept downloads and check for duplicates
chrome.downloads.onCreated.addListener(async (downloadItem) => {
  console.log('New download detected:', downloadItem);
  
  // Skip if we've already processed this download
  if (processedDownloads.has(downloadItem.id)) {
    console.log('Download already processed, skipping:', downloadItem.id);
    return;
  }
  
  // Mark as processed
  processedDownloads.add(downloadItem.id);
  
  // Check settings
  chrome.storage.local.get(['settings'], async (result) => {
    const settings = result.settings || { 
      useChecksum: true, 
      enableDuplicateDetection: true,
      usePostgres: true
    };
    
    if (!settings.enableDuplicateDetection) {
      console.log('Duplicate detection disabled, skipping check');
      return;
    }

    if (!settings.usePostgres) {
      console.log('PostgreSQL storage disabled, using local storage instead');
      return;
    }

    const fileName = downloadItem.filename || downloadItem.url.split('/').pop();
    if (!fileName) {
      console.log('Could not determine filename, skipping check');
      return;
    }
    
    // Process download in the background to calculate and store checksum
    setTimeout(() => {
      processDownload(downloadItem);
    }, 1000); // Small delay to ensure download has started
  });
});

// Monitor download state changes
chrome.downloads.onChanged.addListener((downloadDelta) => {
  if (downloadDelta.state) {
    console.log(`Download ${downloadDelta.id} state changed to ${downloadDelta.state.current}`);
    
    if (downloadDelta.state.current === 'complete') {
      console.log('Download completed:', downloadDelta.id);
    }
  }
});

// Clean up old processed downloads periodically
setInterval(() => {
  // Get all active downloads
  chrome.downloads.search({}, (downloads) => {
    const activeIds = new Set(downloads.map(d => d.id));
    
    // Remove completed downloads from our tracking set
    for (const id of processedDownloads) {
      if (!activeIds.has(id)) {
        processedDownloads.delete(id);
      }
    }
  });
}, 60000);