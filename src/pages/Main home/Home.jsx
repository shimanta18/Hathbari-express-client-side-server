
import FeaturedDeals from "../Features/FeaturedDeals"
import Categories from "./Banner/Categories"
import Features from "./Banner/Features"

import HeroBanner from "./Banner/HeroBanner"

const Home = () => {
  return (
    <div>
      <HeroBanner></HeroBanner>
      <Features></Features>
      <Categories></Categories>
      <FeaturedDeals></FeaturedDeals>
    </div>
  )
}

export default Home
