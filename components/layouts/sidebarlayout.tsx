// SidebarLayout.tsx
"use client";
import { ReactNode, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation"; // Import usePathname
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconSettings,
  IconHome,
  IconMessage2Code,
  IconLogout2,
  IconUserHeart,
  IconHeart,
} from "@tabler/icons-react";
import { useSidebar } from "@/components/ui/sidebar";
import AuthGuard from "@/guard/authguard";
import { shortTestimonials } from "@/components/ui/friends";
import DisableRightClick from "../../components/disablerightclick";
import Image from "next/image"; // Import Image from next/image
  
  const UserAvatar = ({ username }: { username: string }) => {
    const { open } = useSidebar();
    const [profileImage, setProfileImage] = useState<string>(
      "/img/guestavatar.svg"
    );
  
    useEffect(() => {
      const fetchProfile = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
          const res = await fetch("/api/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            const matchedFriend = shortTestimonials.find(
              (friend) => friend.email === data.user.email
            );
            if (matchedFriend) {
              setProfileImage(matchedFriend.src);
            }
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };
      fetchProfile();
    }, []);
  
    return (
      <div className="flex items-center gap-5 py-3 border-t pt-25 border-neutral-300 dark:border-neutral-700">
        <div className="relative h-6 w-6 flex-shrink-0 overflow-hidden rounded-full">
          <DisableRightClick>
            <Image
              src={profileImage}
              alt="Profile"
              width={40} // Set fixed width
              height={40} // Use objectFit to maintain aspect ratio
              className="h-full w-full"
            />
          </DisableRightClick>
        </div>
        <span
          className={`text-neutral-700 dark:text-neutral-200 text-lg font-medium overflow-hidden whitespace-nowrap transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0 w-0"
          }`}
        >
          {username}
        </span>
      </div>
    );
  };

const SidebarLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname(); // Get current path
  const [username, setUsername] = useState("Guest");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUsername(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleHomeClick = () => {
    if (pathname === "/community") {
      router.refresh(); // Refresh the component if already on the home page
    } else {
      router.push("/community"); // Navigate to the home page if not already there
    }
  };

  const links = [
    {
      label: "Home",
      href: "/community",
      icon: <IconHome className="h-8 w-8" />,
      onClick: handleHomeClick, // Add onClick handler
    },
    { label: "My Verso", href: "/aboutme", icon: <IconHeart className="h-8 w-8" /> },
    { label: "Profile", href: "/profile", icon: <IconUserHeart className="h-8 w-8" /> },
    { label: "Feedback", href: "/feedback", icon: <IconMessage2Code className="h-8 w-8" /> },
    { label: "Settings", href: "/settings", icon: <IconSettings className="h-8 w-8" /> },
    {
      label: "Logout",
      href: "#", // Changed href to "#" to prevent navigation
      icon: <IconLogout2 className="h-8 w-8" />,
      onClick: handleLogout,
    },
  ];

  return (
    <AuthGuard>
      <div className="flex h-screen flex-wrap">
        <Sidebar>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} /> // Pass link object to SidebarLink
                ))}
              </div>
            </div>
            <UserAvatar username={username} />
          </SidebarBody>
        </Sidebar>

        <div className="flex-1">{children}</div>
      </div>
    </AuthGuard>
  );
};

export default SidebarLayout;