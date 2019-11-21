# All colors alive

[@allcolorsalive](https://www.instagram.com/allcolorsalive/) is an Instagram bot that loops through all available HEX colors. It does so by increasing a counter and converting to hexadecimal. This means it will seem to be moving from black to blue for a very long time:

- #000000
- #000001
- #000002
- ...
- #0000ff
- #000100

## Usage

This project uses the serverless framework. You'll need an `S3 bucket` to store the counter in and make sure to give your application access to that bucket. (TODO: add these resources in serverless.yml)

## Configuration

You'll need these environment variables:

`IG_USERNAME`
`IG_PASSWORD`
`S3_BUCKET`
