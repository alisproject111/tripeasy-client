import "../styles/AboutPage.css";
import AnimatedElement from "../components/AnimatedElement";
import CounterAnimation from "../components/CounterAnimation";
import SEOHead from "../components/SEOHead";

function AboutPage() {
  return (
    <div className="about-page">
      <SEOHead
        title="About TripEasy - Leading Travel Agency in India | Our Story & Services"
        description="Learn about TripEasy, India's trusted travel agency since 2015. We offer best domestic & international tour packages with 10,000+ happy customers. Expert travel planning & 24/7 support."
        keywords="about TripEasy, travel agency India, tour operator, travel company, vacation planner, holiday specialist, travel services, domestic tours, international tours, travel experts"
        canonical="https://tripeasy.in/about"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About TripEasy",
          description: "Learn about TripEasy travel agency",
          url: "https://tripeasy.in/about",
          mainEntity: {
            "@type": "TravelAgency",
            name: "TripEasy",
            foundingDate: "2015",
            numberOfEmployees: "10-50",
            description:
              "Leading travel agency offering domestic and international tour packages",
          },
        }}
      />
      <div
        className="about-hero-section"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/assets/about/about-hero.jpg)`,
        }}
      >
        <div className="container">
          <AnimatedElement animation="fade-up">
            <h1 className="about-page-title">About Us</h1>
            <p className="about-page-subtitle">Learn more about TripEasy</p>
          </AnimatedElement>
        </div>
      </div>

      <section className="about-intro section">
        <div className="container">
          <AnimatedElement animation="fade-up">
            <div className="section-header">
              <h2 className="section-title">Our Story</h2>
              <p className="section-subtitle">
                How we started and where we're going
              </p>
            </div>
          </AnimatedElement>

          <div className="about-content-grid">
            <AnimatedElement animation="fade-right">
              <div className="about-content-text">
                <p>
                  TripEasy was founded in 2015 with a simple mission: to make
                  travel accessible, enjoyable, and enriching for everyone. We
                  believe that travel has the power to transform lives, broaden
                  perspectives, and create lasting memories.
                </p>
                <p>
                  What started as a small team of passionate travelers has grown
                  into a trusted travel company serving thousands of happy
                  customers across India. We specialize in creating customized
                  travel experiences that cater to diverse interests, budgets,
                  and preferences.
                </p>
                <p>
                  Our focus on customer satisfaction, attention to detail, and
                  deep knowledge of destinations sets us apart. We're not just
                  selling packages; we're crafting experiences that will stay
                  with you for a lifetime.
                </p>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-left">
              <div className="about-content-image">
                <img
                  src="/assets/about/about-img-1.jpg" // Updated path
                  alt="Our team planning travel experiences"
                />
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      <section className="about-why-choose-section">
        <div className="container">
          <AnimatedElement animation="fade-up">
            <div className="section-header">
              <h2 className="section-title">Why Choose TripEasy</h2>
              <p className="section-subtitle">
                What makes us different from other travel agencies
              </p>
            </div>
          </AnimatedElement>

          <div className="about-why-choose-grid">
            <AnimatedElement animation="fade-up" delay={100}>
              <div className="about-why-choose-card">
                <div className="about-why-choose-icon">
                  <i className="fas fa-gem"></i>
                </div>
                <h3 className="about-why-choose-title">Best Value</h3>
                <p className="about-why-choose-text">
                  We negotiate the best rates with our partners to offer you
                  competitive prices without compromising on quality.
                </p>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={200}>
              <div className="about-why-choose-card">
                <div className="about-why-choose-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3 className="about-why-choose-title">Safe & Secure</h3>
                <p className="about-why-choose-text">
                  Your safety is our priority. We partner with trusted service
                  providers and offer 24/7 support during your trip.
                </p>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={300}>
              <div className="about-why-choose-card">
                <div className="about-why-choose-icon">
                  <i className="fas fa-thumbs-up"></i>
                </div>
                <h3 className="about-why-choose-title">
                  Satisfaction Guaranteed
                </h3>
                <p className="about-why-choose-text">
                  We're committed to your satisfaction. If you're not happy with
                  any aspect of your trip, we'll make it right.
                </p>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={400}>
              <div className="about-why-choose-card">
                <div className="about-why-choose-icon">
                  <i className="fas fa-user-tie"></i>
                </div>
                <h3 className="about-why-choose-title">Expert Guidance</h3>
                <p className="about-why-choose-text">
                  Our travel experts have firsthand knowledge of destinations
                  and can provide personalized recommendations.
                </p>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      <section className="about-services-section">
        <div className="container">
          <AnimatedElement animation="fade-up">
            <div className="section-header">
              <h2 className="section-title">Our Services</h2>
              <p className="section-subtitle">
                Comprehensive travel solutions for every need
              </p>
            </div>
          </AnimatedElement>

          <div className="about-services-grid">
            <AnimatedElement animation="fade-up" delay={150}>
              <div className="about-service-card">
                <div className="about-service-icon">
                  <i className="fas fa-hotel"></i>
                </div>
                <div className="about-service-content">
                  <h3 className="about-service-title">Hotel Accommodations</h3>
                  <p className="about-service-text">
                    Handpicked hotels ranging from budget-friendly options to
                    luxury resorts, ensuring comfort and quality.
                  </p>
                </div>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={200}>
              <div className="about-service-card">
                <div className="about-service-icon">
                  <i className="fas fa-route"></i>
                </div>
                <div className="about-service-content">
                  <h3 className="about-service-title">Tour Packages</h3>
                  <p className="about-service-text">
                    Comprehensive tour packages including transportation,
                    accommodation, sightseeing, and activities.
                  </p>
                </div>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={250}>
              <div className="about-service-card">
                <div className="about-service-icon">
                  <i className="fas fa-car"></i>
                </div>
                <div className="about-service-content">
                  <h3 className="about-service-title">Transportation</h3>
                  <p className="about-service-text">
                    Car rentals, airport transfers, and private transportation
                    services for hassle-free travel.
                  </p>
                </div>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={350}>
              <div className="about-service-card">
                <div className="about-service-icon">
                  <i className="fas fa-hiking"></i>
                </div>
                <div className="about-service-content">
                  <h3 className="about-service-title">Adventure Activities</h3>
                  <p className="about-service-text">
                    Exciting adventure activities and experiences, from trekking
                    and water sports to wildlife safaris.
                  </p>
                </div>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      <section className="about-mission-section">
        <div className="container">
          <AnimatedElement animation="fade-up">
            <div className="section-header">
              <h2 className="section-title">Our Mission</h2>
              <p className="section-subtitle">What drives us every day</p>
            </div>
          </AnimatedElement>

          <div className="about-content-grid reverse">
            <AnimatedElement animation="fade-left">
              <div className="about-content-text">
                <p>
                  Our mission is to make travel accessible, enjoyable, and
                  enriching for everyone. We believe that travel has the power
                  to transform lives, broaden perspectives, and create lasting
                  memories. That's why we're dedicated to crafting exceptional
                  travel experiences that cater to diverse interests, budgets,
                  and preferences.
                </p>
                <p>
                  We strive to provide our customers with the highest level of
                  service, ensuring that every aspect of their journey is
                  seamless and memorable. From the moment you book with us to
                  the time you return home, we're committed to exceeding your
                  expectations and making your travel dreams a reality.
                </p>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-right">
              <div className="about-content-image">
                <img
                  src="/assets/about/about-img-2.jpeg" // Updated path
                  alt="Beautiful destination"
                />
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      <section className="about-values-section">
        <div className="container">
          <AnimatedElement animation="fade-up">
            <div className="section-header">
              <h2 className="section-title">Our Values</h2>
              <p className="section-subtitle">
                The principles that guide everything we do
              </p>
            </div>
          </AnimatedElement>

          <div className="about-values-grid">
            <AnimatedElement animation="fade-up" delay={100}>
              <div className="about-value-card">
                <div className="about-value-icon">
                  <i className="fas fa-heart"></i>
                </div>
                <h3 className="about-value-title">Passion for Travel</h3>
                <p className="about-value-text">
                  We're travelers at heart. Our passion for exploration drives
                  us to create exceptional experiences for our customers.
                </p>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={200}>
              <div className="about-value-card">
                <div className="about-value-icon">
                  <i className="fas fa-handshake"></i>
                </div>
                <h3 className="about-value-title">Customer First</h3>
                <p className="about-value-text">
                  Your satisfaction is our priority. We go above and beyond to
                  ensure every journey exceeds your expectations.
                </p>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={300}>
              <div className="about-value-card">
                <div className="about-value-icon">
                  <i className="fas fa-globe"></i>
                </div>
                <h3 className="about-value-title">Responsible Tourism</h3>
                <p className="about-value-text">
                  We're committed to sustainable travel practices that respect
                  local cultures and protect the environment.
                </p>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      {/* New Our Team Section */}
      <section className="about-team-section section">
        <div className="container">
          <AnimatedElement animation="fade-up">
            <div className="section-header">
              <h2 className="section-title">Our Team</h2>
              <p className="section-subtitle">
                Meet the experts behind TripEasy
              </p>
            </div>
          </AnimatedElement>

          <div className="about-team-grid">

            <AnimatedElement animation="fade-up" delay={100}>
              <div className="about-team-member">
                <div className="about-team-img">
                  <div className="about-team-img-effects">
                    <img
                      src="/assets/team/anshuman.jpg" // Updated path
                      alt="Anshuman Singh"
                      className="about-team-image"
                    />
                  </div>
                  <div className="about-team-icon">
                    <a href="mailto:asinghvns99@gmail.com" className="about-team-social-btn">
                      <i className="fas fa-envelope"></i>
                    </a>
                    <a href="https://x.com/Anshuman_myth?t=7qup-oP1WEjUOzL_jUy5uQ&s=08" className="about-team-social-btn">
                      <svg width="16" height="16" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/anshuman7208?igsh=NTZrNzFydWFjZjA0" className="about-team-social-btn">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/anshuman-singh-819026268?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="about-team-social-btn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
                <div className="about-team-title">
                  <div className="about-team-title-inner">
                    <h4 className="about-team-name">Anshuman Singh</h4>
                    <p className="about-team-position">CEO & Founder</p>
                  </div>
                </div>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={200}>
              <div className="about-team-member">
                <div className="about-team-img">
                  <div className="about-team-img-effects">
                    <img
                      src="/assets/team/vibhu.jpg" // Updated path
                      alt="Vibhu Panchal"
                      className="about-team-image"
                    />
                  </div>
                  <div className="about-team-icon">
                    <a href="mailto:aavibhu@gmail.com" className="about-team-social-btn">
                      <i className="fas fa-envelope"></i>
                    </a>
                    <a href="https://x.com/MeAurum" className="about-team-social-btn">
                      <svg width="16" height="16" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/vibhu.who?igsh=MTBhb3dzbjNuN3ZiYg==" className="about-team-social-btn">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/vibhu-panchal-658b93318/" className="about-team-social-btn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
                <div className="about-team-title">
                  <div className="about-team-title-inner">
                    <h4 className="about-team-name">Vibhu Panchal</h4>
                    <p className="about-team-position">CTO & Co-Founder</p>
                  </div>
                </div>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={200}>
              <div className="about-team-member">
                <div className="about-team-img">
                  <div className="about-team-img-effects">
                    <img
                      src="/assets/team/alis.jpg" // Updated path
                      alt="Alis Patel"
                      className="about-team-image"
                    />
                  </div>
                  <div className="about-team-icon">
                    <a href="mailto:alispatel123098@gmail.com" className="about-team-social-btn">
                      <i className="fas fa-envelope"></i>
                    </a>
                    <a href="https://x.com/alis111patel" className="about-team-social-btn">
                      <svg width="16" height="16" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/alispatel111/" className="about-team-social-btn">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/alispatel/" className="about-team-social-btn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
                <div className="about-team-title">
                  <div className="about-team-title-inner">
                    <h4 className="about-team-name">Alis Patel</h4>
                    <p className="about-team-position">MERN Developer</p>
                  </div>
                </div>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={300}>
              <div className="about-team-member">
                <div className="about-team-img">
                  <div className="about-team-img-effects">
                    <img
                      src="/assets/team/abhishek.jpg" // Updated path
                      alt="Abhishek Jha"
                      className="about-team-image"
                    />
                  </div>
                  <div className="about-team-icon">
                    <a href="mailto:abhishekjha2707@gmail.com" className="about-team-social-btn">
                      <i className="fas fa-envelope"></i>
                    </a>
                    <a href="https://x.com/Abhishek_272003?t=lbk8oEqWQ4TOhw7tt0AYEQ&s=09" className="about-team-social-btn">
                      <svg width="16" height="16" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/abhishek_jha_7/?igsh=MTh2ZG03ejV0MmNpMg%3D%3D#" className="about-team-social-btn">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/abhishek-jha-35732230a/" className="about-team-social-btn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
                <div className="about-team-title">
                  <div className="about-team-title-inner">
                    <h4 className="about-team-name">Abhishek Jha</h4>
                    <p className="about-team-position">MERN Developer</p>
                  </div>
                </div>
              </div>
            </AnimatedElement>
            <AnimatedElement animation="fade-up" delay={200}>
              <div className="about-team-member">
                <div className="about-team-img">
                  <div className="about-team-img-effects">
                    <img
                      src="/assets/team/swastik.jpg" // Updated path
                      alt="Swastik Moolya"
                      className="about-team-image"
                    />
                  </div>
                  <div className="about-team-icon">
                    <a href="mailto:aavibhu@gmail.com" className="about-team-social-btn">
                      <i className="fas fa-envelope"></i>
                    </a>
                    <a href="#" className="about-team-social-btn">
                      <svg width="16" height="16" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor" />
                      </svg>
                    </a>
                    <a href="#" className="about-team-social-btn">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" className="about-team-social-btn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
                <div className="about-team-title">
                  <div className="about-team-title-inner">
                    <h4 className="about-team-name">Swastik Moolya</h4>
                    <p className="about-team-position">Devops Engineer</p>
                  </div>
                </div>
              </div>
            </AnimatedElement>
            <AnimatedElement animation="fade-up" delay={200}>
              <div className="about-team-member">
                <div className="about-team-img">
                  <div className="about-team-img-effects">
                    <img
                      src="/assets/team/divya.jpg" // Updated path
                      alt="Divya Panchariya"
                      className="about-team-image"
                    />
                  </div>
                  <div className="about-team-icon">
                    <a href="mailto:divympan180@gmail.com" className="about-team-social-btn">
                      <i className="fas fa-envelope"></i>
                    </a>
                    <a href="https://x.com/Divy_pan19?t=bHaLCDc3B-ZRkmafyojE3A&s=09" className="about-team-social-btn">
                      <svg width="16" height="16" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/divy_panchariya?igsh=MWt6YXl1eG9rbWFpbA==" className="about-team-social-btn">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/divy-m-panchariya-a47506242?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="about-team-social-btn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
                <div className="about-team-title">
                  <div className="about-team-title-inner">
                    <h4 className="about-team-name">Divya Panchariya</h4>
                    <p className="about-team-position">Chief Marketing Officer</p>
                  </div>
                </div>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={400}>
              <div className="about-team-member">
                <div className="about-team-img">
                  <div className="about-team-img-effects">
                    <img
                      src="/assets/team/ayushi.jpg" // Updated path
                      alt="Ayushi Babu"
                      className="about-team-image"
                    />
                  </div>
                  <div className="about-team-icon">
                    <a href="mailto:ayushibabu26@gmail.com" className="about-team-social-btn">
                      <i className="fas fa-envelope"></i>
                    </a>
                    <a href="https://x.com/AayushiBabu?t=I3a1N8tPY01ZblFM_sxwXw&s=08" className="about-team-social-btn">
                      <svg width="16" height="16" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/aayushi19921?igsh=dWY4Y2I4bjBnN2Y4" className="about-team-social-btn">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/aayushi-babu-050b2a199?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="about-team-social-btn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
                <div className="about-team-title">
                  <div className="about-team-title-inner">
                    <h4 className="about-team-name">Ayushi Babu</h4>
                    <p className="about-team-position">Package Curator</p>
                  </div>
                </div>
              </div>
            </AnimatedElement>
            <AnimatedElement animation="fade-up" delay={400}>
              <div className="about-team-member">
                <div className="about-team-img">
                  <div className="about-team-img-effects">
                    <img
                      src="/assets/team/parth.jpg" // Updated path
                      alt="Parth Raval"
                      className="about-team-image"
                    />
                  </div>
                  <div className="about-team-icon">
                    <a href="mailto:parthraval99@gmail.com" className="about-team-social-btn">
                      <i className="fas fa-envelope"></i>
                    </a>
                    <a href="https://x.com/parthraval99?t=4utDD3K6bthn5Hy1lG6jgA&s=09" className="about-team-social-btn">
                      <svg width="16" height="16" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/its_not_arjun?igsh=MWVyMHY0eDVxZ3I3" className="about-team-social-btn">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/parth-raval-8090911aa" className="about-team-social-btn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
                <div className="about-team-title">
                  <div className="about-team-title-inner">
                    <h4 className="about-team-name">Parth Raval</h4>
                    <p className="about-team-position">Art Director</p>
                  </div>
                </div>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      <section className="about-stats section">
        <div className="container">
          <AnimatedElement animation="fade-up">
            <div className="about-stats-grid">
              <div className="about-stat-item">
                <div className="about-stat-number">
                  <CounterAnimation end={2} suffix="+" />
                </div>
                <div className="about-stat-label">Years Experience</div>
              </div>

              <div className="about-stat-item">
                <div className="about-stat-number">
                  <CounterAnimation end={10000} suffix="+" />
                </div>
                <div className="about-stat-label">Happy Customers</div>
              </div>

              <div className="about-stat-item">
                <div className="about-stat-number">
                  <CounterAnimation end={100} suffix="+" />
                </div>
                <div className="about-stat-label">Destinations</div>
              </div>

              <div className="about-stat-item">
                <div className="about-stat-number">
                  <CounterAnimation end={500} suffix="+" />
                </div>
                <div className="about-stat-label">Packages</div>
              </div>
            </div>
          </AnimatedElement>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;