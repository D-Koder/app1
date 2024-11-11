// chat.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// API configuration
const apiKey = ''; // Consider using an environment variable
const url = 'https://api.openai.com/v1/chat/completions';

const ChatComponent = ({ task, time }) => {
  const [responseArray, setResponseArray] = useState([]);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const getChatCompletion = async () => {
    setLoading(true);
        const query = `Please provide a productivity strategy for the task "${task}" with a total of ${time} minutes of study time. Split the ${time} minutes into several equal work sections. Do not include breaks. Return the output in the array format: time=[?, ?, ?,...?] (e.g. time[15, 15, 15, 15]). dont add any unrequested text such as dialog ,labels or headers beside the requested values.`;
        const addBreak = `add breaks inbetween each of the elements in "time" array and output the time array again . explain the reason behind the timeslots chose in "time" array in a short paragraph with hello at the end. only present the time array andd short paragraph . make sure nothing else is printed out`;
        const queryWithBreaks = `Please divide ${time} minutes of study time into equal work sections for the task "${task}". After dividing the time, add breaks between each work section. Breaks should not count toward the total study time (e.g., for 60 minutes of study time, you might have [20 work, 5 break, 20 work, 5 break, 20 work], where the total study time is 20 + 20 + 20 = 60). Return the result in a JSON format where the time array is structured as: time={[work1, work2, work3], [break1, break2]}. For example, for 60 minutes of total study time, the result could be: time={[20, 20, 20], [5, 5]}. After the time array, include a brief explanation in the field "explanation", which explains the reasoning of the work and break schedule in a short paragraph. Do not include any extra text, labels, or headers. Only return the time array and explanation in the requested format.`;
        const validateValue = `does this equate to ${time} min of work? if not then change the schedule to make it so, return the same output but with the updated values.`
        const validateFormat = `Please ensure the following:
1. The "time" field contains two arrays: one for work durations and one for break durations.
2. The total study time is accurate (i.e., the sum of the work times in the "time" array should match the requested total study time of ${time} minutes).
3. The "explanation" field contains a short paragraph that explains the distribution of work and break times.
4. There should be no extra text, labels, or headers beyond the requested fields.
If the format or content is incorrect, please correct it and return the output in the specified format: { "time": [[work1, work2, work3], [break1, break2]], "explanation": "your explanation here" }`;

// console.log(queryWithBreaks)
// console.log(validateFormat)
        const data = {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: queryWithBreaks },{ role: "user", content: validateValue },{ role: "user", content: validateFormat }],
            temperature: 0.7
        };

        try {
            const response = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            });
        console.log(response.data.choices[0].message)
        const messageContent = response.data.choices[0].message.content;
        const jsonContent = JSON.parse(messageContent);  // Turn string content into JSON

        
        const workDurations = jsonContent.time[0];  // Extract work durations
        const breakDurations = jsonContent.time[1]; // Extract break durations
        
        const maxLength = Math.max(workDurations.length, breakDurations.length);
        
        let interleavedArray = [];
        
        // Loop through the work durations and interleave with break durations
        for (let i = 0; i < maxLength; i++) {
            // Add work duration if available
            if (i < workDurations.length) {
                interleavedArray.push(workDurations[i]);
            }
        
            // Add break duration if available (no placeholders)
            if (i < breakDurations.length) {
                interleavedArray.push(breakDurations[i]);
            }
        }
        
        console.log(interleavedArray);
        

        setResponseArray(interleavedArray);
        setExplanation(jsonContent.explanation)
    } catch (error) {
        console.error('Error making the API request:', error.response ? error.response.data : error.message);
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="chat-container">
      <button className="get-strategy-button" onClick={getChatCompletion} disabled={loading}>
        {loading ? 'Loading...' : 'Get Strategy'}
      </button>

      {responseArray.length > 0 && (
        <div className="response-section">
          <h3>Generated Study Plan</h3>
          <div className="timeline">
            {responseArray.map((item, index) => (
              <div key={index} className={`timeline-item ${index % 2 === 0 ? 'work' : 'break'}`}>
                <span>{item} minutes</span>
                <span className="timeline-label">{index % 2 === 0 ? 'Work' : 'Break'}</span>
              </div>
            ))}
          </div>
          {explanation && (
            <p className="explanation">{explanation}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
