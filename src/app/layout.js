import "./globals.css";
import { NotesProvider } from "@/context/NotesContext";
import { FilterProvider } from "@/context/FilterContext";

export const metadata = {
  title: "NoteHive",
  description: "A Tag-Based Notes Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NotesProvider>
          <FilterProvider>
            {children}
          </FilterProvider>
        </NotesProvider>
      </body>
    </html>
  );
}
