const Sitemap = [
  {
    key: "listings",
    displayName: "Jobs",
    url: "/listings",
    children: [
      {
        key: "browse_listings",
        displayName: "Browse Jobs",
        url: "/listings/recent",
      },
      {
        key: "search_listings",
        displayName: "Search Jobs",
        url: "/listings/search",
      },
      {
        key: "saved_listings",
        displayName: "Saved Jobs",
        url: "/listings/saved",
        requiredRoles: [2001],
      },
    ],
  },
  {
    key: "applications",
    displayName: "Applications",
    url: "/applications",
    requiredRoles: [2001],
    children: [
      {
        key: "your_applications",
        displayName: "Templates",
        url: "/downloads/templates",
      },
      {
        key: "branding",
        displayName: "Branding",
        url: "/downloads/branding",
      },
      {
        key: "guidelines",
        displayName: "Guidelines",
        url: "/downloads/guidelines",
      },
    ],
  },
  {
    key: "staff",
    displayName: "Staff",
    url: "/staff",
    requiredRoles: [1984],
    children: [
      {
        key: "staff_dashboard",
        displayName: "Dashboard",
        url: "/staff",
        requiredRoles: [1984],
      },
      {
        key: "staff_search_listings",
        displayName: "Search Jobs",
        url: "/staff/listings/search",
        requiredRoles: [1984],
      },
    ],
  },
  {
    key: "admin",
    displayName: "Admin",
    url: "/admin",
    requiredRoles: [5150],
    children: [
      {
        key: "admin_dashboard",
        displayName: "Dashboard",
        url: "/admin",
        requiredRoles: [5150],
      },
    ],
  },
  {
    key: "auth",
    displayName: "Account",
    url: "/auth",
    children: [
      {
        key: "profile",
        displayName: "Profile",
        url: "/profile",
        requiredRoles: [2001, 1984, 5150],
      },
      {
        key: "settings",
        displayName: "Settings",
        url: "/settings",
        requiredRoles: [2001, 1984, 5150],
      },
      {
        key: "login",
        displayName: "Login",
        url: "/auth/login",
        requiredRoles: [2001, 1984, 5150],
        inverted: true,
      },
      {
        key: "register",
        displayName: "Register",
        url: "/auth/register",
        requiredRoles: [2001, 1984, 5150],
        inverted: true,
      },
      {
        key: "logout",
        displayName: "Logout",
        url: "/auth/logout",
        requiredRoles: [2001, 1984, 5150],
      },
    ],
  },
];

export default Sitemap;
