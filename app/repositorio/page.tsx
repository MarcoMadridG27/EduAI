"use client";

import React, { useState, useEffect } from "react";
import { PublicRepository } from "@/components/public-repository";
import { Navbar } from "@/components/navbar";
import { ProfileModal } from "@/components/profile-modal";
import { useRouter } from "next/navigation";

export default function RepositorioPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    router.push("/");
  };

  return (
    <>
      <Navbar
        user={user}
        currentView="repository"
        onOpenProfile={() => setShowProfileModal(true)}
        onLogout={handleLogout}
      />
      <PublicRepository user={user} />
      {showProfileModal && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfileModal(false)}
          onEditProfile={() => {
            setShowProfileModal(false);
            router.push("/?view=generator");
          }}
        />
      )}
    </>
  );
}
