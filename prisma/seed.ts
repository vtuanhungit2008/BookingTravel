import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const prisma = new PrismaClient()

async function main() {
  const raw = fs.readFileSync('./prisma/seed-data/hotel_data_sample.json', 'utf8')
  const data = JSON.parse(raw)

  for (const item of data) {
    const profileClerkId = item.profile.clerkId

    // Upsert profile
    await prisma.profile.upsert({
      where: { clerkId: profileClerkId },
      update: {},
      create: {
        clerkId: profileClerkId,
        firstName: item.profile.firstName,
        lastName: item.profile.lastName,
        username: item.profile.username,
        email: item.profile.email,
        profileImage: item.profile.profileImage,
        loyaltyPoints: item.profile.loyaltyPoints || 0,
        createdAt: new Date(item.profile.createdAt),
        updatedAt: new Date(item.profile.updatedAt),
      }
    })

    // Create Property
    await prisma.property.create({
      data: {
        id: item.id,
        name: item.name,
        tagline: item.tagline,
        category: item.category,
     image: item.image,// bạn có thể cập nhật sau
        country: item.country,
        description: item.description,
        price: item.price,
        guests: item.guests,
        bedrooms: item.bedrooms,
        beds: item.beds,
        baths: item.baths,
        amenities: JSON.stringify(item.amenities),
        profileId: profileClerkId,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }
    })
  }

  console.log("✅ Seed completed.")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
