import Navbar from "@/components/navbar"

export const metadata = {
  title: 'Genuine Feedback',
  description: 'Real feedback from real people',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
      <Navbar></Navbar>{children}</body>
    </html>
  )
}
