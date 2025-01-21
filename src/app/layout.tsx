import './globals.css'

export const metadata = {
  title: 'XML Görüntüleyici ve Düzenleyici',
  description: 'XML Görüntüleyici ve Düzenleyici',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="dark">
      <body className="dark:bg-gray-900">{children}</body>
    </html>
  )
}
