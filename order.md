✅ Final Frontend Instructions with Complete API List


NEED TO COMPLETE IT WITHIN A SINGLE DAY!!!


1. 🔐 User Authentication

📌 API Endpoints:

POST /api/signup – To send new user sign-up data to backend.

POST /api/login – To send login credentials and get a success/failure response.

POST /api/logout (optional but good to have) – To end user session.


📝 Instructions:

Send sign-up and login form data to backend using the above APIs.

On successful login ("Login Successful" from backend), load a unique dashboard based on the user's profile (username, ID, or email).



---

2. 🧠 Start a Workflow

📌 API Endpoint:

POST /api/start-workflow – To start a new workflow session when the first node is dropped.


📝 Instructions:

When a user drags the first node onto the playground, send a request to this API to initialize a new workflow.

This tells the backend to set up a workflow and track it uniquely.



---

3. 🧩 Create and Manage Nodes

📌 API Endpoints:

POST /api/create-node – To send node data (type, metadata, position) when user adds a node.

PATCH /api/update-node – To update node data (if user moves/edits the node).


📝 Instructions:

Every time a node is dragged and dropped, send a create-node request with:

Node type (e.g., “text generator”, “input”, etc.)

Position (x, y)

Any initial parameters (optional)


If the user updates node details or moves it, send an update-node request.



---

4. ⚙ Model Configuration

📌 API Endpoint:

POST /api/set-params – To send selected model settings (model name, temperature, etc.).


📝 Instructions:

When a user selects an AI model or sets parameters like temperature, max tokens, etc., send them via this API.

These values tell the backend how to run the AI model.



---

5. 📤 Run Workflow & Get Output

📌 API Endpoint:

GET /api/get-output?workflow_id=<id> – To fetch output from backend for the current workflow.


📝 Instructions:

After a workflow is executed on backend, use this API to fetch the result/output.

Display this output clearly in the playground area.



---

6. 💾 Save & Load Workflow

📌 API Endpoints:

POST /api/save-workflow – To save the current workflow (structure + nodes + parameters).

GET /api/load-workflow?id=<workflow_id> – To load a previously saved workflow.


📝 Instructions:

When user clicks “Save”, send all current workflow details to backend.

Allow user to reopen saved workflows using the “Load” option and the backend will send back full structure.



---

7. 🚫 Error Handling and Feedback

📝 Instructions:

Always check for error responses from backend (e.g., invalid input, auth failed).

Show proper error messages to the user based on backend’s response.



---

8. 🔐 Token Management (if using JWT sessions)

📌 Instruction:

After login, store the access token sent by backend.

For all future API requests (except sign-up/login), include token in Authorization header like:

Authorization: Bearer <access_token>



---

🔚 Final Note for Frontend Team:

Make sure every drag, drop, click, or input is properly connected to an API.

Use clear loading indicators when waiting for backend.

Always validate user input before sending it to backend.