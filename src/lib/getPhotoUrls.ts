import { Random } from "unsplash-js/dist/methods/photos/types"

type GetPhotoUrlParams = {
  count: number,
  query: string,
  orientation: string,
}

export const getPhotoUrls = async ({ count, query, orientation }: GetPhotoUrlParams) => {
  const params = new URLSearchParams({
    count: count.toString(),
    query,
    orientation,
    featured: "true",
  })
  const unsplashProxyUrl = new URL(`/api/unsplash/photos/random?${params.toString()}`, window.location.origin)
  const response = await fetch(
    unsplashProxyUrl,
    {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      cache: "force-cache",
    },
  )

  if (response.ok) {
    const data = await response.json()
    if (data.error) {
      console.error(data.error)
      return
    }

    return data.data.response.map((photo: Random) => photo.urls.regular)
  } else {
    // TODO: implement toast notification with error message
    console.error(response.statusText)
  }

  return []
}
