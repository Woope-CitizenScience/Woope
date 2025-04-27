import { Request, Response, NextFunction } from 'express';

type OwnershipPermissionOptions<T> = {
  fetchResource: (id: number) => Promise<T | null>;
  permissionOwn: string;
  permissionAll: string;
  extractUserId: (resource: T) => number;
  idSource: 'query' | 'params' | 'body';
  idKey: string;
  compareToUser?: (user: any) => number; //makes this optional
};

export function requireOwnershipOrPermission<T>({
  fetchResource,
  permissionOwn,
  permissionAll,
  extractUserId,
  idSource,
  idKey,
  compareToUser, //only for orgs
}: OwnershipPermissionOptions<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const rawId = req[idSource]?.[idKey];

      const resourceId = Number(rawId);
      if (!resourceId || isNaN(resourceId)) {
        return res.status(400).json({ error: `Invalid or missing ${idKey}` });
      }

      const resourceData = await fetchResource(resourceId);
      const resource = Array.isArray(resourceData) ? resourceData[0] : resourceData;
            if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }

      const extractedId = extractUserId(resource);
      const compareId = compareToUser ? compareToUser(user) : user?.user_id;
      
      const isOwner = extractedId === compareId;
      const canOwn = Boolean(user?.permissions?.[permissionOwn]);
      const canAll = Boolean(user?.permissions?.[permissionAll]);

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
