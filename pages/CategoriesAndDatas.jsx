import React from 'react'
import Chart from '../components/charts/chart'
import Tables from '../components/Tables'
import { useParams } from 'react-router-dom';


const CategoriesAndDatas = () => {
    const { category_id } = useParams();
    return (
        <>
            <div className="data-container">
                <main className="grid-data-container">
                    <div className="categories-chart-data">
                        <Chart category_id={category_id} />
                    </div>
                    <div className="categories-table-data">
                       <Tables category_id={category_id}/>
                    </div>
                </main>
            </div>
        </>
    )
}

export default CategoriesAndDatas
