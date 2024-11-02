# BookNook Interview API

## Base URL:

**Locally**

-   `npm install`
-   `npm run dev`
-   `npm run mock`
-   Base URL: `http://localhost:3001`

## Admin Credentials (Not used for Backend Interview Task)

-   **Email:** `interviewee@booknook.com`
-   **Password:** `password`

## Schools to Use (Not used for Backend Interview Task)

-   **School Id:**
    -   `123`
    -   `124`

## Endpoints

-   Non authentication requests expect either:

    1. An `Authorization` header of just the `token` from the `/tutors/authenticate` endpoint.
        - `{ headers: "Authorization": "eyJhbGciOiJ...EXAiQbrhcMl1o" }`
    2. An `X-Api-Key` header of a valid JWT API key. A valid token is available as an environment variable, `INTERNAL_X_API_KEY`.
        - `{ headers: "X-Api-Key": "eyJhbGciOiJIUzI1...vZW2G6tZ1U" }`
        - You should use this authorization technique in requests made in your code.

-   Body of `POST` requests should have `Content-Type: application/json`.

-   **Tutor Auth:** `POST /tutors/authenticate`
-   **Get Students:** `GET /students`
    -   Optional query params:
        -   `schoolId=[SCHOOL_ID]`
        -   `sisId=[SIS_ID]`
    -   When passed an `sisId`, this endpoint is slow and takes between 5 and 31 seconds to respond
-   **Get Student:** `GET /students/:id`
-   **Insert Student:** `POST /students`
-   **Update Student:** `PUT /students/:id`
    -   This endpoint is slow and takes between 5 and 31 seconds to respond
-   **Get Reading Levels:** `GET /reading_levels`
    -   Optional query params:
        -   `code=[CODE]`
-   **Get Reading Level:** `GET /reading_levels/:id`
-   **Get Grade Levels:** `GET /grade_levels`
    -   Optional query Params:
        -   `name=[NAME]`
-   **Get Grade Level:** `GET /grade_levels/:id`
-   **Webhook:** `POST /webhook`
    -   This is the endpoint that will be written for the Backend Interview Task.
-   **Debug:** `GET /debug`
    -   This endpoint prints the full contents of the in memory database as JSON, which can be helpful for debugging.

**Delay on slow endpoints**

-   The max delay on slow endpoints is set in `.env` with `ARTIFICIAL_DELAY_MS`. Please change this value to something smaller while working to avoid it slowing down your progress. However, your final solution should be able to handle the slow endpoints in an appropriate way.

## Backend Interview Task

Your task is to write an MVP of a `POST /webhook` endpoint that will receive requests from a 3rd party (mocked for this exercise). The data that will be sent in the requests is defined in `/data/webhookStudents.ts`. The `/controllers/webhook/index.ts` file currently has boilerplate that will handle the request by sending a default `200` status response.

You should update the `/controllers/webhook/index.ts` file to add functionality to update the students you receive data about from the `POST /webhook` endpoint. You should use the `GET /students`, `PUT /students/:id`, `GET /reading_levels`, and `GET /grade_levels` endpoints to update students with matching `sis_id` values from the request body.

The `GET /students` endpoint can take two optional query string parameters, `schoolId`, which will filter by the `school_id` value on the `student` table in the local db, and `sisId`, which will filter by the `sis_id` value on the `student` table in the local db. The `GET /reading_levels` endpoint can take an optional `code` query param, and hte `GET /grade_levels` endpoint can take an optional `name` query param, which filter the results.

The endpoints are part of this project, but your solution should work the same as if they were endpoints on a separate service.

The `PUT /students/:id` endpoint requires the following properties to be passed in the request body. If you are only making updates to some columns, you will need to pass the rest of the data with the existing values.

```
    username: string,
    sis_id?: string,
    first_name: string,
    last_name: string,
    grade_level_id: number,
    reading_level_id: number,
    has_iep: boolean
```

The data you receive in the request body on the `POST /webhook` endpoint will be in the format:

```
    {
        type: "grade_update",
        sis_id: string,
        grade: string,
        "x-api-key": string,
    }
```

or

```
    {
        type: "reading_update",
        sis_id: string,
        reading_level: string,
        "x-api-key": string,
    }
```

### `POST /webhook` request body details

-   You should not use or validate the `"x-api-key"` value in the request body on the `POST /webhook` endpoint for this task. Your finished `POST /webhook` endpoint should be public and should not require authorization.

-   The `sis_id` property matches the `sis_id` property on the `student` table in the local sqlite database.

-   The `grade` property in `"grade_update"` type requests corresponds to the grade level name, not the `grade_level_id` property on the `student` table. For example, `{ type: "grade_update", sis_id: "abcdefg12345", grade: "1" }` should update the student with `sis_id` `abcdefg12345` to the grade level (as defined in `/data/gradeLevels.ts`) `{ id: 2, name: '1st', sequence: 2 }`.

-   The `reading_level` property in the `"reading_update"` type requests corresponds to the `code` property on the student reading levels (as defined in `/data/readingLevels.ts`).

You should write your updates to the `POST /webhook` endpoint to make API requests to the existing `GET /students`, `PUT /students`, `GET /reading_levels`, and `GET /grade_levels` endpoints, not write any new SQL queries or make changes outside of `/controllers/webhook/index.ts`. Include any types or helper functions you need in the same file.

You can assume that the 3rd party that is making the API calls to `POST /webhook` (mocked for this exercise) has no error handling, or retry behavior.

The project populates a local in memory sqlite database which will reset to the initial state when the node process restarts, there is no data persistance. The files in the `/data/` directory are used to populate this database and in rendering responses from other API endpoints. The API endpoints should give you the data and functionality you need for your endpoint.

To run the mocked API calls to `POST /webhook`, run `npm run mock` from a terminal while the server is running.

This project is not made to demonstrate an ideal codebase, just give a working example of something that you can get started in quickly. While we do use automated testing in our real code, there are no tests for this project and we do not expect you to write any for your code.
