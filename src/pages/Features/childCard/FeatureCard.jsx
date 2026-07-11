
const FeatureCard = ({item}) => {
  if (!item) return null 
  return (
    <div className='flex items-center gap-5 p-6 bg-white border border-[#F3F4F6] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-200'>
      
      {/*icon container*/}

      <div className='flex-shrink-0 flex items-center justify-center'>
        {item.icon}
      </div>

{/*text container*/}

      <div className='flex flex-col text-left'>
        <span className=' text-lg font-bold text-[#111827] tracking-tight leading-tight'>
          {item.title}
        </span>

        <span className='text-sm font-medium text-[#6B7280] mt-0.5'>
          {item.subtitle}
        </span>
      </div>
    </div>
  )
}

export default FeatureCard
