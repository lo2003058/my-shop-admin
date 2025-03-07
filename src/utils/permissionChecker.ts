/**
 * Checks whether the user has a specific permission for a resource.
 * Supports both specific permissions (e.g., "product:create") and wildcard permissions (e.g., "product:*").
 *
 * @param userPermissions - An array of permissions assigned to the user.
 * @param resource - The resource name (e.g., "product", "user").
 * @param action - The action name (e.g., "create").
 * @returns True if the user has the permission; false otherwise.
 */
export const hasPermission = (
  userPermissions: string[],
  resource: string,
  action: string,
): boolean => {
  const target = `${resource.toLowerCase()}:${action.toLowerCase()}`;
  const wildcard = `${resource.toLowerCase()}:*`;
  return userPermissions.some((perm) => {
    const normalizedPerm = perm.toLowerCase();
    return normalizedPerm === target || normalizedPerm === wildcard;
  });
};
