import React from 'react';

const ModeratedResponse = ({ response }) => {
  // Check if response is empty
  if (!response) {
    return null;
  }

  // Render the formatted response
  return (
    <div>
      {response.Terms && (
        <div>
          <h3>Terms</h3>
          <div style={{marginLeft:"-25px"}}>
          {formatValue(response.Terms)}
          </div>
          <hr />
        </div>
      )}

      {response.Classification && (
        <div>
          <h3>Classification</h3>
          {formatValue(response.Classification)}
          <hr />
        </div>
      )}
    {response.length !== 0?(
      <>
      <h3>Other Fields</h3>
    
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(response).map(([field, value]) => {
            // Skip rendering Terms and Classification again
            if (field === 'Terms' || field === 'Classification') {
              return null;
            }

            return (
              <tr key={field} style={{ marginTop: "12px" }}>
                <td><strong>{field}</strong></td>
                <td>{formatValue(value)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
</>
    ):('')
    }
    </div>
  );
};

const formatValue = (value) => {
  // Check if the value is null
  if (value === null) {
    return 'Null';
  }

  // Check if the value is an object
  if (typeof value === 'object') {
    // Special handling for PII field
    if (Array.isArray(value) && value.length > 0 && 'ListId' in value[0] && 'Term' in value[0]) {
      return (
        <ul>
          {value.map((term, index) => (
            <li key={index}>
              {Object.entries(term).map(([termKey, termValue]) => (
                <div key={termKey}>
                  <strong>{termKey}:</strong> {termValue}<br />
                </div>
              ))}
            </li>
          ))}
        </ul>
      );
    } else if ('ReviewRecommended' in value) {
      // Special handling for Classification field
      const { ReviewRecommended, ...categories } = value;
      return (
        <div>
          <strong>Review Recommended:</strong> {ReviewRecommended ? 'Yes' : 'No'}<br />
          {Object.entries(categories).map(([category, categoryValue]) => (
            <div key={category}>
              <strong>{category}:</strong> {categoryValue.Score}<br />
            </div>
          ))}
        </div>
      );
    }
    return JSON.stringify(value, null, 2); // Default JSON formatting for other objects
  }

  return value; // Non-object values are displayed as is
};

export default ModeratedResponse;
