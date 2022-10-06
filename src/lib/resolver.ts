import {IconSet} from "@iconify/tools";

const baseURL = import.meta.env.ASTRO_ICON_API ?? 'https://api.iconify.design/'
const requests = new Map();
const fetchCache = new Map();

export default async function get(pack: string, name: string) {
  const url = new URL(`./${pack}.json?icons=${name}`, baseURL).toString();
  // Handle in-flight requests
  if (requests.has(url)) {
    return await requests.get(url);
  }
  if (fetchCache.has(url)) {
    return fetchCache.get(url);
  }

  let request = async () => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(await res.text());
    }
    const svg = new IconSet(await res.json()).toString(name)
    fetchCache.set(url, svg);
    requests.delete(url);
    return svg;
  };
  let promise = request();
  requests.set(url, promise);
  return await promise;
}