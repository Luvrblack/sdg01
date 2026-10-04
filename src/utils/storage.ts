/**
 * Storage Utility & QuotaExceededError Defense Layer
 * Prevents localStorage/sessionStorage quota exceeded crashes and compresses image uploads.
 */

/**
 * Safely sets an item in localStorage with quota error handling & cleanup.
 */
export const safeLocalStorageSet = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error: any) {
    if (
      error instanceof DOMException &&
      (error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        error.code === 22 ||
        error.code === 1014)
    ) {
      console.warn(`[Storage Firewall] QuotaExceededError detected when setting key "${key}". Attempting space cleanup...`);
      
      // Attempt 1: Clear non-essential security logs if key is not security_logs
      if (key !== 'sdg_security_logs') {
        try {
          localStorage.removeItem('sdg_security_logs');
          localStorage.setItem(key, value);
          console.info(`[Storage Firewall] Cleared logs and successfully saved key "${key}".`);
          return true;
        } catch {
          // Continue to attempt 2
        }
      }

      // Attempt 2: Clear cart items if not cart
      if (key !== 'sdg_cart') {
        try {
          localStorage.removeItem('sdg_cart');
          localStorage.setItem(key, value);
          console.info(`[Storage Firewall] Cleared cart storage and saved key "${key}".`);
          return true;
        } catch {
          // Continue
        }
      }

      console.error(`[Storage Firewall] Could not save key "${key}" due to storage quota limits. Operating in memory-only mode.`);
      return false;
    }
    console.error(`[Storage Firewall] Unexpected storage error for key "${key}":`, error);
    return false;
  }
};

/**
 * Safely gets an item from localStorage.
 */
export const safeLocalStorageGet = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn(`[Storage Firewall] Failed to read key "${key}" from localStorage:`, error);
    return null;
  }
};

/**
 * Safely removes an item from localStorage.
 */
export const safeLocalStorageRemove = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[Storage Firewall] Failed to remove key "${key}" from localStorage:`, error);
  }
};

/**
 * Safely sets an item in sessionStorage.
 */
export const safeSessionStorageSet = (key: string, value: string): boolean => {
  try {
    sessionStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`[Storage Firewall] Failed to set key "${key}" in sessionStorage:`, error);
    return false;
  }
};

/**
 * Safely gets an item from sessionStorage.
 */
export const safeSessionStorageGet = (key: string): string | null => {
  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    console.warn(`[Storage Firewall] Failed to read key "${key}" from sessionStorage:`, error);
    return null;
  }
};

/**
 * Safely removes an item from sessionStorage.
 */
export const safeSessionStorageRemove = (key: string): void => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.warn(`[Storage Firewall] Failed to remove key "${key}" from sessionStorage:`, error);
  }
};

/**
 * Compresses an image file (e.g. uploaded photo) into a lightweight base64 Data URL.
 * Keeps image dimensions under maxDim (default 800px) and quality at 0.75.
 * Reduces 5MB-10MB camera photos to ~30KB-80KB, completely avoiding QuotaExceededError!
 */
export const compressImageFile = (
  file: File,
  maxDim = 800,
  quality = 0.75
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // If file is small (< 100KB), read directly as data URL
    if (file.size < 100 * 1024) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Scale down proportionally
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback
        resolve(img.src);
        return;
      }

      // Smooth scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Try webp first, fallback to jpeg
      let dataUrl = canvas.toDataURL('image/webp', quality);
      if (!dataUrl.startsWith('data:image/webp')) {
        dataUrl = canvas.toDataURL('image/jpeg', quality);
      }

      resolve(dataUrl);
    };

    img.onerror = (err) => {
      reject(err);
    };

    reader.readAsDataURL(file);
  });
};
