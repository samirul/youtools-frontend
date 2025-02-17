import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ReactMarkdown from "react-markdown";

const AboutUs = () => {
    const [aboutData, setAboutData] = useState([]);

    const fetchData = async () => {
        const response = await axios.get("http://localhost/api/others/about-us/", {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        console.log(response)
        setAboutData(response.data);
    }

    useEffect(()=>{
        fetchData();
    },[])
    return (
        <>
            <div className="about-page" style={{ whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
                <main className="grid-container-about-us">
                    {aboutData ? aboutData.map((data, index)=>(
                    <div className="about-container" key={index}>
                        <div className="about-title">
                            <h1 className='about-title-text'>
                                {data.title}
                            </h1>
                        </div>
                        <div className="about-description">
                            <div className="about-description-text">
                                <ReactMarkdown>{data.description}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                    )): ""}
                </main>
            </div>
        </>
    )
}

export default AboutUs
