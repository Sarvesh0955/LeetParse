import React from 'react';

// Components
import NotOnLeetcodePage from './NotOnLeetcodePage';
import AboutLeetParse from './AboutLeetParse';

/**
 * Component rendered when user is not on a LeetCode problem page
 */
const NonLeetCodePageContent = ({ handleGoToLeetCode }) => {
  return (
    <>
      <NotOnLeetcodePage handleGoToLeetCode={handleGoToLeetCode} />
      <AboutLeetParse />
    </>
  );
};

export default NonLeetCodePageContent;
