import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Learning Services</h4>
          <ul className={styles.linkList}>
            <li><Link href="/services/math">Math Tutoring</Link></li>
            <li><Link href="/services/science">Science Classes</Link></li>
            <li><Link href="/services/language">Language Arts</Link></li>
            <li><Link href="/services/test-prep">Test Preparation</Link></li>
          </ul>
        </div>
        
        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Contact Us</h4>
          <ul className={styles.contactList}>
            <li>Email: support@mediqueue.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: 123 Learning Ave, Edu City</li>
          </ul>
        </div>
        
        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Follow Us</h4>
          <div className={styles.socialLinks}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} MediQueue. All rights reserved.</p>
      </div>
    </footer>
  );
}
