"use strict";

const AWS = require("aws-sdk");
const { getCounter, setCounter } = require("./lib/counter");
var Jimp = require("jimp");

const { IgApiClient } = require("instagram-private-api");
const ig = new IgApiClient();

ig.state.generateDevice(process.env.IG_USERNAME);

module.exports.post = async (event, context) => {
  await ig.simulate.preLoginFlow();
  const loggedInUser = await ig.account.login(
    process.env.IG_USERNAME,
    process.env.IG_PASSWORD
  );

  let counter = await getCounter();
  const color = parseInt(counter.toString(16) + "ff", 16);

  const image = await new Jimp(1024, 1024, color);

  const buffer = await image.quality(80).getBufferAsync("image/jpeg");

  await ig.publish.photo({
    file: buffer,
    caption: `#color #colors #${counter.toString(16).padStart(6, "0")}`
  });

  const storyImage = await new Jimp(1080, 1920, color);
  const storyBuffer = await storyImage.quality(80).getBufferAsync("image/jpeg");

  await ig.publish.story({
    file: storyBuffer
  });

  await setCounter(counter + 1);
};

module.exports.follow = async (event, context) => {
  await ig.simulate.preLoginFlow();
  const loggedInUser = await ig.account.login(
    process.env.IG_USERNAME,
    process.env.IG_PASSWORD
  );

  const discoveryFeed = ig.feed.discover();

  const discoverItems = await discoveryFeed.items();
  discoverItems.forEach(item => {
    if (Math.round(Math.random() * 10) === 5) {
      console.log("Follow", item);
      if (item && item.user && item.user.pk) {
        ig.friendship.create(item.user.pk);
      }
    } else {
      console.log("Dont follow");
    }
  });

  console.log("Followers feed");

  const followersFeed = ig.feed.accountFollowers(loggedInUser.pk);
  const followerItems = await followersFeed.items();

  followerItems.forEach(user => {
    if (Math.round(Math.random() * 10) === 5) {
      console.log("Follow");
      ig.friendship.create(user.pk);
    } else {
      console.log("Dont follow");
    }
  });
};
