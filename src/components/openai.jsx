import React, { useState } from 'react';

const OpenAiComponent = ({ selectedPreferences }) => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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
  
  const fetchOpenAiResponse = async () => {
    const preferences = selectedPreferences.join(', ');
    setLoading(true);

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
            { role: "user", content: `${standardPrompt} with the following user preferences ${preferences}` }
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4">
      <h2 className="text-lg font-bold">Custom Meal Plan</h2>
      {loading ? (
        <p>Loading...</p>
        ) : (
          <div>
              {daysOfWeek.map((day) => (
                <div key={day} className="mb-4">
                  <h3 className="text-md font-semibold">{day}</h3>
                  <p>
                    <strong>Breakfast:</strong> {response[day]?.breakfast || "N/A"}
                  </p>
                  <p>
                    <strong>Lunch:</strong> {response[day]?.lunch || "N/A"}
                  </p>
                  <p>
                    <strong>Dinner:</strong> {response[day]?.dinner || "N/A"}
                  </p>
                </div>
              ))}
            </div>
        )}
      <button
        onClick={fetchOpenAiResponse}
        className="mt-4 bg-indigo-600 text-white rounded-md px-3 py-2 hover:bg-indigo-500"
        >
        Generate Meal Plan
      </button>
    </div>
  );
};

export default OpenAiComponent;
