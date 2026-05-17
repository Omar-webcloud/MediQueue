import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-white pt-12 pb-6 mt-auto">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <h4 className="text-lg font-semibold mb-4 text-zinc-100">Learning Services</h4>
          <ul className="space-y-3">
            <li><Link href="/services/math" className="text-zinc-400 hover:text-primary transition-colors text-sm">Math Tutoring</Link></li>
            <li><Link href="/services/science" className="text-zinc-400 hover:text-primary transition-colors text-sm">Science Classes</Link></li>
            <li><Link href="/services/language" className="text-zinc-400 hover:text-primary transition-colors text-sm">Language Arts</Link></li>
            <li><Link href="/services/test-prep" className="text-zinc-400 hover:text-primary transition-colors text-sm">Test Preparation</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4 text-zinc-100">Contact Us</h4>
          <ul className="space-y-3 text-zinc-400 text-sm">
            <li>Email: support@mediqueue.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: 123 Learning Ave, Edu City</li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4 text-zinc-100">Follow Us</h4>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-primary transition-colors text-sm">Facebook</a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-primary transition-colors text-sm">X</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-primary transition-colors text-sm">Instagram</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-primary transition-colors text-sm">LinkedIn</a>
          </div>
        </div>
      </div>
      
      <div className="border-t border-zinc-800 pt-6 text-center text-zinc-500 text-xs">
        <p>&copy; {new Date().getFullYear()} MediQueue. All rights reserved.</p>
      </div>
    </footer>
  );
}
