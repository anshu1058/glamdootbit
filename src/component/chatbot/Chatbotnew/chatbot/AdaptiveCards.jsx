import * as AdaptiveCards from 'adaptivecards';

const AdaptiveCardsComponent = (props) => {
  // Define your Adaptive Card JSON
  const adaptiveCard = {
    type: 'AdaptiveCard',
    body: [
      {
        type: props?.att[0]?.type,
        url: props?.att[0]?.url,
        spacing: "None",
        horizontalAlignment: props?.att[0]?.horizontalAlignment,
        size: "Stretch",
      },
      {
        type: "TextBlock",
        text: props?.att[1]?.text,
        wrap: true,
      },
     
    ],
  };

  // Create an Adaptive Card instance
  const adaptiveCardInstance = new AdaptiveCards.AdaptiveCard();

  // Parse the Adaptive Card JSON
  adaptiveCardInstance.parse(adaptiveCard);

  // Render the Adaptive Card
  const renderedCard = adaptiveCardInstance.render();

  // Extract and format content
  const formattedOutput = extractAndFormatContent(adaptiveCard.body);

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: renderedCard.innerHTML }} />
      {/* <pre>{formattedOutput}</pre> Display formatted output */}
    </div>
  );
};

// Function to extract and format content
const extractAndFormatContent = (body) => {
  let output = '';

  body.forEach(element => {
    if (element.type === "TextBlock") {
      // Check if the TextBlock contains table data
      if (element.text.includes("|")) {
        output += `${element.text.trim()}\n`;
      }
    } else if (element.type === "ColumnSet") {
      // Exclude column data to keep only the relevant table data
      // If necessary, further refine this logic based on your requirements
    }
  });

  return output.trim(); // Remove any extra spaces
};

export default AdaptiveCardsComponent;
