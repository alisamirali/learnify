import { Footer } from "./_components/footer";
import { Navbar } from "./_components/navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 flex-1 md:px-6 lg:px-8 mb-32">
        {children}
      </main>
      <Footer />
    </div>
  );
}
