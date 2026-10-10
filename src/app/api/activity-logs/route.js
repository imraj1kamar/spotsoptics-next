// app/api/activity-logs/route.js
import { GET as getLogsHandler, POST as postLogsHandler } from '../audit/logs/route';

export async function GET(request) {
  return getLogsHandler(request);
}

export async function POST(request) {
  return postLogsHandler(request);
}
