import React from 'react';
import './ShareBar.css';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  LinkedinShareButton,
  LinkedinIcon,
  RedditShareButton,
  RedditIcon,
  TelegramShareButton,
  TelegramIcon
} from 'react-share';
export default function ShareBar() {
  return (
      <div className="Demo__container">
        {/* <div className="Demo__some-network">
          <FacebookShareButton
            url="https://helium-tools.web.app"
            quote={`I'm using Helium Tools to monitor my rewards. #heliumtools #hnt #helium #peoplenetwork`}
          >
            <FacebookIcon size={32} round />
          </FacebookShareButton>
        </div>

        <div className="Demo__some-network">
          <TwitterShareButton
            url="https://helium-tools.web.app"
            title="Helium Tools, fast $HNT rewards monitoring tool, #heliumtools #hnt #helium #peoplenetwork"
            className="Demo__some-network__share-button"
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>
        </div>

        <div className="Demo__some-network">
          <LinkedinShareButton url="https://helium-tools.web.app" className="Demo__some-network__share-button">
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
        </div>

        <div className="Demo__some-network">
          <RedditShareButton
            url="https://helium-tools.web.app"
            title="Helium Tools, fast $HNT rewards monitoring tool,  #heliumtools #hnt #helium #peoplenetwork"
            windowWidth={660}
            windowHeight={460}
            className="Demo__some-network__share-button"
          >
            <RedditIcon size={32} round />
          </RedditShareButton>
        </div>

        <div className="Demo__some-network">
          <TelegramShareButton
            url="https://helium-tools.web.app"
            title="Helium Tools, fast $HNT rewards monitoring tool,  #heliumtools #hnt #helium #peoplenetwork"
            className="Demo__some-network__share-button"
          >
            <TelegramIcon size={32} round />
          </TelegramShareButton>
        </div> */}
      </div>
  );
}
