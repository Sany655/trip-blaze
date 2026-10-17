import initialData from "../trip-blaze.json";
import { db, isFirebaseConfigured } from "../firebase.config";
import {
  doc,
  setDoc
} from "firebase/firestore";
import chatEmitter from "./chatEmitter";

const STORAGE_PREFIX = "trip_blaze_db_";

class DataService {
  constructor() {
    this.collections = [
      "blogs",
      "places",
      "packages",
      "hotels",
      "transports",
      "bookings",
      "reviews",
      "messages",
      "users"
    ];
    this.initStorage();
  }

  initStorage() {
    if (typeof window === "undefined") return;
    this.collections.forEach((col) => {
      const key = STORAGE_PREFIX + col;
      if (!localStorage.getItem(key)) {
        const seed = initialData[col] || [];
        localStorage.setItem(key, JSON.stringify(seed));
      }
    });
  }

  getCollection(col) {
    if (typeof window === "undefined") return initialData[col] || [];
    const raw = localStorage.getItem(STORAGE_PREFIX + col);
    if (!raw) {
      const seed = initialData[col] || [];
      localStorage.setItem(STORAGE_PREFIX + col, JSON.stringify(seed));
      return seed;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialData[col] || [];
    }
  }

  setCollection(col, data) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_PREFIX + col, JSON.stringify(data));

    // Optional firestore sync
    if (isFirebaseConfigured() && db) {
      this.syncToFirestore(col, data).catch((err) =>
        console.warn(`Firestore sync notice for ${col}:`, err.message)
      );
    }
  }

  async syncToFirestore(col, data) {
    try {
      // Store latest collection snapshot as a document for simple zero-config sync
      await setDoc(doc(db, "app_data", col), {
        items: data,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      // Non-blocking sync error
    }
  }

  // --- MESSAGES / CHAT ---
  getMessages(hotelId, userId) {
    const messages = this.getCollection("messages");
    const userMessages = messages.find(
      (m) =>
        parseInt(m.user?.id) === parseInt(userId) &&
        parseInt(m.hotel?.id) === parseInt(hotelId)
    );
    if (userMessages) {
      return { status: 200, messages: userMessages };
    }
    return { status: 404, message: "No messages found!" };
  }

  getHotelInbox(hotelId) {
    const messages = this.getCollection("messages");
    const hotelMessages = messages.filter(
      (m) => parseInt(m.hotel?.id) === parseInt(hotelId)
    );
    if (hotelMessages.length) {
      return { status: 200, messages: hotelMessages };
    }
    return { status: 404, message: "No messages found!" };
  }

  getInbox(username) {
    const messages = this.getCollection("messages");
    const userInbox = messages.filter((m) => m.user?.username === username);
    if (userInbox.length) {
      return { status: 200, messages: userInbox };
    }
    return { status: 404, message: "No messages found!" };
  }

  setMessage(msg) {
    let allMsg = this.getCollection("messages");
    const existing = allMsg.find(
      (m) =>
        m.user?.username === msg.user?.username &&
        (m.hotel?.id === msg.hotel?.id || m.hotel?.hotelId === msg.hotel?.hotelId)
    );

    if (existing) {
      if (!existing.messages) existing.messages = [];
      existing.messages.unshift(msg.messages[0]);
    } else {
      allMsg.push(msg);
    }

    this.setCollection("messages", allMsg);
    chatEmitter.emit("receive_message");

    return { status: 200, message: "Message sent successfully!" };
  }

  // --- REVIEWS ---
  getReviews() {
    const reviews = this.getCollection("reviews");
    if (reviews && reviews.length > 0) {
      return { status: 200, reviews };
    }
    return { status: 404, message: "No reviews found!" };
  }

  addReview(body) {
    const { title, bookingType, rating, review, name, src } = body;
    const newReview = { title, bookingType, rating, review, name, src };

    newReview.date = new Date().toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    });

    const reviews = this.getCollection("reviews");
    newReview.id = reviews.length > 0 ? (reviews[0].id || 0) + 1 : 1;
    reviews.unshift(newReview);
    this.setCollection("reviews", reviews);

    // Update bookings that match the title
    const bookings = this.getCollection("bookings");
    const updatedBookings = bookings.map((b) => {
      if (b.title?.toLowerCase() === title?.toLowerCase()) {
        b.reviewed = true;
      }
      return b;
    });
    this.setCollection("bookings", updatedBookings);

    return {
      status: 200,
      message: "Review added successfully and booking updated!"
    };
  }

  // --- BOOKINGS ---
  confirmBooking(bookingId) {
    const bookings = this.getCollection("bookings");
    const target = bookings.find((b) => String(b.id) === String(bookingId));
    if (target) {
      target.status = "confirmed";
      this.setCollection("bookings", bookings);
      return { status: 200, message: "Booking confirmed successfully!" };
    }
    return { status: 400, message: "Booking not found!" };
  }

  getAllBookings() {
    const bookings = this.getCollection("bookings");
    return bookings.filter(
      (b) => b.bookingType === "tour" || b.bookingType === "package"
    );
  }

  getHotelBookings(hotelId) {
    const bookings = this.getCollection("bookings");
    return bookings.filter((b) => String(b.hotelId) === String(hotelId));
  }

  getTransportBookings() {
    const bookings = this.getCollection("bookings");
    return bookings.filter((b) => b.bookingType === "transport");
  }

  getBookings(username) {
    const bookings = this.getCollection("bookings");
    return bookings.filter((b) => b.user === username);
  }

  setBooking(booking) {
    const bookings = this.getCollection("bookings");
    booking.status = "pending";
    booking.reviewed = false;
    booking.id = bookings.length > 0 ? (bookings[0].id || 0) + 1 : 1;
    bookings.unshift(booking);
    this.setCollection("bookings", bookings);
    return {
      status: 200,
      message: (booking.bookingType || "Item") + " booked successfully!"
    };
  }

  cancelBooking(id) {
    const bookings = this.getCollection("bookings");
    const numId = parseInt(id);
    const updated = bookings.map((b) =>
      b.id === numId ? { ...b, status: "cancelled" } : b
    );
    this.setCollection("bookings", updated);
    return { status: 200, message: "Booking cancelled successfully!" };
  }

  // --- AUTH ---
  checkUniqueUser(username, email) {
    const users = this.getCollection("users");
    if (users.find((u) => u.username === username)) {
      return { status: 400, message: "Username already exists" };
    }
    if (users.find((u) => u.email === email)) {
      return { status: 400, message: "Email already exists" };
    }
    return { status: 200, message: "Unique user verified" };
  }

  signin(userOrEmail, password) {
    const users = this.getCollection("users");
    const userObj = users.find(
      (u) =>
        (u.email === userOrEmail || u.username === userOrEmail) &&
        u.password === password
    );
    if (!userObj) {
      return { status: 401, message: "Invalid credentials" };
    }
    const cleanUser = { ...userObj };
    delete cleanUser.password;
    return { status: 200, user: cleanUser };
  }

  signup(userData, imageUrl) {
    const check = this.checkUniqueUser(userData.username, userData.email);
    if (check.status !== 200) return check;

    const users = this.getCollection("users");
    userData.id = users.length > 0 ? (users[0].id || 0) + 1 : 1;
    userData.image = imageUrl || "uploads/users/default_user.png";
    users.unshift(userData);
    this.setCollection("users", users);

    const cleanUser = { ...userData };
    delete cleanUser.password;
    return { status: 200, user: cleanUser };
  }

  // --- PLACES / TOURS ---
  getPlaces() {
    return this.getCollection("places");
  }

  setPlace(data, imageUrl) {
    const places = this.getCollection("places");
    if (places.some((p) => p.title === data.title)) {
      return { status: 400, message: "Title must be unique" };
    }
    data.id = places.length > 0 ? (places[0].id || 0) + 1 : 1;
    data.src = imageUrl || `uploads/places/${data.title}.png`;
    places.unshift(data);
    this.setCollection("places", places);
    return { status: 200, message: "Data saved successfully!" };
  }

  updatePlace(data, imageUrl) {
    const places = this.getCollection("places");
    const index = places.findIndex((p) => p.title === data.title);
    if (index === -1) {
      return { status: 404, message: "Place not found" };
    }
    if (imageUrl) data.src = imageUrl;
    else data.src = places[index].src;

    places.splice(index, 1, data);
    this.setCollection("places", places);
    return { status: 200, message: "Data updated successfully!" };
  }

  deletePlace(title) {
    const places = this.getCollection("places");
    const filtered = places.filter((p) => p.title !== title);
    if (filtered.length === places.length) {
      return { status: 404, message: "Place not found" };
    }
    this.setCollection("places", filtered);
    return { status: 200, message: "Data deleted successfully!" };
  }

  // --- TRANSPORTS ---
  getTransports(transporterId) {
    const transports = this.getCollection("transports");
    if (transporterId) {
      return transports.filter(
        (t) => parseInt(t.transporter_id) === parseInt(transporterId)
      );
    }
    return transports;
  }

  setTransport(data) {
    const transports = this.getCollection("transports");
    data.transporter_id = parseInt(data.transporter_id);
    data.id = transports.length > 0 ? (transports[0].id || 0) + 1 : 1;
    transports.unshift(data);
    this.setCollection("transports", transports);
    return { status: 200, message: "Data saved successfully!" };
  }

  updateTransport(id, transporterId, data) {
    const transports = this.getCollection("transports");
    const numId = parseInt(id);
    const numTransporterId = parseInt(transporterId);
    const index = transports.findIndex(
      (t) => t.id === numId && t.transporter_id === numTransporterId
    );
    if (index === -1) {
      return { status: 404, message: "Transport not found" };
    }
    transports[index] = { ...transports[index], ...data };
    this.setCollection("transports", transports);
    return { status: 200, message: "Data updated successfully!" };
  }

  deleteTransport(id) {
    const transports = this.getCollection("transports");
    const numId = parseInt(id);
    const filtered = transports.filter((t) => t.id !== numId);
    if (filtered.length === transports.length) {
      return { status: 404, message: "Transport not found" };
    }
    this.setCollection("transports", filtered);
    return { status: 200, message: "Data deleted successfully!" };
  }

  // --- BLOGS ---
  getBlogs() {
    return this.getCollection("blogs");
  }

  getBlog(title) {
    const blogs = this.getCollection("blogs");
    const blog = blogs.find(
      (b) => b.title?.toLowerCase() === decodeURIComponent(title)?.toLowerCase()
    );
    return blog || null;
  }

  setBlog(data, imageUrl) {
    const blogs = this.getCollection("blogs");
    if (blogs.some((b) => b.title === data.title)) {
      return { status: 400, message: "Title must be unique" };
    }
    data.image = imageUrl || `uploads/blogs/${data.title}.png`;
    blogs.unshift(data);
    this.setCollection("blogs", blogs);
    return { status: 200, message: "Data saved successfully!" };
  }

  deleteBlog(title) {
    const blogs = this.getCollection("blogs");
    const filtered = blogs.filter((b) => b.title !== title);
    if (filtered.length === blogs.length) {
      return { status: 404, message: "Blog not found" };
    }
    this.setCollection("blogs", filtered);
    return { status: 200, message: "Data deleted successfully!" };
  }

  // --- HOTELS & ROOMS ---
  getHotels() {
    return this.getCollection("hotels");
  }

  getHotel(id) {
    const hotels = this.getCollection("hotels");
    const hotel = hotels.find((h) => parseInt(h.id) === parseInt(id));
    if (hotel) {
      return { status: 200, hotel };
    }
    return { status: 404, message: "Hotel not found" };
  }

  setHotel(data, imageUrl) {
    const hotels = this.getCollection("hotels");
    data.id = parseInt(data.id);
    const existing = hotels.find((h) => h.id === data.id);
    if (existing) {
      data.src = imageUrl || existing.src;
      data.rooms = existing.rooms || [];
      hotels.splice(hotels.indexOf(existing), 1, data);
    } else {
      data.src = imageUrl || "";
      data.rooms = [];
      hotels.unshift(data);
    }
    this.setCollection("hotels", hotels);
    return { status: 200, message: "Data saved successfully!" };
  }

  createRoom(data, imageUrl) {
    const hotels = this.getCollection("hotels");
    const hotelId = parseInt(data.hotel_id);
    const hotel = hotels.find((h) => h.id === hotelId);
    if (!hotel) return { status: 404, message: "Hotel not found" };

    if (!hotel.rooms) hotel.rooms = [];
    data.src = imageUrl || `uploads/rooms/${data.title}.jpg`;
    data.id = hotel.rooms.length > 0 ? (hotel.rooms[0].id || 0) + 1 : 1;
    hotel.rooms.unshift(data);

    this.setCollection("hotels", hotels);
    return { status: 200, message: "Data saved successfully!" };
  }

  updateRoom(data, imageUrl) {
    const hotels = this.getCollection("hotels");
    const hotelId = parseInt(data.hotelId);
    const roomId = parseInt(data.id);

    const hotel = hotels.find((h) => h.id === hotelId);
    if (!hotel || !hotel.rooms) return { status: 404, message: "Hotel not found" };

    const roomIndex = hotel.rooms.findIndex((r) => r.id === roomId);
    if (roomIndex === -1) return { status: 404, message: "Room not found" };

    if (imageUrl) data.src = imageUrl;
    else data.src = hotel.rooms[roomIndex].src;

    hotel.rooms[roomIndex] = { ...hotel.rooms[roomIndex], ...data };
    this.setCollection("hotels", hotels);
    return { status: 200, message: "Data updated successfully!" };
  }

  deleteRoom(hotelId, roomId) {
    const hotels = this.getCollection("hotels");
    const hotel = hotels.find((h) => h.id === parseInt(hotelId));
    if (!hotel || !hotel.rooms) return { status: 404, message: "Room not found" };

    const filtered = hotel.rooms.filter((r) => parseInt(r.id) !== parseInt(roomId));
    hotel.rooms = filtered;
    this.setCollection("hotels", hotels);
    return { status: 200, message: "Data deleted successfully!" };
  }

  // --- PACKAGES ---
  getPackages() {
    return this.getCollection("packages");
  }

  setPackage(data, imageUrl) {
    const packages = this.getCollection("packages");
    if (packages.some((p) => p.title === data.title)) {
      return { status: 400, message: "Title must be unique" };
    }
    data.src = imageUrl || `uploads/packages/${data.title}.png`;
    packages.unshift(data);
    this.setCollection("packages", packages);
    return { status: 200, message: "Data saved successfully!" };
  }

  updatePackage(data, imageUrl) {
    const packages = this.getCollection("packages");
    const index = packages.findIndex((p) => p.title === data.title);
    if (index === -1) {
      return { status: 404, message: "Package not found" };
    }
    if (imageUrl) data.src = imageUrl;
    else data.src = packages[index].src;

    packages.splice(index, 1, data);
    this.setCollection("packages", packages);
    return { status: 200, message: "Data updated successfully!" };
  }

  deletePackage(title) {
    const packages = this.getCollection("packages");
    const filtered = packages.filter((p) => p.title !== title);
    if (filtered.length === packages.length) {
      return { status: 404, message: "Package not found" };
    }
    this.setCollection("packages", filtered);
    return { status: 200, message: "Data deleted successfully!" };
  }
}

export const dataService = new DataService();
export default dataService;
