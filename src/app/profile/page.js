"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";

const avatars = [
  "/man 1.jpg",
  "/man 2.jpg",
  "/man 3.jpg",
  "/woman.jpg",
  "/woman 2.avif"
];

export default function ProfilePage() {
  const { user, setUser, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      setName(user.name || "");
      setSelectedPhoto(user.photo || avatars[0]);
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      const res = await apiFetch("/api/auth/update-profile", {
        method: "PUT",
        body: JSON.stringify({ name, photo: selectedPhoto })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <div className="bg-white dark:bg-card border dark:border-border rounded-lg shadow-sm p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">My Profile</h1>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-gray-200 dark:border-border">
              <img src={selectedPhoto} alt="Selected Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center mb-2">Choose your avatar</label>
              <div className="flex flex-wrap justify-center gap-3">
                {avatars.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setSelectedPhoto(avatar)}
                    className={`w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 transition-all object-cover hover:scale-105 ${selectedPhoto === avatar ? "border-primary ring-2 ring-primary/30" : "border-transparent"}`}
                  >
                    <img src={avatar} alt="Avatar option" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <input
              type="email"
              disabled
              value={user.email || ""}
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800/50 dark:border-border dark:text-gray-400 text-sm cursor-not-allowed bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Account Role</label>
            <input
              type="text"
              disabled
              value={user.role || "student"}
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800/50 dark:border-border dark:text-gray-400 text-sm cursor-not-allowed bg-gray-50 capitalize"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary dark:bg-background dark:border-border dark:text-foreground text-sm"
              placeholder="Enter your name"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2.5 rounded-md text-sm transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Saving changes..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
