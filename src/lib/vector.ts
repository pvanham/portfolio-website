/** Singleton Upstash Vector index used by the chat API route and ingestion script. */

import { Index } from "@upstash/vector";

let _index: Index | null = null;

export function getIndex(): Index {
  if (!_index) {
    _index = new Index({
      url: process.env.UPSTASH_VECTOR_REST_URL!,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
    });
  }
  return _index;
}
