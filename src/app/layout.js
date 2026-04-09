import "./globals.css";
import { NotesProvider } from "@/context/NotesContext";
import { FilterProvider } from "@/context/FilterContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "NoteHive",
  description: "A Tag-Based Notes Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NotesProvider>
            <FilterProvider>{children}</FilterProvider>
          </NotesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
