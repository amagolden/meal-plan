import React, { useState } from "react";
import OpenAiComponent from "./openai";


export default function MealForm() {
    const [selectedPreferences, setSelectedPreferences] = useState([]);
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);


    const handleCheckboxChange = (option) => {
        setSelectedPreferences((prev) =>
        prev.includes(option)
            ? prev.filter((item) => item !== option) // Remove if already selected
            : [...prev, option] // Add if not selected
        );
    };

    const preferences = [
        "Healthy",
        "Mediterranean Diet",
        "Vegan",
        "Kid-Friendly",
        "Quick Recipes",
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
            
            {/*// Fallback to attempt a manual parse if structured text
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
            }, {});*/}
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
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="border-b border-gray-900/10 pb-6">
          <h2 className="text-center text-xl font-semibold text-gray-900">
            Welcome to our Meal Planner
          </h2>
          <p className="mt-1 text-center text-sm text-gray-600">
            We create weekly meal plans based on your dietary preferences with the goal of reducing food waste.
          </p>
        </div>
  
        {/* Form and Output Section */}
        <div className="grid grid-cols-1 gap-6">
          {/* Form Column */}
          <form 
            onSubmit={(e) => {
                e.preventDefault();
                fetchOpenAiResponse();
              }}   
            className="space-y-6">
            <div className="border-b border-gray-900/10 pb-6">
              <h3 className="text-lg font-semibold text-gray-900">Dietary Preferences</h3>
              <fieldset className="mt-4 space-y-2">
                {preferences.map((preference) => (
                    <label key={preference} className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="preferences"
                        value={preference}
                        checked={selectedPreferences.includes(preference)}
                        onChange={() => handleCheckboxChange(preference)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <span>{preference}</span>
                    </label>
                ))}
                </fieldset>
            </div>
  
            <button
                type="submit"
                className="mt-4 w-full bg-indigo-600 text-white rounded-md px-3 py-2 hover:bg-indigo-500"
                disabled={loading}
                >
                {loading ? "Loading..." : "Get Plan"}
                </button>
            </form>

            {/* Display Meal Plan */}
            <OpenAiComponent response={response} loading={loading} />
        </div>
          
  
          {/* Output Column */}
          {/*<div className="border border-gray-300 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Custom Meal Plan
            </h3>
            <div className="mt-4 text-sm text-gray-600">
              <p>Select dietary preferences to see the plan here.</p>
            </div>
          </div>*/}
            
      </div>
    );
  }
  