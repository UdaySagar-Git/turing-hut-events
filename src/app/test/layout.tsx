interface MDXPage{
  children:React.ReactNode
}

export default function layout({children}:MDXPage){
  return(
    <div className="flex justify-center pt-20 bg-black text-white">
      <div className="">{children}</div>
    </div>
  )
}
