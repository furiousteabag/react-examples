import './App.css';
import {data} from './data';
import './index.css';


function ProductRow({name, price, stocked}) {
    return (
        <tr>
            <td className={stocked ? 'text-black' : 'text-red-600'}>{name}</td>
            <td>{price}</td>
        </tr>
    )
}

function ProductCategoryRow({category}) {
    return <tr><th colSpan={2}>{category}</th></tr>
}

function ProductTable({products}) {

    function drawTable() {
        const categories = new Set(products.map(item => {return item.category}))

        let rows = []
        categories.forEach(category => {
            rows.push(<ProductCategoryRow category={category} key={`category-${category}`} />)
            products.forEach(product => {
                if (product.category === category) {
                    rows.push(
                        <ProductRow
                            name={product.name}
                            price={product.price}
                            stocked={product.stocked}
                            key={`product-${product.name}`}
                        />
                    )
                }

            })
        })
        return (
            <>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </>
        )
    }

    return drawTable()
}

function SearchBar() {
    return (
        <div className='flex flex-col'>
            <input type='text' placeholder='Search...' />
            <div>
                <input type='checkbox' />
                <label className='ml-3'>Only show products in stock</label>
            </div>
        </div>
    )
}

export default function FilterableProductTable() {

    return (
        <div className='m-4'>
            <SearchBar />
            <ProductTable products={data} />
        </div>
    );
}
