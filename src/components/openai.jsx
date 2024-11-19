import React, { useState } from 'react';

const OpenAiComponent = ({ response, loading  }) => {

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const downloadCSV = () => {
    if (!response) {
      alert("No meal plan available to download!");
      return;
    }
  
    // CSV header
    const header = ["Day,Meal,Details"];
    const csvRows = [];
  
    // Loop through each day and add rows for breakfast, lunch, and dinner
    Object.keys(response).forEach((day) => {
      const meals = response[day];
      csvRows.push(`${day},Breakfast,${meals.breakfast || "N/A"}`);
      csvRows.push(`${day},Lunch,${meals.lunch || "N/A"}`);
      csvRows.push(`${day},Dinner,${meals.dinner || "N/A"}`);
    });
  
    // Combine header and rows
    const csvContent = [header.join("\n"), csvRows.join("\n")].join("\n");
  
    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
  
    // Create a temporary link to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = "meal_plan.csv";
    document.body.appendChild(link);
    link.click();
  
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border-b border-gray-900/10 pb-6">
      <h3 className="text-lg font-semibold text-gray-900">Custom Meal Plan</h3>
      {loading ? (
        <p>Loading...</p>
        ) : (
          <div className="space-y-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
            <div className="flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">{day}</h3>
            </div>
              <div className="flex-grow">
                <p className="text-sm">
                  <strong>Breakfast:</strong> {response[day]?.breakfast || 'Not available'}
                </p>
                <p className="text-sm">
                  <strong>Lunch:</strong> {response[day]?.lunch || 'Not available'}
                </p>
                <p className="text-sm">
                  <strong>Dinner:</strong> {response[day]?.dinner || 'Not available'}
                </p>
              </div>
            </div>
          ))}
        </div>
        )}
      <button
        onClick={downloadCSV}
        className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
      >
        Download as CSV
      </button>
    </div>
  );
};

export default OpenAiComponent;
