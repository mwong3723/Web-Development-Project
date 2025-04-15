import { NextRequest, NextResponse } from 'next/server'

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY
const GEOAPIFY_BASE_URL = 'https://api.geoapify.com/v2/places'

// Dietary preferences to category keywords (customize as needed)
const dietaryToCategories: Record<string, string> = {
    vegan: 'catering.vegan',
    vegetarian: 'catering.vegetarian',
    halal: 'catering.halal',
    kosher: 'catering.kosher',
    gluten_free: 'catering.gluten_free',
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const lat = searchParams.get('lat')
        const lon = searchParams.get('lon')
        const dietary = searchParams.get('dietary') || ''
        const page = parseInt(searchParams.get('page') || '1', 10)
        const limit = parseInt(searchParams.get('limit') || '8', 10)

        if (!lat || !lon) {
            return NextResponse.json(
                { error: 'Missing required lat/lon coordinates' },
                { status: 400 }
            )
        }

        const filter = `circle:${lon},${lat},5000` // 5km radius
        const bias = `proximity:${lon},${lat}`
        const categories = dietaryToCategories[dietary] || 'catering.restaurant'
        const offset = (page - 1) * limit

        const url = `${GEOAPIFY_BASE_URL}?categories=${categories}&filter=${filter}&bias=${bias}&limit=${limit}&offset=${offset}&apiKey=${GEOAPIFY_API_KEY}`

        const res = await fetch(url)
        const data = await res.json()

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching food places:', error)
        return NextResponse.json(
            { error: 'Failed to fetch food places' },
            { status: 500 }
        )
    }
}
