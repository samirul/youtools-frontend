import React from 'react'
import InputBar from '../components/InputBar'
import ImageLoading from '../components/ImageLoading'

const TextToImage = () => {
  return (
    <>
      <div className='text-to-image-container'>
        <main className='grid-container-text'>
            <div className="text2image-loading">
                <ImageLoading/>
            </div>
            <div className="text2image-inputbar">
                <InputBar/>
            </div>
        </main>
      </div>
    </>
  )
}

export default TextToImage
