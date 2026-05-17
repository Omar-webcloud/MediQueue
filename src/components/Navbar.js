"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">Website Name</Link>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/tutors">Tutors</Link>
        </li>
        {isLoggedIn && (
          <>
            <li>
              <Link href="/add-tutor">Add Tutor</Link>
            </li>
            <li>
              <Link href="/my-tutors">My Tutors</Link>
            </li>
            <li>
              <Link href="/my-sessions">My Booked Sessions</Link>
            </li>
          </>
        )}
      </ul>
      <div className={styles.auth}>
        {!isLoggedIn ? (
          <div className={styles.authLinks}>
            <Link href="/login">Login</Link>
            <Link href="/register" className={styles.registerBtn}>Register</Link>
            <button onClick={() => setIsLoggedIn(true)} className={styles.mockToggle}>Mock Login</button>
          </div>
        ) : (
          <div className={styles.profileMenu}>
            <img 
              src="https://via.placeholder.com/40" 
              alt="Profile" 
              className={styles.profileImg} 
              onClick={() => setDropdownOpen(!dropdownOpen)} 
            />
            {dropdownOpen && (
              <div className={styles.dropdown}>
                <Link href="/profile" onClick={() => setDropdownOpen(false)}>Profile Page</Link>
                <button onClick={() => {
                  setIsLoggedIn(false);
                  setDropdownOpen(false);
                }}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
