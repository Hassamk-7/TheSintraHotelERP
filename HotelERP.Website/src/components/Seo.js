import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const Seo = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  robots,
  author,
  siteName: siteNameProp
}) => {
  const siteName = siteNameProp || 'Luxury Hotel';
  const defaultDescription = 'Luxury Hotel - Experience the finest hospitality in Pakistan with premium rooms, suites, and world-class amenities. Book your perfect stay today.';
  const defaultKeywords = 'luxury hotel, premium accommodation, Pakistan hotels, hotel booking, luxury suites, hospitality';
  const finalAuthor = author || siteName;

  const finalTitle = title ? `${title} | ${siteName}` : siteName;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords || defaultKeywords;
  const finalRobots = robots || 'index,follow';
  const finalOgImage = ogImage || '/logo512.png';

  const helmetKey = canonical || finalTitle;

  useEffect(() => {
    const upsertMetaByName = (name, content) => {
      if (!content) return;
      let tag = document.head.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    const upsertMetaByProperty = (property, content) => {
      if (!content) return;
      let tag = document.head.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    const upsertLink = (rel, href) => {
      if (!href) return;
      let tag = document.head.querySelector(`link[rel="${rel}"]`);
      if (!tag) {
        tag = document.createElement('link');
        tag.setAttribute('rel', rel);
        document.head.appendChild(tag);
      }
      tag.setAttribute('href', href);
    };

    document.title = finalTitle;
    upsertMetaByName('description', finalDescription);
    upsertMetaByName('keywords', finalKeywords);
    upsertMetaByName('robots', finalRobots);
    upsertMetaByName('author', finalAuthor);
    upsertMetaByProperty('og:site_name', siteName);
    upsertMetaByProperty('og:title', finalTitle);
    upsertMetaByProperty('og:description', finalDescription);
    upsertMetaByProperty('og:type', ogType);
    upsertMetaByProperty('og:image', finalOgImage);
    upsertMetaByName('twitter:card', 'summary_large_image');
    upsertMetaByName('twitter:title', finalTitle);
    upsertMetaByName('twitter:description', finalDescription);
    upsertMetaByName('twitter:image', finalOgImage);
    if (canonical) {
      upsertLink('canonical', canonical);
    }
  }, [
    canonical,
    finalAuthor,
    finalDescription,
    finalKeywords,
    finalOgImage,
    finalRobots,
    finalTitle,
    ogType,
    siteName,
  ]);

  return (
    <Helmet key={helmetKey} prioritizeSeoTags defer={false}>
      <title>{finalTitle}</title>
      <meta key="description" data-react-helmet="true" name="description" content={finalDescription} />
      <meta key="keywords" data-react-helmet="true" name="keywords" content={finalKeywords} />
      <meta key="robots" data-react-helmet="true" name="robots" content={finalRobots} />
      <meta key="author" data-react-helmet="true" name="author" content={finalAuthor} />

      {canonical ? <link key="canonical" data-react-helmet="true" rel="canonical" href={canonical} /> : null}

      <meta key="og:site_name" data-react-helmet="true" property="og:site_name" content={siteName} />
      <meta key="og:title" data-react-helmet="true" property="og:title" content={finalTitle} />
      <meta key="og:description" data-react-helmet="true" property="og:description" content={finalDescription} />
      <meta key="og:type" data-react-helmet="true" property="og:type" content={ogType} />
      <meta key="og:image" data-react-helmet="true" property="og:image" content={finalOgImage} />

      <meta key="twitter:card" data-react-helmet="true" name="twitter:card" content="summary_large_image" />
      <meta key="twitter:title" data-react-helmet="true" name="twitter:title" content={finalTitle} />
      <meta key="twitter:description" data-react-helmet="true" name="twitter:description" content={finalDescription} />
      <meta key="twitter:image" data-react-helmet="true" name="twitter:image" content={finalOgImage} />
    </Helmet>
  );
};

export default Seo;
