import env from "../../../config";

//  Function to be called while uploading and deleting the file from the blob

async function runIndexer(indexerName) {
    try {
      const userToken = localStorage.getItem('accessToken');
      const response = await fetch(`${env.api}/api/run-indexer`, {
        method: 'POST',
        headers: {
           Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ indexerName }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to run indexer');
      }
  
    //   const data = await response.json();
      console.log('Indexer run response:', indexerName);
    //   return data;
    } catch (error) {
      console.error('Error running indexer:', error.message);
      throw error;
    }
  }

  export default runIndexer;
  