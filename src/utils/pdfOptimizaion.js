/**
 * PDF Optimization Utilities
 * Handles on-demand PDF loading and caching
 */

// Cache for loaded PDFs to avoid re-fetching
const pdfCache = new Map();

/**
 * Preload a single PDF into cache
 * @param {string} pdfUrl - URL of the PDF to preload
 * @returns {Promise<Blob>} - The PDF blob data
 */
export const preloadPDF = async (pdfUrl) => {
  if (!pdfUrl || pdfUrl.trim() === "") {
    throw new Error("Invalid PDF URL");
  }

  // Check if PDF is already cached
  if (pdfCache.has(pdfUrl)) {
    console.log("[v0] PDF loaded from cache:", pdfUrl);
    return pdfCache.get(pdfUrl);
  }

  try {
    console.log("[v0] Preloading PDF:", pdfUrl);

    const response = await fetch(pdfUrl, {
      method: "GET",
      headers: {
        "Accept": "application/pdf",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();

    // Validate that it's actually a PDF
    if (!blob.type.includes("pdf")) {
      console.warn("[v0] Downloaded file might not be a valid PDF");
    }

    // Cache the PDF blob
    pdfCache.set(pdfUrl, blob);
    console.log("[v0] PDF cached successfully:", pdfUrl);

    return blob;
  } catch (error) {
    console.error("[v0] Error preloading PDF:", error);
    throw error;
  }
};

/**
 * Download a PDF on-demand
 * @param {string} pdfUrl - URL of the PDF to download
 * @param {string} fileName - Name of the file to save as
 * @returns {Promise<void>}
 */
export const downloadPDFOnDemand = async (pdfUrl, fileName) => {
  if (!pdfUrl || pdfUrl.trim() === "") {
    throw new Error("Invalid PDF URL");
  }

  try {
    console.log("[v0] Starting PDF download:", fileName);

    // Try to load from cache or fetch
    let blob;
    if (pdfCache.has(pdfUrl)) {
      blob = pdfCache.get(pdfUrl);
      console.log("[v0] Using cached PDF for download");
    } else {
      blob = await preloadPDF(pdfUrl);
    }

    // Create a blob URL
    const blobUrl = URL.createObjectURL(blob);

    // Create a temporary link and trigger download
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName || "document.pdf";
    link.style.display = "none";

    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }, 100);

    console.log("[v0] PDF download triggered:", fileName);
  } catch (error) {
    console.error("[v0] Error downloading PDF:", error);
    throw error;
  }
};

/**
 * Check if a PDF is available (can be reached)
 * @param {string} pdfUrl - URL of the PDF to check
 * @returns {Promise<boolean>} - True if PDF is accessible
 */
export const checkPDFAvailability = async (pdfUrl) => {
  if (!pdfUrl || pdfUrl.trim() === "") {
    return false;
  }

  try {
    const response = await fetch(pdfUrl, {
      method: "HEAD",
      headers: {
        "Accept": "application/pdf",
      },
    });

    return response.ok && response.headers.get("content-type")?.includes("pdf");
  } catch (error) {
    console.error("[v0] Error checking PDF availability:", error);
    return false;
  }
};

/**
 * Clear all cached PDFs to free up memory
 */
export const clearPDFCache = () => {
  pdfCache.clear();
  console.log("[v0] PDF cache cleared");
};

/**
 * Get PDF cache size (for debugging)
 * @returns {number} - Number of cached PDFs
 */
export const getPDFCacheSize = () => {
  return pdfCache.size;
};

export default {
  preloadPDF,
  downloadPDFOnDemand,
  checkPDFAvailability,
  clearPDFCache,
  getPDFCacheSize,
};
