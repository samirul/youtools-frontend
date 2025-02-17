import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ReactMarkdown from "react-markdown";

const PrivacyPolicy = () => {
    const [privacyData, setPrivacyData] = useState([]);

    const fetchData = async () => {
        const response = await axios.get("http://localhost/api/others/privacy-policy/", {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        console.log(response)
        setPrivacyData(response.data);
    }

    useEffect(()=>{
        fetchData();
    },[])
    return (
        <>
            <div className="privacy-page" style={{ whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
                <main className="grid-container-privacy-policy">
                    {privacyData ? privacyData.map((data, index)=>(
                    <div className="privacy-container" key={index}>
                        <div className="privacy-title">
                            <h1 className='privacy-title-text'>
                                {data.title}
                            </h1>
                        </div>
                        <div className="privacy-description">
                            <div className="privacy-description-text">
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

export default PrivacyPolicy

