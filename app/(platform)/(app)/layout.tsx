import { Navbar } from "./_components/navbar";
import { NavbarBottom } from "./_components/navbar-bottom";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="mt-0 sm:mt-16 h-[calc(100vh-73px)] sm:h-[calc(100vh-64px)] overflow-y-auto md:max-w-screen-2xl mx-auto">
        {children}
      </div>
      <NavbarBottom />
    </>
  );
}
