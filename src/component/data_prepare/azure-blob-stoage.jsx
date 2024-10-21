import { BlobServiceClient } from "@azure/storage-blob";
import env from "../../../config";
import { useState, useEffect } from "react";
import { InteractiveBrowserCredential } from "@azure/identity";

const storageAccountName = env.blobStorageAccountName;
const defaultContainerName = env.blobAzureContainerName;

const signInOptions = {
  clientId: "8279f071-c18e-470e-87fc-7f4c1cca6245",
  tenantId: "1de61f46-fc12-4067-ab1d-147eb7e21025"
};

const credential = new InteractiveBrowserCredential(signInOptions);
const blobServiceClient = new BlobServiceClient(
  `https://${storageAccountName}.blob.core.windows.net`,
  credential
);

const allowedContainers = ["glamfilecontainer", "finance", "humanresource"];

const fetchAccessibleContainers = async () => {
  const containers = [];
  try {
    for await (const container of blobServiceClient.listContainers()) {
      if (allowedContainers.includes(container.name)) {
        containers.push(container.name);
      }
    }
  } catch (error) {
    console.error("Error fetching accessible containers:", error);
  }
  return containers;
};

const fetchContainersAndBlobs = async () => {
  const containersWithBlobs = [];
  try {
    const accessibleContainers = await fetchAccessibleContainers();
    for (const container of accessibleContainers) {
      const containerClient = blobServiceClient.getContainerClient(container);
      const blobs = await getBlobsInContainer(containerClient);
      containersWithBlobs.push({ container, blobs });
    }
  } catch (err) {
    console.error("Error fetching containers and blobs:", err);
    throw err;
  }
  return containersWithBlobs;
};

export const getBlobsInContainer = async (containerClient) => {
  const returnedBlobUrls = [];
  try {
    for await (const blob of containerClient.listBlobsFlat()) {
      const blobClient = containerClient.getBlobClient(blob.name);
      const properties = await blobClient.getProperties();
      const lastModified = properties.lastModified.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      const time = properties.lastModified.toLocaleTimeString();
      const sizeInBytes = properties.contentLength;
      const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
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
          fileType = "xlsx"; // Maps both XLS and XLSX to 'excel'
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

      const blobItem = {
        id: blobClient.url,
        url: blobClient.url,
        name: blob.name,
        size: sizeInMB,
        type: fileType,
        date: lastModified,
        time: time,
        file: blob
      };
      returnedBlobUrls.push(blobItem);
    }
  } catch (error) {
    console.error(`Error retrieving blobs from container ${containerClient.containerName}:`, error);
  }
  return returnedBlobUrls;
};

const uploadFileToBlob = async (file, container) => {
  const targetContainer = container || defaultContainerName;
  const accessibleContainers = await fetchAccessibleContainers();
  if (!accessibleContainers.includes(targetContainer)) {
    console.error(`Error: User does not have access to container ${targetContainer}`);
    return;
  }
  const containerClient = blobServiceClient.getContainerClient(targetContainer);
  const blobClient = containerClient.getBlockBlobClient(file.name);

  try {
    await blobClient.uploadData(file, {
      blobHTTPHeaders: {
        blobContentType: file.type,
      },
    });
    
  } catch (error) {
    console.error(`Error uploading file "${file.name}" to container "${targetContainer}":`, error);
    throw error;
  }
};

const deleteBlobFromContainer = async (blobUrl) => {
  try {
    // Parse the URL
    const url = new URL(blobUrl);
    // Get the pathname, which is in the format /container/blob
    const pathname = url.pathname;

    // Split the pathname to get the container name and the blob name
    // pathname will be something like "/container/blob"
    const parts = pathname.split('/');
    // The first part is an empty string because pathname starts with '/'
    // The second part is the container name
    // The remaining parts (joined by '/') form the blob name
    const containerName = parts[1];
    const blobName = decodeURIComponent(parts.slice(2).join('/'));
    // Get ContainerClient
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Check if the container exists and is accessible
    const containerExists = await containerClient.exists();
    if (!containerExists) {
      console.error("Container does not exist or is not accessible:", containerName);
      return;
    }

    // Initialize BlobClient and delete the blob
    const blobClient = containerClient.getBlobClient(blobName);
    await blobClient.delete();
  } catch (error) {
    console.error("Error deleting blob", error);
    throw error;
  }
};

export { deleteBlobFromContainer };







const useFetchContainersAndBlobs = () => {
  const [containersWithBlobs, setContainersWithBlobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchContainersAndBlobs();
        setContainersWithBlobs(data);
      } catch (err) {
        console.error("Error fetching containers and blobs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { containersWithBlobs, loading, error, uploadFileToBlob, deleteBlobFromContainer };
};

export { fetchContainersAndBlobs, uploadFileToBlob, useFetchContainersAndBlobs };
