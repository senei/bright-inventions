import * as React from 'react'

export interface IButton extends React.HTMLProps<HTMLButtonElement> {}

export const Button: React.FC<IButton> = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>
}
