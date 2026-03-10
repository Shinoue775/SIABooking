"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function CallbackPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data.user;

        if (!user?.email) {
          alert("Login failed. Please try again.");
          router.replace("/login");
          return;
        }

        const email = user.email;

        if (!email.endsWith("@gordoncollege.edu.ph")) {
          await supabase.auth.signOut();
          alert("Please use your Gordon College Google account.");
          router.replace("/login");
          return;
        }

        const fullName = user.user_metadata.full_name || "";
        let fname = fullName.split(" ")[0] || "";
        let lname = fullName.split(" ").slice(1).join(" ") || "";

        if (!fname) fname = email.split("@")[0];
        if (!lname) lname = "";

        const { error: insertError } = await supabase
          .from("users")
          .upsert({
            id: user.id,
            fname,
            lname,
            role: "user"
          })
          .select();

        if (insertError) {
          console.error("Error creating user profile:", insertError.message);
        }

        router.replace("/home");

      } catch (err) {
        console.error(err);
        alert("An unexpected error occurred. Please try again.");
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-700 text-lg">
        {loading ? "Signing you in..." : "Redirecting..."}
      </p>
    </div>
  );
}