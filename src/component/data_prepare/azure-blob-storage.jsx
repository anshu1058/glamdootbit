import { BlobServiceClient } from "@azure/storage-blob";

const storageAccountName = "glamblobstorage";
const sasToken = "sp=racwdli&st=2024-09-18T06:29:35Z&se=2025-10-23T14:29:35Z&sv=2022-11-02&sr=c&sig=3FyJ24G2GJFWOUoCFU6oh8iCSuMfeWfd%2B%2BmVK%2FrXNmU%3D";
const containerName = "glamfilecontainer";
const uploadUrl = `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`;


const blobService = new BlobServiceClient(uploadUrl);
const containerClient = blobService.getContainerClient(containerName);

export const isStorageConfigured = () => {
  return !storageAccountName || !sasToken ? false : true;
};

export const getBlobsInContainer = async () => {
  const returnedBlobUrls = [];

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
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2); // Size in MB rounded to 2 decimal places

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
    const blobItem = {
      id: `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}?${sasToken}`,
      url: `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}?${sasToken}`,
      name: blob.name,
      size: sizeInMB + "MB",
      type: fileType,
      date: lastModified,
      time: time,
      file: blob
    };

    returnedBlobUrls.push(blobItem);
  }

  return returnedBlobUrls;
};




// export const getBlobsInContainer = async () => {
//   const returnedBlobUrls = [];

//   for await (const blob of containerClient.listBlobsFlat()) {
//     const blobClient = containerClient.getBlobClient(blob.name);
//     const properties = await blobClient.getProperties();
//     const lastModified = properties.lastModified.toLocaleDateString(undefined, {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//     const time = properties.lastModified.toLocaleTimeString();
//     const sizeInBytes = properties.contentLength;
//     let size, sizeUnit;

//     if (sizeInBytes >= 1024 * 1024) {
//       size = (sizeInBytes / (1024 * 1024)).toFixed(2);
//       sizeUnit = "MB";
//     } else {
//       size = Math.ceil(sizeInBytes / 1024);
//       sizeUnit = "KB";
//     }

//     let fileType = properties.contentType;
//     if (fileType === "application/pdf") {
//       fileType = "pdf";
//     }
//     if (fileType === "text/csv") {
//       fileType = "csv";
//     }
//     if (fileType === "application/msword") {
//       fileType = "msword";
//     }
//     if (fileType === "application/vnd.ms-powerpoint") {
//       fileType = "vnd.ms-powerpoint";
//     }
//     if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
//       fileType = "vnd.openxmlformats-officedocument.spreadsheetml.sheet";
//     }
//     if (fileType === "text/plain") {
//       fileType = "plain";
//     }
    
    
    

//     const blobItem = {
//       id: `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}?${sasToken}`,
//       url: `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}?${sasToken}`,
//       name: blob.name,
//       size: size + sizeUnit,
//       type: fileType,
//       date: lastModified,
//       time: time,
//       file: blob
//     };
//     // console.log(blobItem)

    

//     returnedBlobUrls.push(blobItem);
//   }

//   return returnedBlobUrls;
// };


const createBlobInContainer = async (file) => {
  const blobClient = containerClient.getBlockBlobClient(file.name);
  const options = { blobHTTPHeaders: { blobContentType: file.type } };

  await blobClient.uploadData(file, options);
};

export const deleteBlobFromContainer = async (blobUrl) => {
  const blobUrlWithoutSas = blobUrl.split('?')[0];
  const blobName = blobUrlWithoutSas.substring(blobUrlWithoutSas.lastIndexOf('/') + 1);
  const blobClient = containerClient.getBlobClient(blobName);

  await blobClient.delete();
};

const uploadFileToBlob = async (file) => {
  if (!file) return;

  await createBlobInContainer(file);
};

export default uploadFileToBlob;