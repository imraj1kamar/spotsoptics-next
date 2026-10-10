// src/lib/auditLog.js
import { prisma } from '@/lib/prisma';

/**
 * Helper to extract client IP address accurately from Next.js request
 */

export function extractClientIp(request) {
  if (!request) return '127.0.0.1';
  try {
    const cfIp = request.headers?.get('cf-connecting-ip');
    if (cfIp) return cfIp.trim();

    const forwardedFor = request.headers?.get('x-forwarded-for');
    if (forwardedFor) return forwardedFor.split(',')[0].trim();

    const realIp = request.headers?.get('x-real-ip');
    if (realIp) return realIp.trim();

    if (request.ip) return request.ip;
  } catch (e) {
    // Ignore error
  }
  return '127.0.0.1';
}

/**
 * Utility function to create an activity log entry in database safely.
 */
export async function createActivityLog({
  userId = null,
  action,
  module = 'GENERAL',
  details = null,
  targetId = null,
  oldData = null,
  newData = null,
  request = null,
}) {
  if (!action) return null;

  try {
    let validUserId = null;
    const uid = Number(userId || 0);

    if (uid > 0) {
      try {
        const u = await prisma.user.findUnique({
          where: { id: uid },
          select: { id: true },
        });
        if (u) validUserId = u.id;
      } catch (e) {
        validUserId = null;
      }
    }

    const clientIp = extractClientIp(request);
    const userAgent = request?.headers?.get('user-agent') || 'Unknown Browser';

    const log = await prisma.activityLog.create({
      data: {
        userId: validUserId,
        action: String(action),
        module: String(module),
        details: details ? String(details) : null,
        targetId: targetId ? Number(targetId) : null,
        oldData: oldData ? (typeof oldData === 'string' ? oldData : JSON.stringify(oldData)) : null,
        newData: newData ? (typeof newData === 'string' ? newData : JSON.stringify(newData)) : null,
        ipAddress: clientIp,
        userAgent: userAgent,
        status: 1,
      },
    });

    return log;
  } catch (err) {
    console.warn('Failed to insert activity log:', err.message);
    return null;
  }
}
