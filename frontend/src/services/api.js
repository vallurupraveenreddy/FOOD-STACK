// Thin fetch wrapper around the Spring Boot backend.
// Kept dependency-free (no axios) so nothing new has to be installed.

export const API_BASE_URL = "http://localhost:8080/api";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (_) {
    // no JSON body (e.g. 204)
  }

  if (!res.ok) {
    // A 401/403 on a request that carried a token means that token is no
    // longer valid (expired, or the account was disabled) — tell the app to
    // log the user out cleanly instead of surfacing a confusing raw error.
    if (token && (res.status === 401 || res.status === 403)) {
      window.dispatchEvent(new CustomEvent("auth:expired"));
      throw new Error("Your session has expired. Please log in again.");
    }
    const message = (data && (data.message || data.errors)) || `Request failed (${res.status})`;
    throw new Error(typeof message === "string" ? message : JSON.stringify(message));
  }

  return data;
}

export const authApi = {
  register: (name, email, password) =>
    request("/auth/register", { method: "POST", body: { name, email, password } }),
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password } }),
};

export const foodApi = {
  list: () => request("/food/list"),
};

export const cartApi = {
  get: (token) => request("/cart/get", { token }),
  add: (token, foodItemId) => request("/cart/add", { method: "POST", token, body: { foodItemId } }),
  remove: (token, foodItemId) => request("/cart/remove", { method: "POST", token, body: { foodItemId } }),
};

export const orderApi = {
  place: (token, address) => request("/order/place", { method: "POST", token, body: address }),
  myOrders: (token) => request("/order/userorders", { token }),
};

export const userApi = {
  getProfile: (token) => request("/users/profile", { token }),
  updateProfile: (token, profile) => request("/users/profile", { method: "PUT", token, body: profile }),
};

export const couponApi = {
  active: () => request("/coupons/active"),
  apply: (token, code) => request("/coupons/apply", { method: "POST", token, body: { code } }),
};

export const reviewApi = {
  summary: () => request("/reviews/summary"),
  forFood: (foodItemId) => request(`/reviews/food/${foodItemId}`),
  add: (token, foodItemId, rating, comment) =>
    request("/reviews", { method: "POST", token, body: { foodItemId, rating, comment } }),
};

export const adminApi = {
  dashboard: (token) => request("/admin/dashboard", { token }),
  users: (token) => request("/admin/users", { token }),
  toggleUser: (token, id) => request(`/admin/users/${id}/toggle`, { method: "PATCH", token }),
  updateUserRole: (token, id, role) => request(`/admin/users/${id}/role`, { method: "PUT", token, body: { role } }),
  addFood: (token, food) => request("/food/add", { method: "POST", token, body: food }),
  updateFood: (token, id, food) => request(`/food/${id}`, { method: "PUT", token, body: food }),
  deleteFood: (token, id) => request(`/food/${id}`, { method: "DELETE", token }),
  allOrders: (token) => request("/order/list", { token }),
  updateOrderStatus: (token, orderId, status) =>
    request("/order/status", { method: "POST", token, body: { orderId, status } }),
};

export default { authApi, foodApi, cartApi, orderApi, userApi, couponApi, reviewApi, adminApi };
