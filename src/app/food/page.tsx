"use client"

import PageHeader from "@/components/page-header"
import FoodFilters from "@/components/food-filters"
import FoodGrid from "@/components/food-grid"

export default function FoodPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader
                title="Find Nearby Restaurants"
                description="Search for great food options near you using location and dietary preferences."
            />
            <FoodFilters />
            <FoodGrid />
        </div>
    )
}
