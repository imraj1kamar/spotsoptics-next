// app/api/users/create/route.js
import { POST as createUserHandler } from '../route';

export async function POST(request) {
  return createUserHandler(request);
}
