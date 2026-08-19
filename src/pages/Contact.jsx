export default function Contact() {
  return (
    <>
      {/* Contact hero */}
      <section className="contact-hero">
        <div className="container text-center">
          <h1 className="display-3 fw-bold">Contact Us</h1>
          <p>We would love to hear from you.</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            {/* Contact Info */}
            <div className="col-md-5">
              <div className="contact-info">
                <h3>Contact Information</h3>
                <div className="mt-5">
                  <a href="mailto:MLStudio@gmail.com" className="text-decoration-none text-dark-emphasis">
                    <p><i className="fa-solid fa-envelope fa-lg"></i> MLStudio@gmail.com</p>
                  </a>
                  <a href="tel:+855964663885" className="text-decoration-none text-dark-emphasis">
                    <p><i className="fa-solid fa-phone fa-lg"></i> +855 96 466 3885</p>
                  </a>
                  <a href="https://www.google.com/maps/search/?api=1&query=ETEC+Center+Phnom+Penh" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-dark-emphasis">
                    <p><i className="fa-solid fa-location-dot fa-lg"></i> Phnom Penh, Etec Center</p>
                  </a>
                  <a href="https://www.facebook.com/share/1CQzPW6V7c/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-dark-emphasis">
                    <p><i className="fa-brands fa-facebook fa-lg"></i> ML Studio</p>
                  </a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="col-md-7">
              <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                <div className="mb-3">
                  <input type="text" className="form-control" placeholder="Your Name" />
                </div>
                <div className="mb-3">
                  <input type="email" className="form-control" placeholder="Your Email" />
                </div>
                <div className="mb-3">
                  <textarea className="form-control" rows="5" placeholder="Your Message"></textarea>
                </div>
                <button className="btn green-btn" type="submit">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Find Us</h2>
          <div className="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.841678308493!2d104.88799717506906!3d11.562217244208389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310951adb4d4041d%3A0x8a90e729f62ad800!2sETEC%20Center!5e1!3m2!1sen!2skh!4v1786935361435!5m2!1sen!2skh"
              width="1100" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </section>
    </>
  );
}
