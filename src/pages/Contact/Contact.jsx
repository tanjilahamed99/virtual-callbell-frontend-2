import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import { BASE_URL } from "../../config/constant";
import Swal from "sweetalert2";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.post(BASE_URL + "/users/contact", form);
    if (data.success) {
      setForm({ name: "", email: "", message: "" });
      Swal.fire({
        title: "Success!",
        text: "Your message has been sent.",
        icon: "success",
      });
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f0f4f8",
        minHeight: "100vh",
        color: "#111827",
      }}>
      <Navbar />

      {/* Main Contact Section */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "4rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}>
        <h2
          style={{
            fontSize: "2.5rem",
            fontWeight: "800",
            textAlign: "center",
          }}>
          Contact Us
        </h2>
        <p
          style={{ fontSize: "1.1rem", color: "#4b5563", textAlign: "center" }}>
          We love to hear from you. Fill out the form below to get in touch.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            backgroundColor: "#ffffff",
            padding: "2rem",
            borderRadius: "1rem",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          }}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              border: "1px solid #d1d5db",
              fontSize: "1rem",
              outline: "none",
              width: "100%",
            }}
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              border: "1px solid #d1d5db",
              fontSize: "1rem",
              outline: "none",
              width: "100%",
            }}
          />

          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            required
            rows={6}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              border: "1px solid #d1d5db",
              fontSize: "1rem",
              outline: "none",
              width: "100%",
              resize: "vertical",
            }}
          />

          <button
            type="submit"
            style={{
              padding: "0.75rem 1rem",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontWeight: "600",
              fontSize: "1rem",
              borderRadius: "0.75rem",
              cursor: "pointer",
              transition: "background-color 0.3s",
              border: "none",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1e40af")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}>
            Send Message
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
