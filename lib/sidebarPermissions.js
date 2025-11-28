// lib/sidebarPermissions.ts

/**
 * Utility functions for filtering sidebar navigation based on permissions
 */

/**
 * Check if user has ANY permission (read, add, update, or delete)
 */
export const hasAnyPermission = (permissions) => {
  if (!permissions) return false;
  return (
    permissions.read ||
    permissions.add ||
    permissions.update ||
    permissions.delete
  );
};

/**
 * Check if user has at least read permission
 */
export const hasReadPermission = (permissions) => {
  return permissions?.read === true;
};

/**
 * Filter a single navigation item and its subitems
 */
export const filterNavItem = (item) => {
  // Filter subitems first if they exist
  const filteredSubItems = item.subItems
    ? item.subItems.map(filterNavItem).filter((subItem) => subItem !== null)
    : [];

  // If item has subitems
  if (item.subItems && item.subItems.length > 0) {
    // Only keep parent if it has accessible subitems
    if (filteredSubItems.length > 0) {
      return {
        ...item,
        subItems: filteredSubItems,
      };
    }
    // No accessible subitems, don't show parent
    return null;
  }

  // For items without subitems, check their own permissions
  if (hasReadPermission(item.permissions)) {
    return item;
  }

  return null;
};

/**
 * Filter navigation sections based on permissions
 * Only shows items where user has at least read permission
 */
export const filterNavigationByPermissions = (navigation) => {
  if (!Array.isArray(navigation)) return [];

  return navigation
    .map((section) => {
      const filteredItems = section.items
        .map(filterNavItem)
        .filter((item) => item !== null);

      // Only include section if it has items
      if (filteredItems.length > 0) {
        return {
          ...section,
          items: filteredItems,
        };
      }

      return null;
    })
    .filter((section) => section !== null);
};

/**
 * Check if a specific section has any accessible items
 */
export const sectionHasAccessibleItems = (section) => {
  return section.items.some((item) => {
    if (item.subItems && item.subItems.length > 0) {
      return item.subItems.some((subItem) =>
        hasReadPermission(subItem.permissions)
      );
    }
    return hasReadPermission(item.permissions);
  });
};

/**
 * Count total accessible menu items
 */
export const countAccessibleItems = (navigation) => {
  let count = 0;

  navigation.forEach((section) => {
    section.items.forEach((item) => {
      if (item.subItems && item.subItems.length > 0) {
        item.subItems.forEach((subItem) => {
          if (hasReadPermission(subItem.permissions)) count++;
        });
      } else {
        if (hasReadPermission(item.permissions)) count++;
      }
    });
  });

  return count;
};

/**
 * Get first accessible URL from navigation
 * Useful for redirecting to default page
 */
export const getFirstAccessibleUrl = (navigation) => {
  for (const section of navigation) {
    for (const item of section.items) {
      // Check subitems first
      if (item.subItems && item.subItems.length > 0) {
        for (const subItem of item.subItems) {
          if (hasReadPermission(subItem.permissions) && subItem.url) {
            return subItem.url;
          }
        }
      }

      // Check main item
      if (hasReadPermission(item.permissions) && item.url) {
        return item.url;
      }
    }
  }

  return null;
};

/**
 * Check if user can access a specific URL
 */
export const canAccessUrl = (navigation, targetUrl) => {
  const cleanUrl = targetUrl.split("?")[0].replace(/\/$/, "");

  for (const section of navigation) {
    for (const item of section.items) {
      // Check subitems
      if (item.subItems && item.subItems.length > 0) {
        for (const subItem of item.subItems) {
          const subUrl = subItem.url?.split("?")[0].replace(/\/$/, "");
          if (cleanUrl === subUrl || cleanUrl.startsWith(subUrl + "/")) {
            return hasReadPermission(subItem.permissions);
          }
        }
      }

      // Check main item
      const itemUrl = item.url?.split("?")[0].replace(/\/$/, "");
      if (cleanUrl === itemUrl || cleanUrl.startsWith(itemUrl + "/")) {
        return hasReadPermission(item.permissions);
      }
    }
  }

  return false;
};

/**
 * Get all accessible URLs from navigation
 */
