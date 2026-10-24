import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  MessageCircle,
  Gift,
  HeartHandshake,
  Sparkles,
  Globe2,
  Star,
  Quote,
  PackageCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CATEGORY_IMAGES, SUBCATEGORIES } from "../data/catalog.js";
import ProductCard from "../components/ProductCard.jsx";

const GIFT_TYPES = [
  {
    id: "flowers",
    title: "Flowers",
    text: "A little colour goes a long way",
    image:
      "https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "birthday",
    title: "Birthday gifts",
    text: "Make their day feel bigger",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "personalised",
    title: "Personalised",
    text: "Made to feel like theirs",
    image:
      "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "romance",
    title: "Love & anniversaries",
    text: "For the moments you share",
    image:
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=85",
  },
];

export default function HomePage({
  categories,
  products,
  categoryName,
  go,
  openCategory,
  productCardProps,
  homeContent,
}) {
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const testimonialTrack = useRef(null);
  const [testimonialPaused, setTestimonialPaused] = useState(false);
  const scrollTestimonials = (direction) => {
    const track = testimonialTrack.current;
    if (!track) return;
    const card = track.querySelector(".home-testimonial-card");
    const distance = card
      ? card.getBoundingClientRect().width + 16
      : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * distance, behavior: "smooth" });
  };
  const testimonials = Array.isArray(homeContent?.testimonials)
    ? homeContent.testimonials.filter(
        (item) =>
          item &&
          item.approved !== false &&
          String(item.quote || item.text || "").trim(),
      )
    : [];
  // Show clearly-labelled starter examples until the shop has approved real customer reviews.
  // These are illustrative placeholders, not claims about actual customer experiences.
  const starterTestimonials = [
    {
      id: "starter-thoughtful",
      name: "A thoughtful gifting moment",
      context: "Illustrative example",
      rating: 5,
      quote:
        "The best gifts are the ones that make someone feel remembered, even when you cannot be there in person.",
    },
    {
      id: "starter-easy",
      name: "A smoother gifting experience",
      context: "Illustrative example",
      rating: 5,
      quote:
        "Choosing a gift should feel simple: find something meaningful, confirm the details, and let the shop help with the next steps.",
    },
    {
      id: "starter-special",
      name: "Making the moment special",
      context: "Illustrative example",
      rating: 5,
      quote:
        "From birthdays to little just-because surprises, a carefully chosen gift can make an ordinary day feel special.",
    },
  ];
  const hasRealTestimonials = testimonials.length > 0;
  const displayTestimonials = (
    hasRealTestimonials ? testimonials : starterTestimonials
  ).slice(0, 6);
  useEffect(() => {
    if (testimonialPaused || displayTestimonials.length < 2) return;
    const timer = window.setInterval(() => {
      const track = testimonialTrack.current;
      if (!track) return;
      const atEnd =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 12;
      if (atEnd) track.scrollTo({ left: 0, behavior: "smooth" });
      else scrollTestimonials(1);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [testimonialPaused, displayTestimonials.length]);
  return (
    <main className="home-page">
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">
            <Sparkles size={13} />{" "}
            {homeContent?.announcement || "MAKE DISTANCE FEEL SMALLER"}
          </p>
          <h1>
            {(homeContent?.headline || "Send a little love their way.")
              .split(/\s+/)
              .slice(0, 3)
              .join(" ")}
            <br />
            <em>
              {(homeContent?.headline || "Send a little love their way.")
                .split(/\s+/)
                .slice(3)
                .join(" ")}
            </em>
          </h1>
          <p className="hero-lede">
            {homeContent?.subheadline ||
              "Thoughtful gifts for the people who matter, delivered across borders with care. Find something lovely for every person and every occasion."}
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => go("shop")}>
              Explore the collection <ArrowRight size={16} />
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => go("services")}
            >
              How we can help
            </button>
          </div>
          <div className="hero-assurances">
            <span>
              <HeartHandshake size={16} /> Picked with care
            </span>
            <span>
              <Globe2 size={16} /> Gifts across borders
            </span>
          </div>
        </div>
        <div className="hero-visual" aria-label="Gift inspiration">
          <div className="hero-image-backdrop" />
          <div className="hero-main-photo">
            <img
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1100&q=90"
              alt="Beautifully wrapped gift box"
            />
          </div>
          <div className="hero-photo-card hero-photo-card-top">
            <img
              src="/images/hero-flowers.jpeg"
              alt="Bouquet of red roses and carnations"
            />
            <span>For their special day</span>
          </div>
          <div className="hero-photo-card hero-photo-card-bottom">
            <img
              src="/images/hero-cake.jpeg"
              alt="White celebration cake with colourful sprinkles"
            />
            <span>Sweet moments, made special</span>
          </div>
          <div className="hero-floating-card">
            <Gift size={19} />
            <span>
              <b>Make them feel remembered</b>
              <small>Whatever the distance</small>
            </span>
          </div>
        </div>
        <div className="hero-index">
          <span>01</span>
          <i />
          <span>THOUGHTFUL GIFTING, MADE EASIER</span>
        </div>
      </section>

      <section
        className="trust-strip"
        aria-label="Shopping with God First Gift Shop"
      >
        <div className="trust-item">
          <span className="trust-icon">
            <Truck size={23} />
          </span>
          <span>
            <b>Delivery guidance</b>
            <small>Options confirmed for your destination</small>
          </span>
        </div>
        <div className="trust-item">
          <span className="trust-icon">
            <Gift size={22} />
          </span>
          <span>
            <b>Thoughtful gifting</b>
            <small>Chosen with care for every occasion</small>
          </span>
        </div>
        <div className="trust-item">
          <span className="trust-icon">
            <ShieldCheck size={22} />
          </span>
          <span>
            <b>Secure checkout</b>
            <small>Payments handled through Paystack</small>
          </span>
        </div>
        <div className="trust-item">
          <span className="trust-icon">
            <MessageCircle size={22} />
          </span>
          <span>
            <b>Personal support</b>
            <small>Help when you need a hand</small>
          </span>
        </div>
      </section>

      <section
        className="section container home-testimonials-section"
        onMouseEnter={() => setTestimonialPaused(true)}
        onMouseLeave={() => setTestimonialPaused(false)}
        onFocusCapture={() => setTestimonialPaused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget))
            setTestimonialPaused(false);
        }}
      >
        <div className="testimonial-heading-row">
          <div className="section-heading">
            <div>
              <p className="eyebrow">LOVE, DELIVERED</p>
              <h2>Thoughtful moments, beautifully shared.</h2>
              <p>
                {hasRealTestimonials
                  ? "Experiences shared by customers of God First Gift Shop."
                  : "A glimpse of the thoughtful experience we aim to create with every gift."}
              </p>
            </div>
          </div>
          <div className="testimonial-controls">
            <button
              type="button"
              aria-label="Previous testimonials"
              onClick={() => scrollTestimonials(-1)}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Next testimonials"
              onClick={() => scrollTestimonials(1)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div
          className="home-testimonial-track"
          ref={testimonialTrack}
          aria-label="Testimonial carousel"
        >
          {displayTestimonials.map((item, index) => (
            <article
              className="home-testimonial-card"
              key={item.id || `${item.name || "customer"}-${index}`}
            >
              <div className="testimonial-card-top">
                <Quote className="home-testimonial-quote" size={27} />
                <div
                  className="home-testimonial-stars"
                  aria-label={`${Math.max(1, Math.min(5, Number(item.rating) || 5))} out of 5 stars`}
                >
                  {Array.from(
                    {
                      length: Math.max(
                        1,
                        Math.min(5, Number(item.rating) || 5),
                      ),
                    },
                    (_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ),
                  )}
                </div>
              </div>
              <p className="home-testimonial-text">
                “{String(item.quote || item.text).trim()}”
              </p>
              <div className="home-testimonial-person">
                {item.photo ? (
                  <img src={item.photo} alt="" loading="lazy" />
                ) : (
                  <span>
                    {String(item.name || "Customer")
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                )}
                <div>
                  <b>{item.name || "Customer"}</b>
                  <small>
                    {item.context ||
                      item.location ||
                      (hasRealTestimonials
                        ? "God First customer"
                        : "Illustrative customer story")}
                  </small>
                </div>
                {item.verifiedPurchase && (
                  <span className="testimonial-verified">
                    <PackageCheck size={13} /> Verified
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
        <div className="testimonial-bottom-row">
          <span className="testimonial-scroll-hint">
            <ArrowLeft size={13} /> Swipe or use arrows to explore{" "}
            <ArrowRight size={13} />
          </span>
          <button className="text-link" onClick={() => go("contact")}>
            Share your experience <ArrowRight size={15} />
          </button>
        </div>
        {!hasRealTestimonials && (
          <p className="home-testimonial-disclaimer">
            Illustrative examples only — these are not genuine customer reviews
            or verified purchases.
          </p>
        )}
      </section>

      <section className="section container destination-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">WHERE ARE WE SENDING LOVE?</p>
            <h2>Shop by destination</h2>
            <p>
              Choose where your gift is going, then explore the kinds of gifts
              available there.
            </p>
          </div>
          <button className="text-link" onClick={() => go("shop")}>
            View all collections <ArrowRight size={15} />
          </button>
        </div>
        <div className="category-grid destination-grid">
          {categories.slice(0, 6).map((c, i) => (
            <button
              className="category-tile"
              key={c.id}
              onClick={() => openCategory(c.id)}
            >
              <span
                className="category-photo"
                style={{
                  backgroundImage: `url(${c.image || c.imageUrl || c.photoURL || CATEGORY_IMAGES[c.id] || products.find((p) => p.category === c.id)?.image || CATEGORY_IMAGES.birthday})`,
                }}
              />
              <span className="category-shade" />
              <span className="category-content">
                <small className="category-kicker">
                  {String(i + 1).padStart(2, "0")} / COLLECTION
                </small>
                <b>{c.name.replace(" Gift Items", "")}</b>
                <small className="category-description">{c.description}</small>
                <span className="category-arrow">
                  <ArrowRight size={16} />
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="section gift-type-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A GIFT FOR EVERY KIND OF MOMENT</p>
              <h2>What would make them smile?</h2>
              <p>Start with something they love. We will help with the rest.</p>
            </div>
          </div>
          <div className="gift-type-grid">
            {GIFT_TYPES.map((item, i) => (
              <button
                className="gift-type-card"
                key={item.id}
                onClick={() => openCategory(item.id)}
              >
                <span className="gift-type-image">
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <span className="gift-type-number">0{i + 1}</span>
                </span>
                <span className="gift-type-copy">
                  <b>{item.title}</b>
                  <small>{item.text}</small>
                  <ArrowRight size={17} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section featured-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A FEW CUSTOMER FAVOURITES</p>
              <h2>Gifts worth remembering</h2>
              <p>Beautiful little surprises, ready to make someone's day.</p>
            </div>
            <button className="text-link" onClick={() => go("shop")}>
              Shop all gifts <ArrowRight size={15} />
            </button>
          </div>
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                categoryName={categoryName}
                {...productCardProps}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="home-service-band container">
        <div className="service-band-image">
          <img
            src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1000&q=85"
            alt="Thoughtfully prepared gifts"
            loading="lazy"
          />
        </div>
        <div className="service-band-copy">
          <p className="eyebrow">MORE THAN A GIFT SHOP</p>
          <h2>
            Need a little help
            <br />
            getting it there?
          </h2>
          <p>
            From gift delivery enquiries to parcel tracking support, our team
            can help you work out the next step.
          </p>
          <button className="btn btn-primary" onClick={() => go("services")}>
            Explore our services <ArrowRight size={15} />
          </button>
          <div className="service-band-note">
            <span>01</span>
            <span>Thoughtful service, one step at a time</span>
          </div>
        </div>
      </section>

      <section className="section container seo-gift-guide">
        <p className="eyebrow">THOUGHTFUL GIFTING, MADE SIMPLE</p>
        <h2>An online gift shop for life's special moments.</h2>
        <p>
          Explore birthday gifts, flowers, cakes, gift hampers, personalised
          presents and thoughtful surprises at God First Gift Shop Worldwide.
          Whether you're celebrating a birthday, anniversary, graduation, a new
          arrival or simply letting someone know you care, browse our
          collections to find a gift that feels personal. Delivery options and
          availability depend on the destination and item, so contact our team
          when you need help planning a delivery.
        </p>
        <div className="seo-gift-guide-links">
          <button className="text-link" onClick={() => go("shop")}>
            Browse all gifts <ArrowRight size={15} />
          </button>
          <button className="text-link" onClick={() => go("services")}>
            Explore gifting services <ArrowRight size={15} />
          </button>
          <button className="text-link" onClick={() => go("contact")}>
            Ask our team <ArrowRight size={15} />
          </button>
        </div>
      </section>
      <section className="closing-quote container">
        <span>“</span>
        <p>It's the thought that brings us closer.</p>
        <small>GODFIRSTGIFTSHOPWORLDWIDE</small>
      </section>
    </main>
  );
}
