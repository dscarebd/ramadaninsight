import { useEffect } from 'react';

interface PageMetaProps {
  title: string;
  description: string;
  keywords?: string;
}

const PageMeta = ({ title, description, keywords }: PageMetaProps) => {
  useEffect(() => {
    const fullTitle = title === 'Ramadan Insight' ? title : `${title} | Ramadan Insight`;
    document.title = fullTitle;

    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', description);
    if (keywords) setMeta('keywords', keywords);
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', description, 'property');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);

    return () => {
      document.title = 'Ramadan Insight';
    };
  }, [title, description, keywords]);

  return null;
};

export default PageMeta;
