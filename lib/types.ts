/**
 * Defines the shape of the data sent to the login endpoint.
 */
export interface LoginRequest {
    usernameOrEmail: string;
    password: string;
}

/**
 * Defines the shape of a successful login response from the API.
 * The actual user data is nested within a 'data' object.
 */
export interface LoginResponse {
    data: {
        token: string;
        username: string;
    };
    message?: string;
}

/**
 * Defines the shape of the data sent to the registration endpoint.
 */
export interface RegisterRequest {
    name: string;
    username: string;
    email: string;
    password: string;
}

/**
 * Defines the shape of a successful registration response from the API.
 */
export interface RegisterResponse {
    message: string;
}

/**
 * Defines the shape of a generic error response from the API.
 */
export interface ErrorResponse {
    message: string;
    timestamp?: string; // Optional: for more detailed server errors
    details?: string;   // Optional: for more detailed server errors
}
