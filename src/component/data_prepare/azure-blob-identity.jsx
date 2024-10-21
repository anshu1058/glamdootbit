import { BlobServiceClient } from "@azure/storage-blob"; // Import the BlobServiceClient from Azure SDK
import env from "../../../config"; // Import environment configuration file
import { getUserDepartment } from "../auth/authidentity"; // Import function to get the user's department

// Get Azure storage account details and SAS token from the environment configuration
const storageAccountName = env.blobStorageAccountName;
const sasToken = env.blobStorageSasToken;

// Construct the upload URL for accessing Azure Blob storage
const uploadUrl = `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`;

// Initialize the BlobServiceClient using the upload URL
const blobService = new BlobServiceClient(uploadUrl);

// Check if the storage account name and SAS token are properly configured
export const isStorageConfigured = () => {
  return !storageAccountName || !sasToken ? false : true;
};

// Function to get the container client based on the user's department
const getContainerClientByDepartment = async () => {
  const department = await getUserDepartment(); // Get the user's department
 
  
  let containerName;

  // Choose the container name based on the department
  switch (department) {
    case 'department1':
      containerName = "glamfilecontainer"; // Container for 'department1'
      break;
    case 'department2':
      containerName = "humanresource"; // Container for 'department2'
      break;
    case 'department3':
      containerName = "finance"; // Container for 'department3'
      break;
    default:
      throw new Error('Invalid department'); // Throw an error if department is invalid
  }

  // Return the container client for the chosen department's container
  return blobService.getContainerClient(containerName);
};

// Function to retrieve blobs from the user's department-specific container
export const getBlobsInContainer = async () => {
  const containerClient = await getContainerClientByDepartment(); // Get container client based on department
  const returnedBlobUrls = []; // Array to store blob URLs and metadata

  // Loop through all blobs in the container
  for await (const blob of containerClient.listBlobsFlat()) {
    const blobClient = containerClient.getBlobClient(blob.name); // Get blob client for each blob
    const properties = await blobClient.getProperties(); // Get blob properties (e.g., size, content type, etc.)
    
    // Format the last modified date and time of the blob
    const lastModified = properties.lastModified.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const time = properties.lastModified.toLocaleTimeString();
    
    // Convert the size of the blob from bytes to megabytes (MB)
    const sizeInBytes = properties.contentLength;
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2); // Size in MB rounded to 2 decimal places

    // Detect the file type from the content type and map to simpler labels
    let fileType = properties.contentType;
    switch (fileType) {
      case "application/pdf":
        fileType = "pdf";
        break;
      case "text/csv":
        fileType = "csv";
        break;
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        fileType = "doc"; // Maps both DOC and DOCX to 'doc'
        break;
      case "application/vnd.ms-excel":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        fileType = "excel"; // Maps both XLS and XLSX to 'excel'
        break;
      case "application/vnd.ms-powerpoint":
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        fileType = "ppt"; // Maps both PPT and PPTX to 'ppt'
        break;
      case "text/plain":
        fileType = "txt";
        break;
      default:
        fileType = "unknown"; // Default case if file type doesn't match known formats
        break;
    }

    // Create a blob item object with metadata and blob URL
    const blobItem = {
      id: `https://${storageAccountName}.blob.core.windows.net/${containerClient.containerName}/${blob.name}?${sasToken}`,
      url: `https://${storageAccountName}.blob.core.windows.net/${containerClient.containerName}/${blob.name}?${sasToken}`,
      name: blob.name,
      size: sizeInMB,
      type: fileType,
      date: lastModified,
      time: time,
      file: blob, // Blob object itself
    };
    console.log("blobitem",blobItem )
    // Add the blob item to the returned blob URLs array
    returnedBlobUrls.push(blobItem);
  }

  return returnedBlobUrls; // Return the array of blob metadata and URLs
};


// Function to upload a file to the user's department-specific container
const createBlobInContainer = async (file) => {
  const containerClient = await getContainerClientByDepartment(); // Get container client based on department
  const blobClient = containerClient.getBlockBlobClient(file.name); // Get block blob client for the file
  const options = { blobHTTPHeaders: { blobContentType: file.type } }; // Set the content type of the file

  // Upload the file data to Azure Blob storage
  await blobClient.uploadData(file, options);
};

// Function to delete a specific blob from the container
export const deleteBlobFromContainer = async (blobUrl) => {
  const containerClient = await getContainerClientByDepartment(); // Get container client based on department
  
  // Extract the blob name from the blob URL by removing the SAS token
  const blobUrlWithoutSas = blobUrl.split('?')[0];
  const blobName = blobUrlWithoutSas.substring(blobUrlWithoutSas.lastIndexOf('/') + 1);
  
  const blobClient = containerClient.getBlobClient(blobName); // Get blob client for the blob to be deleted

  // Delete the blob from Azure Blob storage
  await blobClient.delete();
};

// Main function to upload a file to Azure Blob storage
const uploadFileToBlob = async (file) => {
  if (!file) return; // Return if no file is provided

  await createBlobInContainer(file); // Call the function to upload the file
};

export default uploadFileToBlob; // Export the default function for uploading files
