import { PairCount, VALID_PAIR_COUNTS } from "@/app/components/settings";
import { NextResponse } from "next/server";
import { createApi, Orientation } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY!,
})

const VALID_ORIENTATIONS = ['landscape', 'portrait', 'squarish']

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || undefined
  const featured = Boolean(searchParams.get('featured'))
  const rawCount = searchParams.get('count')
  const rawOrientation = searchParams.get('orientation') || undefined

  let missingRequiredParams: string[] = []

  let count: number | undefined
  if (rawCount) {
    if (!VALID_PAIR_COUNTS.includes(parseInt(rawCount))) {
      return NextResponse.json({ error: `Invalid count: ${rawCount}. Must be one of: ${VALID_PAIR_COUNTS.join(', ')}` }, { status: 400 })
    }
    count = parseInt(rawCount) as PairCount
  } else {
    missingRequiredParams.push('count')
  }

  let orientation: Orientation | undefined
  if (rawOrientation) {
    if (!VALID_ORIENTATIONS.includes(rawOrientation)) {
      return NextResponse.json({ error: `Invalid orientation: ${rawOrientation}. Must be one of: ${VALID_ORIENTATIONS.join(', ')}` }, { status: 400 })
    }
    orientation = rawOrientation as Orientation
  } else {
    missingRequiredParams.push('orientation')
  }

  if (missingRequiredParams.length > 0) {
    return NextResponse.json({ error: `Missing required parameters: ${missingRequiredParams.join(', ')}` }, { status: 400 })
  }

  const data = await unsplash.photos.getRandom({
    query,
    count,
    orientation,
    featured,
  }).catch((error) => {
    return { errors: [error.message] }
  })

  if (data.errors) {
    return NextResponse.json({ error: data.errors }, { status: 500 })
  }

  return NextResponse.json({ data })
}
