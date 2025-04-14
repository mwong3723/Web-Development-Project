import { NextRequest, NextResponse } from 'next/server'

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY
const GEOAPIFY_BASE_URL = 'https://api.geoapify.com/v2/places'

// Experience to categories map
const experienceToCategories: Record<string, string> = {
    cultural: 'heritage,tourism.sights',
    nature: 'natural,leisure.park,national_park',
    city: 'tourism.attraction,tourism.sights',
    family: 'entertainment,leisure.playground',
    entertainment: 'entertainment',
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const lat = searchParams.get('lat')
        const lon = searchParams.get('lon')
        const experience = searchParams.get('experience') || ''
        const accessibility = searchParams.get('accessibility') || ''

        if (!lat || !lon) {
            return NextResponse.json(
                { error: 'Missing required lat/lon coordinates' },
                { status: 400 }
            )
        }

        const filter = `circle:${lon},${lat},5000` // 5km radius
        const bias = `proximity:${lon},${lat}`
        const categories = experienceToCategories[experience] || 'tourism.attraction,tourism.sights,natural'
        const conditions = accessibility ? `&conditions=${accessibility}` : ''

        const url = `${GEOAPIFY_BASE_URL}?categories=${categories}&filter=${filter}&bias=${bias}&limit=20${conditions}&apiKey=${GEOAPIFY_API_KEY}`

        const res = await fetch(url)
        const data = await res.json()

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching destinations:', error)
        return NextResponse.json(
            { error: 'Failed to fetch destinations' },
            { status: 500 }
        )
    }
}
