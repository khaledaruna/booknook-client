import { Geist } from "next/font/google";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function HomePage() {
  return (
    <main>
      <h1>Welcome to BookNook</h1>
      <p>Your little corner of books.</p>
    </main>
  );
}