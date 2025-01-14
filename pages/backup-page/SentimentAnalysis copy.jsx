import React from 'react'
import SearchBar from '../components/SearchBar'
import Progressbar from '../components/Progressbar'
import CategoriesCard from '../components/CategoriesCard'

const SentimentAnalysis = () => {
  return (
    <>
    <div className='sentiment-analysis-container'>
        <main className='grid-container-analysis'>
            <div className="sentiment-analysis-loading">
                <Progressbar/>
            </div>
            <div className="sentiment-analysis-Searchbar">
                <SearchBar/>
            </div>
            <div className="sentiment-analysis-Categories">
                <CategoriesCard/>
            </div>
        </main>
        </div>
    </>
    
  );
};

export default SentimentAnalysis
