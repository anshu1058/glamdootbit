// component having option for the different azure open api
//  calling from the summary component.
//  user will be able to user different gpt modal for the summarization.

export const getModelParameters = (selectedModel) => {
    
    switch (selectedModel) {
      case "gpt-4o":
        return {
          model:'gpt-4o',
          temperature: 0.7,
          maxLength: 200,
          topP: 0.95,
          frequencyPenalty: 0,
          presencePenalty: 0,
          tokenlimit:2000
        };
        case "gpt-35-turbo":
        return {
          model:'gpt-35-turbo',
          temperature: 0.7,
          maxLength: 200,
          topP: 0.95,
          frequencyPenalty: 0,
          presencePenalty: 0,
          tokenlimit:8000
        };
      case "gpt-4o-mini":
        return {
          model:'gpt-4o-mini',
          temperature: 0.7,
          maxLength: 200,
          topP: 0.95,
          frequencyPenalty: 0,
          presencePenalty: 0,
          tokenlimit:2000
        };
      // Add more cases for additional models if needed
      default:
        // Default values for the default model
        return {
          model:'gpt-4o-mini',
          temperature: 0.7,
          maxLength: 200,
          topP: 0.95,
          frequencyPenalty: 0,
          presencePenalty: 0,
          tokenlimit:22000
        };
    }
  };
  