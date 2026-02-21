const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const getWeatherForDate = require("../services/weatherService");

// CREATE BOOKING
router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      numberOfGuests,
      bookingDate,
      bookingTime,
      cuisinePreference,
      specialRequests,
      seatingPreference,
      weatherInfo
    } = req.body;

    // Fetch real weather
    const weatherData = await getWeatherForDate(bookingDate);

    const newBooking = new Booking({
      bookingId: "BK" + Date.now(),
      customerName,
      numberOfGuests,
      bookingDate,
      bookingTime,
      cuisinePreference,
      specialRequests,
      weatherInfo: weatherData,
      seatingPreference: weatherData?.seatingSuggestion || "indoor",
      status: "confirmed"
    });

    const savedBooking = await newBooking.save();

    res.status(201).json(savedBooking);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating booking" });
  }
});

// GET ALL BOOKINGS
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// GET SINGLE BOOKING
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking" });
  }
});

// DELETE BOOKING
router.delete("/:id", async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking" });
  }
});

module.exports = router;

