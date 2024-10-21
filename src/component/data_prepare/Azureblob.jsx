import React, { useState, useEffect } from 'react';
import { InteractiveBrowserCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";

const BlobView = () => {
    const [containersWithBlobs, setContainersWithBlobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const signInOptions = {
            clientId: "8279f071-c18e-470e-87fc-7f4c1cca6245", // Replace with your client ID
            tenantId: "1de61f46-fc12-4067-ab1d-147eb7e21025" // Replace with your tenant ID
        };

        const fetchContainersAndBlobs = async () => {
            setLoading(true);
            setError(null);

            try {
                const credential = new InteractiveBrowserCredential(signInOptions);
                const blobServiceClient = new BlobServiceClient(
                    "https://glamblobstorage.blob.core.windows.net/", // Replace with your storage account URL
                    credential
                );

                const accessibleContainers = ["glamfilecontainer", "humanresource", "finance"];
                const containersWithBlobs = [];

                for (const containerName of accessibleContainers) {
                    try {
                        const containerClient = blobServiceClient.getContainerClient(containerName);
                        const localBlobList = [];
                        for await (const blob of containerClient.listBlobsFlat()) {
                            localBlobList.push(blob);
                        }
                        containersWithBlobs.push({ containerName, blobs: localBlobList });
                    } catch (err) {
                        console.error(`Error fetching blobs for container ${containerName}:`, err);
                        // If the user doesn't have access to a container, continue to the next one
                    }
                }

                setContainersWithBlobs(containersWithBlobs);
            } catch (err) {
                console.error("Error fetching containers and blobs:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContainersAndBlobs();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {containersWithBlobs.map((container, index) => (
                <div key={index}>
                    <h3>{container.containerName}</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Blob Name</th>
                                <th>Blob Size</th>
                                <th>Download URL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {container.blobs.map((blob, blobIndex) => (
                                <tr key={blobIndex}>
                                    <td>{blob.name}</td>
                                    <td>{blob.properties.contentLength}</td>
                                    <td>
                                        <img src={`https://glamblobstorage.blob.core.windows.net/${container.containerName}/${blob.name}`} alt={blob.name} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default BlobView;
