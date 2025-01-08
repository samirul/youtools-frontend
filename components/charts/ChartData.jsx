import { useEffect, useState } from "react";
import axios from "axios";

export const ChartData = (category_id) => {
  const[data, setData] = useState([])
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/results/${category_id}/`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // 'Authorization': `Bearer ${token}`,
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM2MDMxNjExLCJpYXQiOjE3MzYwMzA0MTEsImp0aSI6ImRkMjU2ZDNiMzIwMDQzMTJhOGVmYmY3NTY4MzdjYzEwIiwidXNlcl9pZCI6ImJmMWQ0MzViLTIyNWUtNGE1Yi1iMGQxLTA4NjQyNGNiNGYxZCJ9.1wqItR5TAwSlTs3dsLltWb_DhbEhkoEp4NADijMWUr4`
        }
      });
      const availiableData = response.data.msg.data
      const formattedData = availiableData.map((item) => ({
        main_result: item.main_result,
      }));
      setData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(()=>{
    fetchData();
  }, [])

  let positiveData = [];
  let negativeData = [];
  let neutralData = [];

  data.forEach(item => {
    const percentage = parseInt(item.main_result);
    
    if (item.main_result.includes('Positive')) {
      positiveData.push(percentage);
    } else if(item.main_result.includes('Negative')) {
      negativeData.push(percentage); 
    }else if(item.main_result.includes('Neutral')) {
      neutralData.push(percentage);
    }
  });

  const allValues = [...positiveData, ...negativeData, ...neutralData];

  const totalSum = allValues.reduce((sum, value) => sum + value, 0);

  const sentimentData = [
    { id: 'Positive', value: positiveData.reduce((sum, value) => sum + value, 0) / totalSum * 100},
    { id: 'Negative', value: negativeData.reduce((sum, value) => sum + value, 0) / totalSum * 100},
    { id: 'Neutral', value: neutralData.reduce((sum, value) => sum + value, 0) / totalSum * 100},
  ];

  const positive = sentimentData.find(item => item.id === 'Positive');
  const negative = sentimentData.find(item => item.id === 'Negative');
  const neutral = sentimentData.find(item => item.id === 'Neutral');
  const positiveChartColor = "#f57542"
  const negetiveChartColor = "#f542e3"
  const neutralChartColor = "#adadad"


  const sentimentData_analysis = [

    {
      label: positive.id,
      value: positive.value,
      color: positiveChartColor
    },

    {
      label: negative.id,
      value: negative.value,
      color: negetiveChartColor
    },

    {
      label: neutral.id,
      value: neutral.value,
      color: neutralChartColor
    },

  ];

  const valueFormatter = (item) => `${item.value.toFixed(1)}%`;

  return {
    sentimentData_analysis, valueFormatter
  }

}






