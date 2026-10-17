import axios from "axios";
import dataService from "./dataService";
import { storage, isFirebaseConfigured } from "../firebase.config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Helper to convert File to Data URL as local/offline fallback
function readFileAsDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

// Upload file to Firebase Storage or fallback to DataURL
async function handleFileUpload(file, folder, fallbackName) {
  if (!file || typeof file === "string") return file;
  if (isFirebaseConfigured() && storage) {
    try {
      const fileName = `${Date.now()}_${file.name || fallbackName}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (err) {
      console.warn("Firebase Storage upload failed, falling back to local:", err);
    }
  }
  return await readFileAsDataUrl(file);
}

// Parse request data from JSON or FormData
async function parseBody(data) {
  if (!data) return { body: {}, files: {} };
  if (data instanceof FormData) {
    const body = {};
    const files = {};
    data.forEach((value, key) => {
      if (value instanceof File) {
        files[key] = value;
      } else {
        body[key] = value;
      }
    });
    return { body, files };
  }
  if (typeof data === "string") {
    try {
      return { body: JSON.parse(data), files: {} };
    } catch {
      return { body: {}, files: {} };
    }
  }
  return { body: data, files: {} };
}

export function setupApiAdapter() {
  axios.defaults.adapter = async (config) => {
    const method = (config.method || "get").toLowerCase();
    
    // Parse URL and Query parameters
    let rawUrl = config.url || "";
    let cleanPath = rawUrl;
    let queryParams = { ...(config.params || {}) };

    if (rawUrl.includes("?")) {
      const [pathPart, queryPart] = rawUrl.split("?");
      cleanPath = pathPart;
      const sp = new URLSearchParams(queryPart);
      for (const [k, v] of sp.entries()) {
        queryParams[k] = v;
      }
    }

    // Strip leading baseURL or /api/
    cleanPath = cleanPath
      .replace(/^https?:\/\/[^/]+/, "")
      .replace(/^\/?api\//, "")
      .replace(/^\//, "");

    const { body, files } = await parseBody(config.data);

    let responseData = null;
    let status = 200;

    try {
      // 1. MESSAGES & INBOX
      if (cleanPath === "get_messages") {
        responseData = dataService.getMessages(queryParams.hotelId, queryParams.userId);
      } else if (cleanPath === "get_hotel_inbox") {
        responseData = dataService.getHotelInbox(queryParams.hotelId);
      } else if (cleanPath === "get_inbox") {
        responseData = dataService.getInbox(queryParams.user);
      } else if (cleanPath === "set_message") {
        responseData = dataService.setMessage(body);

      // 2. REVIEWS
      } else if (cleanPath === "get_reviews") {
        responseData = dataService.getReviews();
      } else if (cleanPath === "add_review") {
        responseData = dataService.addReview(body);

      // 3. BOOKINGS
      } else if (cleanPath === "confirm_booking") {
        responseData = dataService.confirmBooking(body.bookingId);
      } else if (cleanPath === "get_all_bookings") {
        responseData = dataService.getAllBookings();
      } else if (cleanPath === "get_hotel_bookings") {
        responseData = dataService.getHotelBookings(queryParams.hotelId);
      } else if (cleanPath === "get_transport_bookings") {
        responseData = dataService.getTransportBookings();
      } else if (cleanPath === "get_bookings") {
        responseData = dataService.getBookings(queryParams.username);
      } else if (cleanPath === "set_booking") {
        responseData = dataService.setBooking(body);
      } else if (cleanPath === "cancel_booking") {
        responseData = dataService.cancelBooking(queryParams.id || body.id);

      // 4. AUTH
      } else if (cleanPath === "unique_manager") {
        responseData = dataService.checkUniqueUser(body.username, body.email);
      } else if (cleanPath === "signup_manager") {
        responseData = dataService.signup(body);
      } else if (cleanPath === "signup") {
        let avatarUrl = null;
        if (files.image) {
          avatarUrl = await handleFileUpload(files.image, "users", `${body.username}.png`);
        }
        responseData = dataService.signup(body, avatarUrl);
      } else if (cleanPath === "signin") {
        responseData = dataService.signin(body.user, body.password);

      // 5. PLACES / TOURS
      } else if (cleanPath === "get_places") {
        responseData = dataService.getPlaces();
      } else if (cleanPath === "set_place") {
        let imgUrl = null;
        if (files.src) {
          imgUrl = await handleFileUpload(files.src, "places", `${body.title}.png`);
        }
        responseData = dataService.setPlace(body, imgUrl);
      } else if (cleanPath === "update_place") {
        let imgUrl = null;
        if (files.src) {
          imgUrl = await handleFileUpload(files.src, "places", `${body.title}.png`);
        }
        responseData = dataService.updatePlace(body, imgUrl);
      } else if (cleanPath.startsWith("delete_place/")) {
        const title = decodeURIComponent(cleanPath.replace("delete_place/", ""));
        responseData = dataService.deletePlace(title);

      // 6. TRANSPORTS
      } else if (cleanPath === "get_transports") {
        responseData = dataService.getTransports(queryParams.transporter_id);
      } else if (cleanPath === "set_transport") {
        responseData = dataService.setTransport(body);
      } else if (cleanPath === "update_transport" || cleanPath.startsWith("update_transport")) {
        responseData = dataService.updateTransport(queryParams.id, queryParams.transporter_id, body);
      } else if (cleanPath.startsWith("delete_transport/")) {
        const id = cleanPath.replace("delete_transport/", "");
        responseData = dataService.deleteTransport(id);

      // 7. BLOGS
      } else if (cleanPath === "get_blogs") {
        responseData = dataService.getBlogs();
      } else if (cleanPath.startsWith("get_blog/")) {
        const title = decodeURIComponent(cleanPath.replace("get_blog/", ""));
        const blog = dataService.getBlog(title);
        if (blog) {
          responseData = blog;
        } else {
          status = 404;
          responseData = { message: "Blog not found" };
        }
      } else if (cleanPath === "set_blog") {
        let imgUrl = null;
        if (files.image) {
          imgUrl = await handleFileUpload(files.image, "blogs", `${body.title}.png`);
        }
        responseData = dataService.setBlog(body, imgUrl);
      } else if (cleanPath.startsWith("delete_blog/")) {
        const title = decodeURIComponent(cleanPath.replace("delete_blog/", ""));
        responseData = dataService.deleteBlog(title);

      // 8. HOTELS & ROOMS
      } else if (cleanPath === "get_hotels") {
        responseData = dataService.getHotels();
      } else if (cleanPath === "get_hotel") {
        responseData = dataService.getHotel(queryParams.id);
      } else if (cleanPath === "set_hotel") {
        let imgUrl = null;
        if (files.src) {
          imgUrl = await handleFileUpload(files.src, "hotels", `${body.title}.png`);
        }
        responseData = dataService.setHotel(body, imgUrl);
      } else if (cleanPath === "create_room") {
        let imgUrl = null;
        if (files.src) {
          imgUrl = await handleFileUpload(files.src, "rooms", `${body.title}.jpg`);
        }
        responseData = dataService.createRoom(body, imgUrl);
      } else if (cleanPath === "update_room") {
        let imgUrl = null;
        if (files.src) {
          imgUrl = await handleFileUpload(files.src, "rooms", `${body.title}.jpg`);
        }
        responseData = dataService.updateRoom(body, imgUrl);
      } else if (cleanPath === "delete_room" || cleanPath.startsWith("delete_room")) {
        responseData = dataService.deleteRoom(queryParams.hotelId, queryParams.roomId);

      // 9. PACKAGES
      } else if (cleanPath === "get_packages") {
        responseData = dataService.getPackages();
      } else if (cleanPath === "set_package") {
        let imgUrl = null;
        if (files.src) {
          imgUrl = await handleFileUpload(files.src, "packages", `${body.title}.png`);
        }
        responseData = dataService.setPackage(body, imgUrl);
      } else if (cleanPath === "update_package") {
        let imgUrl = null;
        if (files.src) {
          imgUrl = await handleFileUpload(files.src, "packages", `${body.title}.png`);
        }
        responseData = dataService.updatePackage(body, imgUrl);
      } else if (cleanPath.startsWith("delete_package/")) {
        const title = decodeURIComponent(cleanPath.replace("delete_package/", ""));
        responseData = dataService.deletePackage(title);

      } else {
        console.warn(`Unmatched API route in adapter: [${method.toUpperCase()}] ${cleanPath}`);
        responseData = { status: 404, message: `Route ${cleanPath} not found` };
      }
    } catch (err) {
      console.error(`API Adapter error handling ${cleanPath}:`, err);
      status = 500;
      responseData = { status: 500, message: err.message };
    }

    // Set HTTP status code based on response data if present
    if (responseData && typeof responseData === "object" && responseData.status) {
      status = responseData.status;
    }

    return {
      data: responseData,
      status: status,
      statusText: status >= 400 ? "Error" : "OK",
      headers: { "content-type": "application/json" },
      config: config
    };
  };
}
