"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SubscriptionsSection } from "@/components/subscriptions-section";
import { Navbar } from "@/components/navbar";
import { ProfileModal } from "@/components/profile-modal";

export function SuscripcionesPageClient() {
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
        currentView="subscriptions"
        onOpenProfile={() => setShowProfileModal(true)}
        onLogout={handleLogout}
      />
      <SubscriptionsSection
        user={user}
        onNavigateToGenerator={() => router.push("/?view=generator")}
        onNavigateToRepo={() => router.push("/repositorio")}
        onBack={() => router.push(user ? "/?view=generator" : "/")}
        onLoginRequired={() => router.push("/auth")}
      />
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