export const getAllAccessibleUrls = (navigation) => {
  const urls = [];

  navigation.forEach((section) => {
    section.items.forEach((item) => {
      if (item.subItems && item.subItems.length > 0) {
        item.subItems.forEach((subItem) => {
          if (hasReadPermission(subItem.permissions) && subItem.url) {
            urls.push(subItem.url);
          }
        });
      } else {
        if (hasReadPermission(item.permissions) && item.url) {
          urls.push(item.url);
        }
      }
    });
  });

  return urls;
};

/**
 * Get permission summary for debugging
 */
export const getPermissionSummary = (navigation) => {
  const summary = {
    totalSections: navigation.length,
    accessibleSections: 0,
    totalItems: 0,
    accessibleItems: 0,
    deniedItems: 0,
    itemDetails: [],
  };

  navigation.forEach((section) => {
    const hasAccess = sectionHasAccessibleItems(section);
    if (hasAccess) summary.accessibleSections++;

    section.items.forEach((item) => {
      if (item.subItems && item.subItems.length > 0) {
        item.subItems.forEach((subItem) => {
          summary.totalItems++;
          const canAccess = hasReadPermission(subItem.permissions);
          if (canAccess) summary.accessibleItems++;
          else summary.deniedItems++;

          summary.itemDetails.push({
            title: `${item.title} > ${subItem.title}`,
            url: subItem.url || "",
            hasAccess: canAccess,
            permissions: subItem.permissions || {
              read: false,
              add: false,
              update: false,
              delete: false,
            },
          });
        });
      } else {
        summary.totalItems++;
        const canAccess = hasReadPermission(item.permissions);
        if (canAccess) summary.accessibleItems++;
        else summary.deniedItems++;

        summary.itemDetails.push({
          title: item.title,
          url: item.url || "",
          hasAccess: canAccess,
          permissions: item.permissions || {
            read: false,
            add: false,
            update: false,
            delete: false,
          },
        });
      }
    });
  });

  return summary;
};

// ==================== USAGE EXAMPLES ====================

/*
// Example 1: Using in sidebar component
import { filterNavigationByPermissions } from "@/lib/sidebarPermissions";

function Sidebar() {
  const { mainNavigation } = useNavigation();
  const filteredNav = useMemo(
    () => filterNavigationByPermissions(mainNavigation),
    [mainNavigation]
  );

  return (
    <nav>
      {filteredNav.map(section => (
        <div key={section.title}>
          <h3>{section.title}</h3>
          {section.items.map(item => (
            <MenuItem key={item.title} item={item} />
          ))}
        </div>
      ))}
    </nav>
  );
}

// Example 2: Check if user can access URL
import { canAccessUrl } from "@/lib/sidebarPermissions";

function ProtectedPage() {
  const { mainNavigation } = useNavigation();
  const pathname = usePathname();
  
  const hasAccess = canAccessUrl(mainNavigation, pathname);
  
  if (!hasAccess) {
    return <UnauthorizedPage />;
  }
  
  return <PageContent />;
}

// Example 3: Get first accessible page for redirect
import { getFirstAccessibleUrl } from "@/lib/sidebarPermissions";

function LoginRedirect() {
  const { mainNavigation } = useNavigation();
  const firstUrl = getFirstAccessibleUrl(mainNavigation);
  
  if (firstUrl) {
    router.push(firstUrl);
  } else {
    router.push("/no-access");
  }
}

// Example 4: Debug permissions
import { getPermissionSummary } from "@/lib/sidebarPermissions";

function PermissionDebugger() {
  const { mainNavigation } = useNavigation();
  const summary = getPermissionSummary(mainNavigation);
  
  console.log("Permission Summary:", summary);
  // Output:
  // {
  //   totalSections: 2,
  //   accessibleSections: 1,
  //   totalItems: 5,
  //   accessibleItems: 3,
  //   deniedItems: 2,
  //   itemDetails: [...]
  // }
}

// Example 5: Count accessible items
import { countAccessibleItems } from "@/lib/sidebarPermissions";

function NavigationStats() {
  const { mainNavigation } = useNavigation();
  const count = countAccessibleItems(mainNavigation);
  
  return <div>You have access to {count} modules</div>;
}
*/
