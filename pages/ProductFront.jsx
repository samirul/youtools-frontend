import React from 'react'
import ProductCards from '../components/ProductCards'

const ProductFront = () => {
    return (
        <>
            <div className='products-container'>
                <main className='grid-container-products'>
                    <div className="cards-productfront">
                        <ProductCards />
                    </div>
                </main>
            </div>
        </>
    )
}

export default ProductFront
