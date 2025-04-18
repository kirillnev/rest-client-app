import Image from 'next/image';
import Link from 'next/link';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="github-links">
          <Link
            href="https://github.com/kirillnev"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            kirillnev
          </Link>
          <Link
            href="https://github.com/jull-nevinskaya"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            jull-nevinskaya
          </Link>
          <Link
            href="https://github.com/exact84"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            exact84
          </Link>
        </div>

        <div className="footer-copy">
          <span>© {new Date().getFullYear()} REST Client</span>
        </div>

        <div className="footer-logo">
          <Link
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noopener noreferrer"
            className="course-link"
          >
            <Image
              src="/rss-logo.svg"
              alt="Course Logo"
              width={40}
              height={40}
              className="course-logo"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
