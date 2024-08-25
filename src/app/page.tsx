"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [json, setJson] = useState("");
  const [disableBtn, setDisableBtn] = useState(true);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [alphabets, setAlphabets] = useState<string[]>([]);
  const [highestLowercaseAlphabet, setHighestLowercaseAlphabet] = useState<string>("");
  const [responseError, setResponseError] = useState<string | null>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setJson(event.target.value);
  }

  useEffect(() => {
    setDisableBtn(json.trim() === "");
  }, [json]);

  function isValidJson(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);

      if (typeof parsed !== "object" || parsed === null || !("data" in parsed) || !Array.isArray(parsed.data)) {
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
      const response = await axios.post("/bhfl", JSON.parse(json));
      // Update state with response data
      setNumbers(response.data.numbers || []);
      setAlphabets(response.data.alphabets || []);
      setHighestLowercaseAlphabet(response.data.highest_lowercase_alphabet || "");
      setResponseError(null);
    } catch (error: any) {
      console.error('Error:', error.message);
      setResponseError('An error occurred while fetching the data.');
      // Clear dropdowns on error
      setNumbers([]);
      setAlphabets([]);
      setHighestLowercaseAlphabet("");
    }
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

        {numbers.length > 0 && (
          <div>
            <label htmlFor="numbers">Select a Number:</label>
            <select id="numbers" className="form-control my-2">
              {numbers.map((num, index) => (
                <option key={index} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        )}

        {alphabets.length > 0 && (
          <div>
            <label htmlFor="alphabets">Select an Alphabet:</label>
            <select id="alphabets" className="form-control my-2">
              {alphabets.map((alpha, index) => (
                <option key={index} value={alpha}>
                  {alpha}
                </option>
              ))}
            </select>
          </div>
        )}

        {highestLowercaseAlphabet && (
          <div>
            <label htmlFor="highest_lowercase_alphabet">Highest Lowercase Alphabet:</label>
            <select id="highest_lowercase_alphabet" className="form-control my-2" disabled>
              <option value={highestLowercaseAlphabet}>
                {highestLowercaseAlphabet}
              </option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
