import { Link } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  ChartNoAxesCombined,
  ReceiptText,
  Sparkles,
  ShieldCheck,
  Search
} from "lucide-react";
import React from "react";

export default function Landing() {
  const features = [
    {
      icon: Camera,
      title: "AI Receipt Scanning",
      description:
        "Upload a receipt and let AI automatically extract the merchant, date, amount and expense category."
    },
    {
      icon: ChartNoAxesCombined,
      title: "Smart Dashboard",
      description:
        "Understand your spending with monthly trends, category breakdowns and key expense statistics."
    },
    {
      icon: ReceiptText,
      title: "Expense Management",
      description:
        "Keep all your expenses organized in one place with easy search, filtering, editing and deletion."
    },
    {
      icon: Sparkles,
      title: "AI-Powered Insights",
      description:
        "Turn your expense data into useful insights and better understand where your money goes."
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <Link to="/" className="landing-logo">
          <div className="logo-mark">
            <ReceiptText size={20} />
          </div>
          <span>AI Expense Tracker</span>
        </Link>

        <div className="nav-actions">
          <Link to="/login" className="nav-login">
            Sign in
          </Link>

          <Link to="/register" className="nav-register">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main>
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              AI-powered personal expense management
            </div>

            <h1>
              Take control of your
              <span> expenses with AI.</span>
            </h1>

            <p className="hero-description">
              AI Expense Tracker helps you capture receipts, automatically
              categorize expenses and understand your spending — all from one
              simple dashboard.
            </p>

            <div className="hero-buttons">
              <Link to="/register" className="primary-button">
                Get Started
                <ArrowRight size={18} />
              </Link>

              <Link to="/login" className="secondary-button">
                Sign in
              </Link>
            </div>

            <div className="hero-note">
              <ShieldCheck size={16} />
              Your expense data is securely associated with your account.
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="hero-preview">
            <div className="preview-window">
              <div className="preview-header">
                <div>
                  <p className="preview-label">OVERVIEW</p>
                  <h3>Good evening</h3>
                </div>

                <div className="preview-user">
                  <div className="preview-avatar">P</div>
                </div>
              </div>

              <div className="preview-stats">
                <div className="preview-card">
                  <span>Total Spending</span>
                  <strong>₹24,850</strong>
                  <small>This month</small>
                </div>

                <div className="preview-card">
                  <span>Average Expense</span>
                  <strong>₹1,242</strong>
                  <small>Per receipt</small>
                </div>
              </div>

              <div className="preview-chart">
                <div className="chart-title">
                  <span>Monthly spending</span>
                  <span>Last 6 months</span>
                </div>

                <div className="chart-bars">
                  <div className="bar bar-1"></div>
                  <div className="bar bar-2"></div>
                  <div className="bar bar-3"></div>
                  <div className="bar bar-4"></div>
                  <div className="bar bar-5"></div>
                  <div className="bar bar-6"></div>
                </div>

                <div className="chart-labels">
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                </div>
              </div>

              <div className="preview-bottom">
                <div className="preview-expenses">
                  <div className="mini-expense">
                    <div className="mini-icon">
                      <ReceiptText size={15} />
                    </div>

                    <div>
                      <strong>Grocery Store</strong>
                      <span>Food</span>
                    </div>

                    <b>₹1,250</b>
                  </div>

                  <div className="mini-expense">
                    <div className="mini-icon">
                      <Camera size={15} />
                    </div>

                    <div>
                      <strong>Coffee Shop</strong>
                      <span>Food</span>
                    </div>

                    <b>₹420</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="features-section">
          <div className="section-heading">
            <p>WHY AI EXPENSE TRACKER</p>

            <h2>
              Everything you need to
              <span> understand your spending.</span>
            </h2>

            <p className="section-description">
              From receipt scanning to spending analysis, manage your expenses
              without manually entering every transaction.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div className="feature-card" key={feature.title}>
                  <div className="feature-icon">
                    <Icon size={22} />
                  </div>

                  <h3>{feature.title}</h3>

                  <p>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section className="how-section">
          <div className="section-heading">
            <p>HOW IT WORKS</p>

            <h2>
              Track an expense in
              <span> seconds.</span>
            </h2>
          </div>

          <div className="steps-grid">
            <div className="step">
              <div className="step-number">01</div>
              <h3>Upload a receipt</h3>
              <p>
                Take a photo or upload an existing receipt from your device.
              </p>
            </div>

            <div className="step">
              <div className="step-number">02</div>
              <h3>Let AI analyze it</h3>
              <p>
                AI extracts important information and identifies the expense
                category.
              </p>
            </div>

            <div className="step">
              <div className="step-number">03</div>
              <h3>Understand your spending</h3>
              <p>
                View the expense in your dashboard and track your spending
                patterns.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="cta-content">
            <div className="cta-icon">
              <Sparkles size={24} />
            </div>

            <h2>Start tracking your expenses smarter.</h2>

            <p>
              Create your account and start organizing your spending with
              AI-powered expense tracking.
            </p>

            <Link to="/register" className="primary-button">
              Create your account
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <div>
          <strong>AI Expense Tracker</strong>
          <span>AI-powered personal expense management.</span>
        </div>

        <span>© 2026 AI Expense Tracker</span>
      </footer>
    </div>
  );
}