import categoriesData from '../../../categoriesData.json'
import Category from './Category'
const Categories = () => {
    
  return (
   <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#111827] tracking-tight">
          Browse Categories
        </h2>
        <button className="text-[#00B058] font-semibold text-sm hover:underline cursor-pointer transition-all">
          View all
        </button>
      </div>

      {/*categories grid*/}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {categoriesData.map((category) =>(
          <Category key={category.id} item={category}/>
        ))}
      </div>
      </div>
  )
}

export default Categories
