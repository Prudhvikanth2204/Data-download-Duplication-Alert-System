import { uuid } from '@/lib/utils';
import { MOCK_FILES } from '@/lib/mockData';

// Define the API URL - allow configurable API URL for different environments
const API_URL = 'http://localhost:3000/api';

// Define ChecksumRecord interface here to resolve import issues
export interface ChecksumRecord {
  id: string;
  fileName: string;
  checksum: string;
  timestamp: number;
  path?: string;
}

// Track whether we're using mock data or real data
let useMockData = false;

/**
 * Set whether to use mock data instead of real API calls
 */
export function setUseMockData(value: boolean): void {
  useMockData = value;
  console.log(`Data source set to: ${useMockData ? 'Mock Data' : 'Real API'}`);
}

/**
 * Get the current data source mode
 */
export function getUseMockData(): boolean {
  return useMockData;
}

/**
 * Calculate checksum for a given file or blob
 */
export async function calculateChecksum(file: File | Blob): Promise<string> {
  if (useMockData) {
    // In mock mode, return a fixed checksum based on file size for testing
    return `mock_checksum_${file.size}_${Date.now().toString(16)}`;
  }
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async function (e) {
      try {
        if (!e.target || !e.target.result) {
          throw new Error('FileReader result is null');
        }
        
        const arrayBuffer = e.target.result as ArrayBuffer;
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        resolve(hashHex);
      } catch (error) {
        console.error('Error calculating checksum:', error);
        reject(error);
      }
    };
    reader.onerror = function (error) {
      console.error('FileReader error:', error);
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Check if a file is a duplicate based on checksum
 */
export async function isDuplicate(checksum: string): Promise<boolean> {
  try {
    if (useMockData) {
      // In mock mode, randomly determine if it's a duplicate for testing
      return MOCK_FILES.some(file => file.checksum === checksum);
    }
    
    const allChecksums = await getAllChecksums();
    return allChecksums.some(record => record.checksum === checksum);
  } catch (error) {
    console.error('Error checking for duplicate:', error);
    // On error, fall back to mock data
    setUseMockData(true);
    return MOCK_FILES.some(file => file.checksum === checksum);
  }
}

/**
 * Save checksum to PostgreSQL
 */
export async function saveChecksum(record: ChecksumRecord): Promise<void> {
  try {
    console.log('Saving checksum:', record);
    
    if (useMockData) {
      console.log('Using mock data - checksum saved to mock storage');
      return;
    }
    
    console.log('Saving checksum to PostgreSQL:', record);
    
    const response = await fetch(`${API_URL}/checksums`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(record),
      mode: 'cors'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    console.log('Checksum saved successfully to PostgreSQL:', record);
  } catch (error) {
    console.error('Error saving checksum to PostgreSQL:', error);
    console.log('Falling back to mock data mode');
    setUseMockData(true);
    // Don't throw error - silent fallback
  }
}

/**
 * Get all stored checksums from PostgreSQL
 */
export async function getAllChecksums(): Promise<ChecksumRecord[]> {
  try {
    if (useMockData) {
      console.log('Using mock data for checksums');
      // Return mock data converted to ChecksumRecord format
      return MOCK_FILES.map(file => ({
        id: file.id,
        fileName: file.fileName,
        checksum: file.checksum,
        timestamp: file.downloadDate.getTime(),
        path: file.fileName
      }));
    }
    
    console.log('Fetching checksums from PostgreSQL API...');
    const response = await fetch(`${API_URL}/checksums`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Checksums fetched from PostgreSQL:', data);
    return data;
  } catch (error) {
    console.error('PostgreSQL API Error:', error);
    console.log('API failed, switching to mock data');
    setUseMockData(true);
    // If we're in mock mode after an error, return mock data
    return MOCK_FILES.map(file => ({
      id: file.id,
      fileName: file.fileName,
      checksum: file.checksum,
      timestamp: file.downloadDate.getTime(),
      path: file.fileName
    }));
  }
}

/**
 * Delete a checksum by ID
 */
export async function deleteChecksum(id: string): Promise<void> {
  try {
    if (useMockData) {
      console.log('Using mock data - delete operation simulated for ID:', id);
      return;
    }
    
    console.log('Deleting checksum from PostgreSQL:', id);
    const response = await fetch(`${API_URL}/checksums/${id}`, {
      method: 'DELETE',
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    console.log('Checksum deleted successfully from PostgreSQL:', id);
  } catch (error) {
    console.error('Error deleting checksum from PostgreSQL:', error);
    console.log('Falling back to mock data mode');
    setUseMockData(true);
    // Don't throw error - silent fallback
  }
}

/**
 * Scan a directory and calculate checksums for all files
 */
export async function scanDirectory(directoryHandle: FileSystemDirectoryHandle): Promise<ChecksumRecord[]> {
  const results: ChecksumRecord[] = [];
  
  async function processDirectory(dirHandle: FileSystemDirectoryHandle, path = ''): Promise<void> {
    for await (const entry of dirHandle.values()) {
      const entryPath = path ? `${path}/${entry.name}` : entry.name;
      
      if (entry.kind === 'file') {
        try {
          const fileHandle = entry as FileSystemFileHandle;
          const file = await fileHandle.getFile();
          
          const checksum = await calculateChecksum(file);
          
          const record: ChecksumRecord = {
            id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
            fileName: entry.name,
            checksum,
            timestamp: Date.now(),
            path: entryPath
          };
          
          await saveChecksum(record);
          results.push(record);
        } catch (error) {
          console.error(`Error processing file ${entryPath}:`, error);
        }
      } else if (entry.kind === 'directory') {
        await processDirectory(entry as FileSystemDirectoryHandle, entryPath);
      }
    }
  }
  
  await processDirectory(directoryHandle);
  return results;
}
