/**
 * IPFS Service for uploading game screenshots and metadata
 * Uses Pinata for reliable IPFS pinning
 */

export interface NFTMetadata {
  name: string;
  description: string;
  image: string; // IPFS URL of the image
  attributes: {
    trait_type: string;
    value: string;
  }[];
}

/**
 * Upload an image to IPFS via Pinata
 */
export async function uploadImageToIPFS(imageBlob: Blob, filename: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', imageBlob, filename);

  const pinataMetadata = JSON.stringify({
    name: filename,
  });
  formData.append('pinataMetadata', pinataMetadata);

  const response = await fetch('/api/ipfs/upload-image', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to upload image to IPFS: ${error.message}`);
  }

  const data = await response.json();
  return `ipfs://${data.IpfsHash}`;
}

/**
 * Upload NFT metadata to IPFS via Pinata
 */
export async function uploadMetadataToIPFS(metadata: NFTMetadata): Promise<string> {
  const response = await fetch('/api/ipfs/upload-metadata', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to upload metadata to IPFS: ${error.message}`);
  }

  const data = await response.json();
  return `ipfs://${data.IpfsHash}`;
}

/**
 * Convert IPFS URI to HTTP gateway URL
 */
export function ipfsToHttp(ipfsUri: string): string {
  if (ipfsUri.startsWith('ipfs://')) {
    return ipfsUri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
  }
  return ipfsUri;
}

/**
 * Capture screenshot from canvas element and convert to Blob
 */
export async function captureCanvasScreenshot(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to capture screenshot'));
      }
    }, 'image/png');
  });
}

/**
 * Capture screenshot from HTML element using html2canvas
 */
export async function captureElementScreenshot(element: HTMLElement): Promise<Blob> {
  const html2canvas = (await import('html2canvas')).default;
  
  const canvas = await html2canvas(element, {
    backgroundColor: '#000000',
    scale: 2, // Higher resolution
    logging: false,
  });

  return captureCanvasScreenshot(canvas);
}

