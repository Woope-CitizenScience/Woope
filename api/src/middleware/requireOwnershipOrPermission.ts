import { Request, Response, NextFunction } from 'express';

type OwnershipPermissionOptions<T> = {
  fetchResource: (id: number) => Promise<T | null>;
  permissionOwn: string;
  permissionAll: string;
  extractUserId: (resource: T) => number;
  idSource: 'query' | 'params' | 'body';
  idKey: string;
};

export function requireOwnershipOrPermission<T>({
  fetchResource,
  permissionOwn,
  permissionAll,
  extractUserId,
  idSource,
  idKey
}: OwnershipPermissionOptions<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const rawId = req[idSource]?.[idKey];

      const resourceId = Number(rawId);
      if (!resourceId || isNaN(resourceId)) {
        return res.status(400).json({ error: `Invalid or missing ${idKey}` });
      }

      const resource = await fetchResource(resourceId);
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }

      const isOwner = extractUserId(resource) === user?.user_id;
      const canOwn = user?.permissions?.[permissionOwn];
      const canAll = user?.permissions?.[permissionAll];

      if (!canAll && (!isOwner || !canOwn)) {
        return res.status(403).json({ error: "Insufficient permissions." });
      }

      next();
    } catch (err) {
      console.error("Permission check failed:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
