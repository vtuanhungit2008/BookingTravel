'use client'

import VisualSearch from "../ai/clip"
import CallToAction from "../landingpage/CallToAction"
import Features from "../landingpage/Feature"

import RoomCategories from "../landingpage/RoomCategories"
import DestinationGrid from "./DestinationGrid"
import HeroSlider from "./HeroSlider"



export default function LandingHero() {
  return (
    <section>
    <HeroSlider/>
    <DestinationGrid/>
    <Features/>
    <RoomCategories/>
    <VisualSearch/>
    </section>
  )
}
