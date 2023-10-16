import { useState } from "react"
import "./App.css"
import { data } from "./data"
import "./index.css"

function ProductRow({ name, price, stocked }) {
  return (
    <tr>
      <td className={stocked ? "text-black" : "text-red-600"}>{name}</td>
      <td>{price}</td>
    </tr>
  )
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan={2}>{category}</th>
    </tr>
  )
}

function ProductTable({ products, filterText, inStockOnly }) {
  function drawTable() {
    const categories = new Set(
      products.map((item) => {
        return item.category
      }),
    )

    let rows = []

    let prevCategory = ""
    categories.forEach((category) => {
      products.forEach((product) => {
        if (
          product.category === category &&
          product.name.toLowerCase().includes(filterText) &&
          (!inStockOnly || product.stocked)
        ) {
          if (category !== prevCategory) {
            rows.push(
              <ProductCategoryRow
                category={category}
                key={`category-${category}`}
              />,
            )
            prevCategory = category
          }
          rows.push(
            <ProductRow
              name={product.name}
              price={product.price}
              stocked={product.stocked}
              key={`product-${product.name}`}
            />,
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
          <tbody>{rows}</tbody>
        </table>
      </>
    )
  }

  return drawTable()
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange,
}) {
  return (
    <form className="flex flex-col">
      <input
        type="text"
        placeholder="Search..."
        value={filterText}
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
        />{" "}
        Only show products in stock
      </label>
    </form>
  )
}

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState("")
  const [inStockOnly, setInStockOnly] = useState(false)

  return (
    <div className="m-4">
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly}
      />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly}
      />
    </div>
  )
}

export default function App() {
  return <FilterableProductTable products={data} />
}
