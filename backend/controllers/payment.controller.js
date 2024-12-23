/** @format */

import Coupon from "../models/coupon.model.js";
import Booking from "../models/booking.model.js";
import { stripe } from "../lib/stripe.js";

// Controller to create a Stripe checkout session

export const createCheckoutSession = async (req, res) => {
  try {
    const { cars, couponCode } = req.body;
    const { startDate, endDate, pickupLocation, totalPrice } = req.body;

    // Convert VND to USD only for Stripe payment
    const VND_TO_USD = 0.000041;

    const lineItems = cars.map((car) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: car.name,
          images: [car.image],
          description: `Original price: ${car.price.toLocaleString()}đ`,
        },
        unit_amount: Math.round(car.price * VND_TO_USD * 100),
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        // Store all necessary booking data in metadata
        bookingData: JSON.stringify({
          carId: cars[0].id, // Assuming single car booking
          startDate,
          endDate,
          pickupLocation,
          totalPrice,
        }),
      },
    });

    res.status(200).json({
      sessionId: session.id,
      amountUSD: cars.reduce((sum, car) => sum + car.price * VND_TO_USD, 0),
      amountVND: cars.reduce((sum, car) => sum + car.price, 0),
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Lỗi tạo phiên thanh toán" });
  }
};

// Handle successful payment
export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // First check if a booking already exists with this session ID
      const existingBooking = await Booking.findOne({
        stripeSessionId: sessionId,
      });

      if (existingBooking) {
        return res.status(200).json({
          success: true,
          message: "Payment already processed",
          bookingId: existingBooking._id,
        });
      }

      // Parse booking data from metadata
      const bookingData = JSON.parse(session.metadata.bookingData);

      // Create new booking
      const newBooking = new Booking({
        user: session.metadata.userId,
        car: bookingData.carId,
        startDate: new Date(bookingData.startDate),
        endDate: new Date(bookingData.endDate),
        pickupLocation: bookingData.pickupLocation,
        totalPrice: bookingData.totalPrice,
        status: "confirmed",
        stripeSessionId: sessionId, // Make sure this field exists in your Booking model
      });

      await newBooking.save();

      res.status(200).json({
        success: true,
        message: "Payment successful and booking created",
        bookingId: newBooking._id,
      });
    } else {
      res.status(400).json({ message: "Payment not successful" });
    }
  } catch (error) {
    console.error("Error in checkoutSuccess:", error);
    res.status(500).json({
      message: "Failed to process successful checkout",
      error: error.message,
    });
  }
};

// Rest of the controller remains the same...
// Utility to create a Stripe coupon
const createStripeCoupon = async (discountPercentage) => {
  try {
    const coupon = await stripe.coupons.create({
      percent_off: discountPercentage,
      duration: "once",
    });
    return coupon.id;
  } catch (error) {
    console.error("Error creating Stripe coupon:", error.message);
    throw new Error("Failed to create Stripe coupon");
  }
};

// Utility to create a new coupon
export const createNewCoupon = async (userId) => {
  try {
    // Remove any existing coupon for the user
    await Coupon.findOneAndDelete({ userId });

    // Generate a new coupon
    const newCoupon = new Coupon({
      code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      discountPercentage: 10,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      userId,
    });

    await newCoupon.save();
    return newCoupon;
  } catch (error) {
    console.error("Error creating new coupon:", error.message);
    throw new Error("Failed to create new coupon");
  }
};
