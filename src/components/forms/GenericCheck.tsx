import React from 'react'

interface CheckProps{
    value:number|string,
    onChange?:(e: React.ChangeEvent<HTMLInputElement>)=>void,
    checked?:boolean,
  }
  
  const Check = ({value,onChange, checked}:CheckProps) =>{
    return (
      <input
                  name={""}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 focus:bg-transparent text-slate-600 focus:ring-transparent"
                  onChange={(e) => onChange && onChange(e)}
                  value={value}
                  defaultChecked={checked}
                />
    )
  }

export default Check