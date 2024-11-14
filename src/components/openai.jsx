// Import React and useState (optional for managing input and responses)
import React, { useState } from 'react';

const OpenAiComponent = () => {
  //const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const options = [
    'Healthy',
    'Mediterranean Diet',
    'Vegan',
    'Kid-Friendly',
    'Quick Recipes',
  ];

  const standardPrompt = `Please generate a meal plan for a week (7 days) that includes breakfast, lunch, and dinner for each day. Structure the response in the following JSON format:

  {
    "Monday": {
      "breakfast": "Scrambled eggs with spinach",
      "lunch": "Grilled cheese sandwich with tomato soup",
      "dinner": "Baked chicken with roasted vegetables"
    },
    "Tuesday": {
      "breakfast": "Oatmeal with fruits",
      "lunch": "Turkey and cheese wraps",
      "dinner": "Spaghetti with marinara sauce"
    },
    "Wednesday": {
      "breakfast": "Pancakes with syrup and berries",
      "lunch": "Chicken Caesar salad",
      "dinner": "Tacos with ground beef and avocado"
    },
    ...
  }
  Please ensure the JSON format is valid and clearly separated by days of the week.`

  const handleCheckboxChange = (option) => {
    setSelectedOptions((prevSelectedOptions) =>
      prevSelectedOptions.includes(option)
        ? prevSelectedOptions.filter((item) => item !== option) // Remove if already selected
        : [...prevSelectedOptions, option] // Add if not selected
    );
  };
  
  const fetchOpenAiResponse = async () => {
    const userChoice = selectedOptions.join(', ');

    try {
      const result = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", 
          messages: [
            { role: "user", content: `${standardPrompt} with the following user preferences ${userChoice}` }
          ],
          max_tokens: 1000,
        }),
      });

      const data = await result.json();
      //console.log("Raw API Response Content:", data.choices[0].message.content);

      // Try to parse the content as JSON
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(data.choices[0].message.content);
      } catch (parseError) {
        console.error("Response parsing error. Using fallback approach.", parseError);
        
        // Fallback to attempt a manual parse if structured text
        parsedResponse = daysOfWeek.reduce((acc, day) => {
          const dayDataMatch = data.choices[0].message.content.match(
            new RegExp(`${day}:\\s*\\n\\s*Breakfast: (.*)\\n\\s*Lunch: (.*)\\n\\s*Dinner: (.*)`, 'i')
          );
          if (dayDataMatch) {
            acc[day] = {
              breakfast: dayDataMatch[1].trim(),
              lunch: dayDataMatch[2].trim(),
              dinner: dayDataMatch[3].trim(),
            };
          }
          return acc;
        }, {});
      }

      //console.log("Final Parsed Response:", parsedResponse);
      setResponse(parsedResponse);

    } catch (error) {
      console.error('Error fetching data from OpenAI API:', error);
    }
  };

  return (
    <div className="container">
      <div className="column"></div>
      <div className="column meal-preferences">
        <h2>Select Meal Preferences:</h2>
        {options.map((option) => (
          <div key={option}>
            <input
              type="checkbox"
              id={option}
              checked={selectedOptions.includes(option)}
              onChange={() => handleCheckboxChange(option)}
            />
            <label htmlFor={option}>{option}</label>
          </div>
        ))}

          {/*      
          <textarea
            placeholder="Enter a prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />*/}

        <button onClick={fetchOpenAiResponse}>Get Response</button>
      </div>
      <div className="column response-section">
        <h2>Custom Meal Plan:</h2> 
        {daysOfWeek.map((day) => {
          //console.log(`Accessing data for ${day}:`, response[day]);
          return (
            <div key={day} style={{ marginBottom: '20px' }}>
              <h3>{day}</h3>
              <p><strong>Breakfast:</strong> {response[day]?.breakfast || 'Not available'}</p>
              <p><strong>Lunch:</strong> {response[day]?.lunch || 'Not available'}</p>
              <p><strong>Dinner:</strong> {response[day]?.dinner || 'Not available'}</p>
            </div>
          );
        })}
      </div>
      <div className="column"></div>
    </div>
  );
};

export default OpenAiComponent;
