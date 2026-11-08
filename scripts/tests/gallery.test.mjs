import assert from 'node:assert/strict';
import test from 'node:test';
import { fetchGalleryPhotos, photoUrl } from '../../src/data/gallery.ts';

const sample = id => ({
  id: String(id), width: 1200, height: 800, alt_description: 'A landscape',
  urls: { raw: 'https://images.unsplash.com/photo-example?ixid=keep-me' },
  links: { html: `https://unsplash.com/photos/${id}` },
});

test('fetches all pages, keeps order, dimensions and image tracking, never puts key in URL', async () => {
  const calls = [];
  const result = await fetchGalleryPhotos('test-key', async (url, options) => {
    calls.push(url);
    assert.equal(options.headers.Authorization, 'Client-ID test-key');
    assert.equal(url.searchParams.get('order_by'), 'latest');
    assert.ok(!url.href.includes('test-key'));
    return Response.json(calls.length === 1
      ? Array.from({ length: 30 }, (_, index) => sample(index))
      : [sample(30)]);
  });
  assert.equal(calls.length, 2);
  assert.equal(calls[1].searchParams.get('page'), '2');
  assert.equal(result.length, 31);
  assert.equal(result[30].id, '30');
  assert.equal(result[0].width, 1200);
  assert.equal(new URL(photoUrl(result[0].imageUrl, 720)).searchParams.get('ixid'), 'keep-me');
  assert.equal(new URL(result[0].pageUrl).searchParams.get('utm_source'), 'stephenfang_blog');
});

test('stops on the final pagination header and handles an empty account', async () => {
  let requests = 0;
  const result = await fetchGalleryPhotos('test-key', async () => {
    requests++;
    return Response.json(Array.from({ length: 30 }, (_, index) => sample(index)), {
      headers: { Link: '<https://api.unsplash.com/users/stephenfang/photos?page=1>; rel="first"' },
    });
  });
  assert.equal(requests, 1);
  assert.equal(result.length, 30);
  assert.deepEqual(await fetchGalleryPhotos('test-key', async () => Response.json([])), []);
});

test('fails closed for missing keys, API errors, and unexpected photo links', async () => {
  await assert.rejects(fetchGalleryPhotos(''), /UNSPLASH_ACCESS_KEY/);
  await assert.rejects(fetchGalleryPhotos('test-key', async () => new Response('private error body', { status: 429 })), error => {
    assert.match(error.message, /HTTP 429/);
    assert.ok(!error.message.includes('test-key'));
    assert.ok(!error.message.includes('private error body'));
    return true;
  });
  await assert.rejects(fetchGalleryPhotos('test-key', async () => Response.json([
    { ...sample(1), links: { html: 'javascript:alert(1)' } },
  ])), /无效/);
  await assert.rejects(fetchGalleryPhotos('test-key', async () => { throw new Error('test-key'); }), error => {
    assert.ok(!error.message.includes('test-key'));
    return true;
  });
});
