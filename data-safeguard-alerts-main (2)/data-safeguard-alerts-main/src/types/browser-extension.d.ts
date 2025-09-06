
/**
 * Type definitions for browser extension APIs
 */

interface StorageArea {
  get(keys: string | string[] | null): Promise<Record<string, any>>;
  set(items: Record<string, any>): Promise<void>;
  remove(keys: string | string[]): Promise<void>;
  clear(): Promise<void>;
}

interface BrowserStorage {
  local: StorageArea;
  sync: StorageArea;
  managed: StorageArea;
  session?: StorageArea;
}

interface RuntimeMessage {
  action: string;
  [key: string]: any;
}

interface RuntimeListener {
  addListener(callback: (message: any, sender: any, sendResponse: any) => void): void;
  removeListener(callback: (message: any, sender: any, sendResponse: any) => void): void;
}

interface RuntimeAPI {
  onMessage: RuntimeListener;
  sendMessage(message: RuntimeMessage): void;
  lastError?: Error;
}

interface Browser {
  storage: BrowserStorage;
  runtime: RuntimeAPI;
}

declare var browser: Browser;
declare var chrome: {
  storage: BrowserStorage;
  runtime: RuntimeAPI;
  downloads?: {
    pause(downloadId: number, callback?: () => void): void;
    resume(downloadId: number, callback?: () => void): void;
    cancel(downloadId: number, callback?: () => void): void;
    onCreated: RuntimeListener;
  };
};

interface FileSystemHandlePermissionDescriptor {
  mode?: "read" | "readwrite";
}

interface FileSystemHandle {
  kind: "file" | "directory";
  name: string;
  queryPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<"granted" | "denied" | "prompt">;
  requestPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<"granted" | "denied">;
}

interface FileSystemFileHandle extends FileSystemHandle {
  kind: "file";
  getFile(): Promise<File>;
}

interface FileSystemDirectoryHandle extends FileSystemHandle {
  kind: "directory";
  values(): AsyncIterable<FileSystemHandle>;
  entries(): AsyncIterable<[string, FileSystemHandle]>;
  keys(): AsyncIterable<string>;
  getDirectoryHandle(name: string, options?: { create?: boolean }): Promise<FileSystemDirectoryHandle>;
  getFileHandle(name: string, options?: { create?: boolean }): Promise<FileSystemFileHandle>;
  removeEntry(name: string, options?: { recursive?: boolean }): Promise<void>;
}

interface FileSystemDirectoryHandleIterable {
  [Symbol.asyncIterator](): AsyncIterator<FileSystemHandle>;
}

interface Window {
  showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
  showOpenFilePicker(): Promise<FileSystemFileHandle[]>;
  showSaveFilePicker(): Promise<FileSystemFileHandle>;
}
