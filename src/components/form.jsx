import React, { useState } from "react";
import OpenAiComponent from "./openai";


export default function MealForm() {
    const [selectedPreferences, setSelectedPreferences] = useState([]);

    const handleCheckboxChange = (option) => {
        setSelectedPreferences((prev) =>
        prev.includes(option)
            ? prev.filter((item) => item !== option) // Remove if already selected
            : [...prev, option] // Add if not selected
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // You could trigger a callback or pass the data to OpenAiComponent
        console.log("Selected Preferences:", selectedPreferences);
    };

    const preferences = [
        "Healthy",
        "Mediterranean Diet",
        "Vegan",
        "Kid-Friendly",
        "Quick Recipes",
    ];
    
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
        <div className="grid grid-cols-2 gap-6">
          {/* Form Column */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
  
            <div className="flex justify-center">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get Plan
              </button>
            </div>
          </form>
  
          {/* Output Column */}
          {/*<div className="border border-gray-300 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Custom Meal Plan
            </h3>
            <div className="mt-4 text-sm text-gray-600">
              <p>Select dietary preferences to see the plan here.</p>
            </div>
          </div>*/}
            
          <OpenAiComponent selectedPreferences={selectedPreferences} />

        </div>
      </div>
    );
  }
  