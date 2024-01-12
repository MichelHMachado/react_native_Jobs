import { useState, useEffect } from "react";
import axios from "axios";
import { jobdata } from "../constants/jobData";

const useFetch = (endpoint, query) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const options = {
    method: "GET",
    url: `https://jsearch.p.rapidapi.com/${endpoint}`,
    headers: {
      "X-RapidAPI-Key": process.env.EXPO_PUBLIC_RAPID_API_KEY,
      "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    },
    params: { ...query },
  };

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const shouldMakeRequest = true;

      if (shouldMakeRequest) {
        const response = await axios.request(options);
        setData(response.data.data);
      } else {
        setData(jobdata); // Use jobData as fake data
      }

      setIsLoading(false);
    } catch (error) {
      if (error.response.status === 429) {
        // Rate limit exceeded (status 429)
        setData(jobdata); // Use jobData as fake data
      } else {
        setError(error);
        alert("There is an error");
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    setIsLoading(true);
    fetchData();
  };

  return { data, isLoading, error, refetch };
};

export default useFetch;
