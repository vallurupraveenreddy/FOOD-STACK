import React, { useState } from 'react'
import './Contact.css'
import { assets } from '../../assets/assets'

const API_BASE_URL = "http://localhost:8080/api";

const FAQS = [
  { q: "What are your delivery hours?", a: "We deliver every day from 10:00 AM to 11:00 PM." },
  { q: "How long does delivery usually take?", a: "Most orders arrive within 30–40 minutes, depending on distance and demand." },
  { q: "Do you offer refunds for cancelled orders?", a: "Orders can be cancelled before they enter preparation. Reach out to us and we'll sort it out." },
  { q: "Is online payment on this site real?", a: "No — this is a demo/portfolio project. Online payment is simulated and no real transaction ever occurs." },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error((data && data.message) || "Could not send your message. Please try again.");
      }
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err.message || "Could not send your message. Is the backend running?");
    }
  };

  return (
    <div className="contact-page">
      {/* Hero */}
      <div className="contact-hero">
        <h1>Get in Touch</h1>
        <p>Questions, feedback, or just want to say hi? We'd love to hear from you.</p>
      </div>

      {/* Info cards */}
      <div className="contact-info-grid">
        <div className="contact-info-card">
          <h3>📞 Phone</h3>
          <p>+1-212-456-6789</p>
        </div>
        <div className="contact-info-card">
          <h3>✉️ Email</h3>
          <p>contact@tomato.com</p>
        </div>
        <div className="contact-info-card">
          <h3>📍 Location</h3>
          <p>123 Flavor Street, Food City</p>
        </div>
        <div className="contact-info-card">
          <h3>🕒 Hours</h3>
          <p>Everyday, 10:00 AM – 11:00 PM</p>
        </div>
      </div>

      {/* Form + socials */}
      <div className="contact-main">
        <form className="contact-form" onSubmit={onSubmit}>
          <h2>Send us a message</h2>
          <div className="contact-form-row">
            <input name="name" placeholder="Your name" value={form.name} onChange={onChange} required />
            <input name="email" type="email" placeholder="Your email" value={form.email} onChange={onChange} required />
          </div>
          <input name="subject" placeholder="Subject" value={form.subject} onChange={onChange} />
          <textarea name="message" rows={5} placeholder="Your message" value={form.message} onChange={onChange} required />

          {status === "success" && <p className="contact-success">✓ Thanks! Your message has been received — we'll get back to you soon.</p>}
          {status === "error" && <p className="contact-error">{error}</p>}

          <button type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>
        </form>

        <div className="contact-side">
          <h3>Follow us</h3>
          <div className="contact-social-icons">
            <img src={assets.facebook_icon} alt="Facebook" />
            <img src={assets.twitter_icon} alt="Twitter" />
            <img src={assets.linkedin_icon} alt="LinkedIn" />
          </div>

          <h3 style={{ marginTop: "30px" }}>FAQs</h3>
          <div className="contact-faq-list">
            {FAQS.map((f, i) => (
              <div key={i} className="contact-faq-item">
                <div className="contact-faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{f.q}</span>
                  <span>{openFaq === i ? "−" : "+"}</span>
                </div>
                {openFaq === i && <p className="contact-faq-answer">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
