import './global.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'NutriFit',
  description: 'Personalized recipe recommendations',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        {children}
      </body>
    </html>
  )
}
