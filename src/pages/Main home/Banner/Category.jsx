
const Category = ({item}) => {
  return (
    <div className='flex flex-col items-center justify-center p-5 bg-white border border-[#F3F4F6] rounded-2xl transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 cursor-pointer group'>
      

      {/* Dynamic Background Tint Circle */}

      <div className={`w-16 h-16 ${item.bgColor} rounded-full flex items-center justify-center text-3xl mb-4 transition-transform duration-200 group-hover:scale-110`}>
        {item.icon}

      </div>

      {/* Category Text Name */}
      <span className="text-sm font-bold text-[#111827]">
        {item.name}
      </span>
    </div>
  )
}

export default Category
