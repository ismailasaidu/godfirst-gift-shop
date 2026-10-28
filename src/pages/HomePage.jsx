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
  const [testimonialPaused, setTestimonialPaused] = useState(false);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [inspirationPaused, setInspirationPaused] = useState(false);
  const [inspirationProducts, setInspirationProducts] = useState([]);
  const inspirationTrack = useRef(null);
  const pickInspirationProducts = (source) => {
    const pool = (Array.isArray(source) ? source : []).filter((product) => {
      if (!product || product.id == null || !product.name) return false;
      if (
        product.available === false ||
        product.isAvailable === false ||
        product.soldOut === true
      )
        return false;
      if (
        product.status &&
        /sold|unavailable|inactive|draft/i.test(String(product.status))
      )
        return false;
      if (
        product.stock !== undefined &&
        product.stock !== null &&
        Number(product.stock) <= 0
      )
        return false;
      return true;
    });
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 12);
  };
  const testimonials = Array.isArray(homeContent?.testimonials)
    ? homeContent.testimonials.filter(
        (item) =>
          item &&
          item.approved !== false &&
          String(item.quote || item.text || "").trim(),
      )
    : [];
  const hasRealTestimonials = testimonials.length > 0;
  // Preview copy is useful while building the section, but must not be represented as verified customer feedback.
  // Each preview quote has a matching image so the slide's visual and message stay in sync.
  const sampleTestimonials = [
    {
      id: "sample-mug",
      name: "Mrs. Ruth",
      context: "Gift inspiration",
      rating: 5,
      quote:
        "I wanted something a little different for someone special, and personalised gifts are such a lovely idea. It’s the little details that make a present more meaningful. I’d definitely recommend God First to anyone looking for a thoughtful gift.",
      photo:
        "https://images.unsplash.com/photo-1514228742587-6b1558f27a1c?auto=format&fit=crop&w=1200&q=90",
      photoAlt: "Personalised ceramic mug gift",
      photoLabel: "A personalised gift",
    },
    {
      id: "sample-birthday",
      name: "Mr. Khan",
      context: "Gift inspiration",
      rating: 5,
      quote:
        "Finding the right birthday gift can be stressful, especially when you want it to feel personal. I love having different gift ideas to choose from instead of settling for something ordinary. I’d recommend checking God First whenever you need a special present.",
      photo:
        "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1200&q=90",
      photoAlt: "Beautifully wrapped birthday present",
      photoLabel: "A birthday surprise",
    },
    {
      id: "sample-flowers",
      name: "Mrs. Amina",
      context: "Gift inspiration",
      rating: 5,
      quote:
        "Sometimes you just want to remind someone how much they mean to you, even when there’s no special occasion. Flowers and thoughtful gifts are a beautiful way to do that. God First has the kind of gift ideas that make those little moments matter.",
      photo: "/images/hero-flowers.jpeg",
      photoAlt: "Bouquet of flowers",
      photoLabel: "Flowers for someone special",
    },
    {
      id: "sample-shirt",
      name: "Mr. Daniel",
      context: "Gift inspiration",
      rating: 5,
      quote:
        "I love gifts that feel like they were chosen for one person and nobody else. Being able to personalise something with a name, message or special design makes the idea even better. I’d definitely recommend exploring the customised gift options.",
      photo:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=90",
      photoAlt: "Folded T-shirt representing a custom clothing gift",
      photoLabel: "A gift made personal",
    },
    {
      id: "sample-hamper",
      name: "Mrs. Grace",
      context: "Gift inspiration",
      rating: 5,
      quote:
        "A gift hamper is such a nice way to make someone feel appreciated because there’s more than one little surprise to enjoy. I like the idea of putting together something thoughtful for birthdays, anniversaries or just to say thank you. It’s definitely a gift option I’d recommend.",
      photo:
        "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1200&q=90",
      photoAlt: "Thoughtfully arranged gift hamper",
      photoLabel: "A gift hamper",
    },
    {
      id: "sample-gifting-experience",
      name: "Miss Sarah",
      context: "Gift inspiration",
      rating: 5,
      quote:
        "There’s something special about finding a gift that says exactly what you want someone to know. I’d rather give something thoughtful than just buy something for the sake of it. God First is a lovely concept for anyone who wants to make their gifts feel more meaningful.",
      photo:
        "https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=1200&q=90",
      photoAlt: "Gift box with ribbon",
      photoLabel: "A thoughtful surprise",
    },
  ];
  const displayTestimonials = (
    hasRealTestimonials ? testimonials : sampleTestimonials
  ).slice(0, 6);
  const activeTestimonial =
    displayTestimonials[activeTestimonialIndex % displayTestimonials.length];
  const reviewPhoto = (() => {
    const supplied =
      activeTestimonial.photo ||
      activeTestimonial.photoURL ||
      activeTestimonial.image;
    if (supplied) return supplied;
    const words =
      `${activeTestimonial.title || ""} ${activeTestimonial.quote || activeTestimonial.text || ""} ${activeTestimonial.product || ""}`.toLowerCase();
    if (/mug|cup|tumbler|flask|bottle/.test(words))
      return "https://images.unsplash.com/photo-1514228742587-6b1558f27a1c?auto=format&fit=crop&w=900&q=85";
    if (/shirt|hoodie|wear|t-shirt|tshirt/.test(words))
      return "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85";
    if (/flower|rose|bouquet/.test(words)) return "/images/hero-flowers.jpeg";
    if (/deliver|arriv|parcel|order|package/.test(words))
      return "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=85";
    if (/photo|memory|frame|picture/.test(words))
      return "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=900&q=85";
    return "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=85";
  })();
  const reviewPhotoAlt =
    activeTestimonial.photoAlt ||
    activeTestimonial.photo_alt ||
    activeTestimonial.imageAlt ||
    (hasRealTestimonials
      ? "Gift related to this customer review"
      : "Gift idea matching this sample review");

  useEffect(() => {
    setActiveTestimonialIndex(0);
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonialPaused || displayTestimonials.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveTestimonialIndex(
        (current) => (current + 1) % displayTestimonials.length,
      );
    }, 5200);
    return () => window.clearInterval(timer);
  }, [testimonialPaused, displayTestimonials.length]);

  const changeTestimonial = (direction) => {
    if (displayTestimonials.length < 2) return;
    setActiveTestimonialIndex(
      (current) =>
        (current + direction + displayTestimonials.length) %
        displayTestimonials.length,
    );
  };
  useEffect(() => {
    setInspirationProducts(pickInspirationProducts(products));
  }, [products]);

  const scrollInspiration = (direction) => {
    const track = inspirationTrack.current;
    if (!track) return;
    const card = track.querySelector(".inspiration-slide");
    const gap = 16;
    const distance = card
      ? card.getBoundingClientRect().width + gap
      : track.clientWidth * 0.8;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    const atStart = track.scrollLeft <= 8;
    if (direction > 0 && atEnd) track.scrollTo({ left: 0, behavior: "smooth" });
    else if (direction < 0 && atStart)
      track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
    else track.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  useEffect(() => {
    if (inspirationPaused || inspirationProducts.length < 2) return;
    const timer = window.setInterval(() => scrollInspiration(1), 3600);
    return () => window.clearInterval(timer);
  }, [inspirationPaused, inspirationProducts.length]);

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
        className="customer-review-feature"
        id="customer-reviews"
        aria-labelledby="customer-reviews-heading"
        onFocusCapture={() => setTestimonialPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setTestimonialPaused(false);
        }}
      >
        <div className="customer-review-feature-inner">
          <div className="customer-review-feature-heading">
            <p className="eyebrow">LOVE, DELIVERED</p>
            <h2 id="customer-reviews-heading">
              Kind words. Thoughtful moments.
            </h2>
            <p>
              We want every gift to help someone feel remembered, appreciated
              and loved.
            </p>
          </div>
          <article className="customer-review-feature-card" aria-live="polite">
            <div className="customer-review-feature-photo">
              <img
                key={activeTestimonial.id || activeTestimonialIndex}
                src={reviewPhoto}
                alt={reviewPhotoAlt}
                loading="eager"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/images/hero-flowers.jpeg";
                }}
              />
              <span className="customer-review-photo-label">
                <Gift size={14} />{" "}
                {activeTestimonial.photoLabel || "A little something special"}
              </span>
            </div>
            <div className="customer-review-feature-copy">
              <Quote
                className="customer-review-feature-quote-icon"
                size={32}
                aria-hidden="true"
              />
              <p className="customer-review-feature-label">
                {hasRealTestimonials ? "CUSTOMER REVIEW" : "THOUGHTFUL GIFTING"}
              </p>
              <blockquote>
                {String(
                  activeTestimonial.quote || activeTestimonial.text,
                ).trim()}
              </blockquote>
              <div className="customer-review-feature-bottom">
                <div className="customer-review-feature-person">
                  <span className="customer-review-avatar">
                    {String(activeTestimonial.name || "G")
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                  <span>
                    <b>{activeTestimonial.name || "God First Gift Shop"}</b>
                    <small>
                      {activeTestimonial.context ||
                        activeTestimonial.location ||
                        (hasRealTestimonials
                          ? "God First Gift Shop customer"
                          : "Gift inspiration for special moments")}
                    </small>
                  </span>
                </div>
                <div
                  className="customer-review-feature-rating"
                  aria-label={`${Math.max(1, Math.min(5, Number(activeTestimonial.rating) || 5))} out of 5 stars`}
                >
                  {Array.from(
                    {
                      length: Math.max(
                        1,
                        Math.min(5, Number(activeTestimonial.rating) || 5),
                      ),
                    },
                    (_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ),
                  )}
                </div>
              </div>
              {displayTestimonials.length > 1 && (
                <div
                  className="customer-review-feature-controls"
                  aria-label="Review carousel controls"
                >
                  <span className="customer-review-feature-count">
                    {activeTestimonialIndex + 1} / {displayTestimonials.length}
                  </span>
                  <div
                    className="customer-review-feature-dots"
                    role="group"
                    aria-label="Choose a review"
                  >
                    {displayTestimonials.map((item, index) => (
                      <button
                        key={item.id || index}
                        type="button"
                        className={
                          index === activeTestimonialIndex ? "is-active" : ""
                        }
                        aria-label={`Show review ${index + 1}`}
                        aria-current={
                          index === activeTestimonialIndex ? "true" : undefined
                        }
                        onClick={() => setActiveTestimonialIndex(index)}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    aria-label="Previous review"
                    onClick={() => changeTestimonial(-1)}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    aria-label="Next review"
                    onClick={() => changeTestimonial(1)}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </article>
        </div>
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

      <section
        className="section gift-type-section inspiration-section"
        onMouseEnter={() => setInspirationPaused(true)}
        onMouseLeave={() => setInspirationPaused(false)}
        onFocusCapture={() => setInspirationPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setInspirationPaused(false);
        }}
      >
        <div className="container">
          <div className="section-heading inspiration-heading">
            <div>
              <p className="eyebrow">A LITTLE SOMETHING SPECIAL</p>
              <h2>A Little Something They’ll Love</h2>
              <p>
                Fresh inspiration from our gift collection, picked for your next
                thoughtful surprise.
              </p>
            </div>
          </div>
          {inspirationProducts.length > 0 ? (
            <div className="inspiration-carousel-viewport">
              <div className="inspiration-product-track" ref={inspirationTrack}>
                {inspirationProducts.map((product) => (
                  <div className="inspiration-slide" key={product.id}>
                    <ProductCard
                      product={product}
                      categoryName={categoryName}
                      {...productCardProps}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="inspiration-empty">
              <Gift size={25} />
              <p>New gift ideas are being prepared.</p>
              <button className="text-link" onClick={() => go("shop")}>
                Explore all gifts <ArrowRight size={15} />
              </button>
            </div>
          )}
          <div className="inspiration-footer">
            <div
              className="inspiration-actions"
              aria-label="Carousel navigation"
            >
              <button
                type="button"
                className="inspiration-arrow"
                aria-label="Previous products"
                onClick={() => scrollInspiration(-1)}
              >
                <ChevronLeft size={17} />
              </button>
              <button
                type="button"
                className="inspiration-arrow"
                aria-label="Next products"
                onClick={() => scrollInspiration(1)}
              >
                <ChevronRight size={17} />
              </button>
            </div>
            <button className="text-link" onClick={() => go("shop")}>
              Explore all gifts <ArrowRight size={15} />
            </button>
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
