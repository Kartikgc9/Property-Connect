import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@propertyconnect.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isVerified: true
    }
  });

  // Create sample agents
  const agent1User = await prisma.user.create({
    data: {
      email: 'john.agent@propertyconnect.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Smith',
      phone: '+1-555-0101',
      role: 'AGENT',
      isVerified: true
    }
  });

  const agent1 = await prisma.agent.create({
    data: {
      userId: agent1User.id,
      licenseNumber: 'RE123456',
      agency: 'Premium Real Estate',
      experience: 5,
      rating: 4.8,
      reviewCount: 42,
      responseTime: 2,
      bio: 'Experienced real estate agent specializing in luxury homes and commercial properties.',
      specialties: ['Luxury Homes', 'Commercial', 'Investment Properties'],
      serviceAreas: ['New York', 'Manhattan', 'Brooklyn', 'Queens']
    }
  });

  const agent2User = await prisma.user.create({
    data: {
      email: 'sarah.agent@propertyconnect.com',
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+1-555-0102',
      role: 'AGENT',
      isVerified: true
    }
  });

  const agent2 = await prisma.agent.create({
    data: {
      userId: agent2User.id,
      licenseNumber: 'RE789012',
      agency: 'City Realty Group',
      experience: 8,
      rating: 4.9,
      reviewCount: 67,
      responseTime: 1,
      bio: 'Top-rated agent with expertise in residential properties and first-time home buyers.',
      specialties: ['Residential', 'First-Time Buyers', 'Condos'],
      serviceAreas: ['Los Angeles', 'Beverly Hills', 'Santa Monica', 'West Hollywood']
    }
  });

  // Create sample buyers
  const buyer1User = await prisma.user.create({
    data: {
      email: 'mike.buyer@email.com',
      password: hashedPassword,
      firstName: 'Mike',
      lastName: 'Davis',
      phone: '+1-555-0201',
      role: 'BUYER',
      isVerified: true
    }
  });

  const buyer1 = await prisma.buyer.create({
    data: {
      userId: buyer1User.id,
      preferredAreas: ['Manhattan', 'Brooklyn'],
      budgetMin: 500000,
      budgetMax: 1000000,
      propertyTypes: ['APARTMENT', 'CONDO'],
      savedProperties: []
    }
  });

  const buyer2User = await prisma.user.create({
    data: {
      email: 'lisa.buyer@email.com',
      password: hashedPassword,
      firstName: 'Lisa',
      lastName: 'Wilson',
      phone: '+1-555-0202',
      role: 'BUYER',
      isVerified: true
    }
  });

  const buyer2 = await prisma.buyer.create({
    data: {
      userId: buyer2User.id,
      preferredAreas: ['Los Angeles', 'Santa Monica'],
      budgetMin: 800000,
      budgetMax: 1500000,
      propertyTypes: ['HOUSE', 'TOWNHOUSE'],
      savedProperties: []
    }
  });

  // Create sample properties
  const properties = [
    {
      title: 'Luxury Manhattan Penthouse',
      description: 'Stunning penthouse with panoramic city views, featuring 3 bedrooms, 3 bathrooms, and a private terrace. Located in the heart of Manhattan with world-class amenities.',
      type: 'APARTMENT',
      price: 2500000,
      bedrooms: 3,
      bathrooms: 3,
      area: 2200,
      address: '123 Park Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10016',
      coordinates: { lat: 40.7589, lng: -73.9776 },
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800'
      ],
      amenities: ['Doorman', 'Gym', 'Pool', 'Rooftop Terrace', 'Concierge'],
      yearBuilt: 2018,
      agentId: agent1.id
    },
    {
      title: 'Modern Brooklyn Loft',
      description: 'Spacious industrial loft with exposed brick walls, high ceilings, and modern finishes. Perfect for creative professionals.',
      type: 'APARTMENT',
      price: 850000,
      bedrooms: 2,
      bathrooms: 2,
      area: 1800,
      address: '456 Smith Street',
      city: 'Brooklyn',
      state: 'NY',
      zipCode: '11201',
      coordinates: { lat: 40.6892, lng: -73.9942 },
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800'
      ],
      amenities: ['Exposed Brick', 'High Ceilings', 'Modern Kitchen', 'Hardwood Floors'],
      yearBuilt: 2015,
      agentId: agent1.id
    },
    {
      title: 'Beverly Hills Family Home',
      description: 'Beautiful family home in prestigious Beverly Hills neighborhood. Features 4 bedrooms, 3 bathrooms, and a large backyard.',
      type: 'HOUSE',
      price: 1800000,
      bedrooms: 4,
      bathrooms: 3,
      area: 3200,
      address: '789 Rodeo Drive',
      city: 'Beverly Hills',
      state: 'CA',
      zipCode: '90210',
      coordinates: { lat: 34.0736, lng: -118.4004 },
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
      ],
      amenities: ['Swimming Pool', 'Garden', 'Garage', 'Security System', 'Fireplace'],
      yearBuilt: 2010,
      lotSize: 8000,
      agentId: agent2.id
    },
    {
      title: 'Santa Monica Beach Condo',
      description: 'Stunning oceanfront condo with direct beach access. Wake up to ocean views every morning in this 2-bedroom, 2-bathroom unit.',
      type: 'CONDO',
      price: 1200000,
      bedrooms: 2,
      bathrooms: 2,
      area: 1400,
      address: '321 Ocean Avenue',
      city: 'Santa Monica',
      state: 'CA',
      zipCode: '90401',
      coordinates: { lat: 34.0195, lng: -118.4912 },
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800'
      ],
      amenities: ['Ocean View', 'Beach Access', 'Balcony', 'Gym', 'Valet Parking'],
      yearBuilt: 2012,
      agentId: agent2.id
    },
    {
      title: 'Downtown LA High-Rise',
      description: 'Modern high-rise apartment in the heart of downtown LA. Close to business district and entertainment venues.',
      type: 'APARTMENT',
      price: 650000,
      bedrooms: 1,
      bathrooms: 1,
      area: 900,
      address: '555 Grand Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90071',
      coordinates: { lat: 34.0522, lng: -118.2437 },
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'
      ],
      amenities: ['City View', 'Gym', 'Rooftop Pool', 'Concierge', 'Parking'],
      yearBuilt: 2020,
      agentId: agent2.id
    }
  ];

  const createdProperties = [];
  for (const propertyData of properties) {
    const property = await prisma.property.create({
      data: propertyData
    });
    createdProperties.push(property);
  }

  // Create sample reviews
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'John was amazing to work with! He helped us find our dream home and made the process smooth.',
      reviewType: 'AGENT',
      userId: buyer1User.id,
      agentId: agent1.id
    }
  });

  await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Beautiful property with great amenities. Highly recommend!',
      reviewType: 'PROPERTY',
      userId: buyer2User.id,
      propertyId: createdProperties[0].id
    }
  });

  // Create sample agent metrics
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  await prisma.agentMetric.create({
    data: {
      agentId: agent1.id,
      month: currentMonth,
      year: currentYear,
      propertiesListed: 5,
      propertiesSold: 3,
      totalRevenue: 75000,
      avgResponseTime: 2,
      customerSatisfaction: 4.8
    }
  });

  await prisma.agentMetric.create({
    data: {
      agentId: agent2.id,
      month: currentMonth,
      year: currentYear,
      propertiesListed: 8,
      propertiesSold: 6,
      totalRevenue: 120000,
      avgResponseTime: 1,
      customerSatisfaction: 4.9
    }
  });

  // Create sample transactions
  await prisma.transaction.create({
    data: {
      type: 'PURCHASE',
      amount: 850000,
      status: 'COMPLETED',
      description: 'Purchase of Brooklyn Loft',
      userId: buyer1User.id,
      buyerId: buyer1.id,
      propertyId: createdProperties[1].id,
      completedAt: new Date()
    }
  });

  // Update property status
  await prisma.property.update({
    where: { id: createdProperties[1].id },
    data: { status: 'SOLD' }
  });

  console.log('✅ Database seeded successfully!');
  console.log(`Created ${properties.length} properties`);
  console.log('Created 2 agents, 2 buyers, and 1 admin');
  console.log('Created sample reviews, metrics, and transactions');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });