# DrawDesk Interview Questions and Simple Answers

## 1) Project Overview
1. **What is DrawDesk?**  
   DrawDesk is a real-time collaborative whiteboard app where users can create rooms, join rooms, and draw together live.

2. **What tech stack did you use?**  
   MERN-style stack: React (Vite) on frontend, Node.js + Express backend, MongoDB with Mongoose, and Socket.IO for real-time sync.

3. **Why did you choose Socket.IO?**  
   It gives event-based, low-latency communication and room support, which is perfect for collaborative whiteboards.

4. **What are the core modules of this project?**  
   Authentication, room management, whiteboard collaboration, and real-time board persistence.

## 2) Architecture
5. **How is the backend structured?**  
   It is split into routes, controllers, models, middleware, and socket handlers.

6. **How is the frontend structured?**  
   It uses pages, components, API service files, context for auth state, and socket utilities.

7. **How do frontend and backend communicate?**  
   REST APIs for auth/room CRUD and Socket.IO events for whiteboard live updates.

8. **Why keep both REST and sockets?**  
   REST is good for request-response operations; sockets are best for continuous real-time updates.

## 3) Authentication & Security
9. **How does login work?**  
   User sends email/password, backend verifies with bcrypt, then returns access token + refresh token.

10. **Why hash passwords?**  
    Hashing prevents storing plain-text passwords and reduces risk if the database is leaked.

11. **What is the role of access token?**  
    It authorizes protected API requests and has short lifetime.

12. **What is the role of refresh token?**  
    It is used to get a new access token without forcing user to log in again.

13. **Where are tokens stored in your app?**  
    Access token is stored in memory; refresh token is stored in localStorage.

14. **How are protected routes handled on backend?**  
    `authMiddleware` verifies JWT from `Authorization` header before allowing access.

15. **How are protected routes handled on frontend?**  
    `ProtectedRoute` checks auth context and redirects unauthenticated users to login.

16. **How does token refresh happen automatically?**  
    Axios response interceptor catches 401, calls refresh API, sets new access token, and retries request.

17. **How does forgot-password flow work?**  
    Generate reset token, save token+expiry in DB, send reset link via email, then allow password reset.

18. **How is reset token expiry checked?**  
    Backend queries user by token and ensures expiry timestamp is still greater than current time.

19. **What security improvements can be added?**  
    Use HTTP-only cookies for refresh token, rate limiting, stronger validation, and stricter CORS.

## 4) Room Management
20. **How is a room created?**  
    Frontend sends roomId, roomName, user email; backend stores it in MongoDB.

21. **How are user rooms fetched?**  
    Backend filters rooms by `createdBy` email and returns sorted list.

22. **How do rename and delete work?**  
    Backend updates/deletes room by `roomId` through protected endpoints.

23. **Why use UUID for room IDs?**  
    UUID is globally unique and reduces collision chance.

## 5) Real-Time Whiteboard
24. **What happens when a user opens a board?**  
    Client emits `join-room` and `get-board`; server returns current board elements.

25. **How are drawings synced?**  
    On each update, client emits `board-update`; server stores data and broadcasts to others in same room.

26. **How is board data persisted?**  
    `elements` array is saved in the Room document in MongoDB.

27. **How do you avoid infinite socket update loops?**  
    A local `isRemoteUpdate` flag prevents re-emitting updates received from server.

28. **How do users leave a room?**  
    Client emits `leave-room` and socket also handles cleanup on disconnect.

29. **What drawing tools are implemented?**  
    Pen, eraser, laser pointer, highlight, rectangle, circle, line, arrow, text, move/transform.

30. **How is undo/redo implemented?**  
    Current lines are tracked in state and previous snapshots are pushed into an undo stack.

31. **How is zoom handled?**  
    Mouse wheel adjusts stage scale and position to zoom relative to pointer.

32. **How is export image done?**  
    Konva stage converts to data URL and downloads as PNG.

## 6) Frontend State & UX
33. **Why use React Context for auth?**  
    It provides global auth state to all components without prop drilling.

34. **Why hide navbar on whiteboard route?**  
    To maximize drawing area and reduce UI distraction.

35. **Why show a mobile blocker?**  
    Whiteboard interaction is optimized for larger screens and better pointer control.

