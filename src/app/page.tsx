"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [json, setJson] = useState('');
  const [disableBtn, setDisableBtn] = useState(true);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [alphabets, setAlphabets] = useState<string[]>([]);
  const [highestLowercaseAlphabet, setHighestLowercaseAlphabet] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<string[]>([]);
  const [responseError, setResponseError] = useState<string | null>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setJson(event.target.value);
  }

  useEffect(() => {
    setDisableBtn(json.trim() === '');
  }, [json]);

  function isValidJson(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);

      if (typeof parsed !== 'object' || parsed === null || !('data' in parsed) || !Array.isArray(parsed.data)) {
        return false;
      }

      const isValidArray = parsed.data.every(
        (item: any) => typeof item === 'string' && /^[a-zA-Z0-9]+$/.test(item)
      );

      return isValidArray;
    } catch {
      return false;
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValidJson(json)) {
      alert('Invalid JSON format. Ensure the "data" array contains only letters or numbers.');
      return;
    }

    try {
      const response = await axios.post('/bhfl', JSON.parse(json));
      const { numbers, alphabets, highest_lowercase_alphabet } = response.data;
      setNumbers(numbers || []);
      setAlphabets(alphabets || []);
      setHighestLowercaseAlphabet(highest_lowercase_alphabet || '');
      setResponseError(null);

      // Initialize filtered data
      filterData([...numbers.map(String), ...alphabets, highest_lowercase_alphabet]);
    } catch (error: any) {
      console.error('Error:', error.message);
      setResponseError('An error occurred while fetching the data.');
      // Clear dropdowns and filtered data on error
      setNumbers([]);
      setAlphabets([]);
      setHighestLowercaseAlphabet('');
      setFilteredData([]);
    }
  }

  function handleCategoryClick(category: string) {
    const updatedSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(cat => cat !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(updatedSelectedCategories);
    filterData(updatedSelectedCategories);
  }

  function filterData(selectedCategories: string[]) {
    let dataToDisplay: string[] = [];
    if (selectedCategories.includes('numbers')) {
      dataToDisplay = dataToDisplay.concat(numbers.map(String));
    }
    if (selectedCategories.includes('alphabets')) {
      dataToDisplay = dataToDisplay.concat(alphabets);
    }
    if (selectedCategories.includes('highest_lowercase_alphabet') && highestLowercaseAlphabet) {
      dataToDisplay.push(highestLowercaseAlphabet);
    }
    setFilteredData(dataToDisplay);
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <div>
        <form onSubmit={onSubmit} className="form-group">
          <input
            type="text"
            className="form-control my-2"
            name="json"
            id="json"
            value={json}
            onChange={handleChange}
            placeholder='Enter JSON with "data" array (e.g., {"data": ["A", "1"]})'
          />
          <button
            type="submit"
            className="btn btn-primary my-2"
            disabled={disableBtn}
          >
            Submit
          </button>
        </form>

        {responseError && <p className="text-danger">{responseError}</p>}

        {(numbers.length > 0 || alphabets.length > 0 || highestLowercaseAlphabet) && (
          <div>
            <div className="btn-group" role="group" aria-label="Select Categories">
              {numbers.length > 0 && (
                <button
                  type="button"
                  className={`btn ${selectedCategories.includes('numbers') ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleCategoryClick('numbers')}
                >
                  Numbers
                </button>
              )}
              {alphabets.length > 0 && (
                <button
                  type="button"
                  className={`btn ${selectedCategories.includes('alphabets') ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleCategoryClick('alphabets')}
                >
                  Alphabets
                </button>
              )}
              {highestLowercaseAlphabet && (
                <button
                  type="button"
                  className={`btn ${selectedCategories.includes('highest_lowercase_alphabet') ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleCategoryClick('highest_lowercase_alphabet')}
                >
                  Highest Lowercase Alphabet
                </button>
              )}
            </div>

            <div>
              <h4>Filtered Output:</h4>
              <ul>
                {filteredData.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
