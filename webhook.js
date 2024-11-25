const fastify = require('fastify');
const { randomUUID } = require('node:crypto');

const app = fastify();
app.get('/loop/nextVod', (request, reply) => {
  const channelId = request.query.channelId;
  console.log(`Requesting next VOD for channel ${channelId}`);

  const vodResponse = {
    id: randomUUID(),
    title: 'Example',
    hlsUrl: 'https://lab.cdn.eyevinn.technology/osc/VINN-10/339bd6f7-5db1-4faf-9b95-eb5c90f017f5/index.m3u8'
  };
  reply.send(vodResponse);
});

app.get('/ads/nextVod', async (request, reply) => {
  const channelId = request.query.channelId;
  console.log(`Requesting next VOD for channel ${channelId}`);

  const STITCH_URL = 'https://eyevinnlab-guide.eyevinn-lambda-stitch.auto.prod.osaas.io'
  const response = await fetch(new URL('/stitch/', STITCH_URL),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uri: 'https://lab.cdn.eyevinn.technology/osc/VINN-10/339bd6f7-5db1-4faf-9b95-eb5c90f017f5/index.m3u8',
        breaks: [
          { 
            pos: 0,
            duration: 10000,
            url: 'https://lab.cdn.eyevinn.technology/osc/probably_the_best/006386b7-7aa8-46a2-86ce-3f2ecfb7e1a7/index.m3u8'
          },
          {
            pos: 20000,
            duration: 10000,
            url: 'https://lab.cdn.eyevinn.technology/osc/probably_the_best/006386b7-7aa8-46a2-86ce-3f2ecfb7e1a7/index.m3u8'
          }
        ]
      })
    }
  )
  if (response.ok) {
    const stitchedVod = await response.json();
    const vodResponse = {
      id: randomUUID(),
      title: 'Example with ads',
      hlsUrl: new URL(stitchedVod.uri, STITCH_URL).toString()
    };
    reply.send(vodResponse);
  } else {
    const vodResponse = {
      id: randomUUID(),
      title: 'Example',
      hlsUrl: 'https://lab.cdn.eyevinn.technology/osc/VINN-10/339bd6f7-5db1-4faf-9b95-eb5c90f017f5/index.m3u8'
    };
    reply.send(vodResponse);  
  }
});

app.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) console.error(err);
  console.log(`Server listening at ${address}`);
});

