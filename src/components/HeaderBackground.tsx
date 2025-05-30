import { ReactNode } from 'react'

interface HeaderBackgroundProps {
  srcImg: string
  children: ReactNode
}

export const HeaderBackground = ({ srcImg, children }: HeaderBackgroundProps) => {
  return (
    <>
      {srcImg ? (
        <div className="outer site-header-background responsive-header-img" style={{ backgroundImage: `url(${srcImg})` }}>
          {children}
        </div>
      ) : (
        <div className="outer site-header-background no-image">{children}</div>
      )}
    </>
  )
}