36. **How do you notify users of actions/errors?**  
    `react-hot-toast` shows quick feedback for success/failure events.

## 7) Database Design
37. **Why separate User and Room collections?**  
    It keeps auth data separate from collaboration data and simplifies maintenance.

38. **What is stored in Room model?**  
    Room ID, room name, createdBy email, createdAt, and board elements.

39. **What are possible DB optimizations?**  
    Add indexes for query-heavy fields and optionally split board snapshots/history into separate collection.

## 8) API & Error Handling
40. **How do you handle API errors?**  
    Controller-level try/catch returns proper status codes and messages; frontend shows toast messages.

41. **How do you handle expired/invalid tokens?**  
    Backend returns 401/403; frontend attempts refresh then redirects to login if refresh fails.

42. **How do you validate request input currently?**  
    Mostly through required fields and backend checks; a schema validator can be added for stronger validation.

## 9) Deployment & Env
43. **How do you manage environment-specific configs?**  
    Use `.env` for secrets/URLs and fallback defaults in code for local development.

44. **What CORS setup is used?**  
    Backend allows configured frontend origin and credentials.

45. **What would you do before production release?**  
    Add logging, monitoring, rate limiting, input validation, tests, and token hardening.

## 10) Testing & Reliability
46. **What should be unit tested first?**  
    Auth controller logic, token generation/verification, and room controller behavior.

47. **What integration tests are important?**  
    Login-refresh-me flow, room CRUD APIs, and board update persistence.

48. **How would you test real-time features?**  
    Simulate multiple socket clients joining same room and verify event propagation + DB writes.

49. **What failure scenario is critical?**  
    Client disconnect/reconnect during drawing; app should reload board from DB and continue.

## 11) Performance & Scalability
50. **What are current scaling limits?**  
    Very large element arrays and high-frequency updates can increase DB writes and payload size.

51. **How can you optimize drawing sync?**  
    Use throttling/debouncing, delta updates, and compression instead of full-board payloads each time.

52. **How can Socket.IO scale horizontally?**  
    Use a shared adapter (like Redis adapter) to synchronize events across server instances.

53. **How can DB writes be reduced?**  
    Batch updates periodically or save checkpoints instead of every minor pointer move.

## 12) Common “Why” Questions
54. **Why not use WebRTC for this app?**  
    Socket.IO + server persistence is simpler for this use case and easier to manage state history.

55. **Why keep access token in memory?**  
    It reduces long-term exposure in browser storage and lowers risk from token theft.

56. **Why store refresh token in DB?**  
    So backend can verify token ownership and reject unknown tokens.

57. **Why use Konva instead of plain canvas APIs?**  
    Konva gives React-friendly shape abstraction, events, transforms, and easier tool development.

## 13) Improvement/Future Scope
58. **What major features can be added next?**  
    Multi-page boards, chat, comments, role-based permissions, and version history.

59. **How would you add collaboration cursors?**  
    Emit cursor position events and render remote cursor markers in each room.

60. **How would you add board history/versioning?**  
    Save periodic snapshots with timestamps and allow users to restore selected versions.

61. **How would you improve security of reset-password feature?**  
    Hash reset tokens in DB, shorten expiry, and avoid returning reset link in API response.

62. **How would you improve authorization in rooms?**  
    Add room membership/permissions and verify access before allowing board socket events.

## 14) HR + Ownership Questions
63. **What was the most challenging part in this project?**  
    Keeping real-time board sync smooth while avoiding duplicate/infinite update cycles.

64. **What did you personally build end-to-end?**  
    Auth flow, protected APIs, room lifecycle, socket sync, and whiteboard tools integration.

65. **What trade-off did you make consciously?**  
    Chose faster MVP delivery over advanced validation/versioning, with clear roadmap for hardening.

66. **If given 2 more weeks, what would you prioritize?**  
    Robust validation, test coverage, socket scaling strategy, and production security improvements.

---

## Quick 30-Second Project Pitch
"DrawDesk is a full-stack collaborative whiteboard platform. I built JWT-based auth with refresh flow, room management APIs, and real-time whiteboard sync using Socket.IO and React Konva. The board state is persisted in MongoDB so users can rejoin and continue. The app supports multiple drawing tools, undo/redo, export, and secure protected routes."
