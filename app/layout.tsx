import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'Table Manager',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme'); if(t==='dark') document.body.classList.add('theme-dark'); else document.body.classList.remove('theme-dark')}catch(e){} })()` }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
