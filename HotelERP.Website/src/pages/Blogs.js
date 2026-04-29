import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  Paper,
  Avatar,
  Divider,
  Pagination,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';

const Blogs = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  const categories = [
    { id: 'all', name: 'All Posts', count: 45 },
    { id: 'travel', name: 'Travel Tips', count: 8 },
    { id: 'food', name: 'Food & Dining', count: 15 },
    { id: 'culture', name: 'Culture', count: 12 },
    { id: 'adventure', name: 'Adventure', count: 10 }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'Top 10 Tourist Destinations in Pakistan',
      excerpt: 'Discover the most beautiful places to visit during your stay in Pakistan, from the northern mountains to southern beaches.',
      content: 'Pakistan is home to some of the world\'s most breathtaking landscapes and cultural treasures...',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'travel',
      author: 'Sarah Ahmed',
      date: '2024-01-15',
      readTime: '8 min read',
      featured: true
    },
    {
      id: 2,
      title: 'A Culinary Journey Through Pakistani Cuisine',
      excerpt: 'Experience the rich flavors and diverse culinary traditions that make Pakistani food unique and unforgettable.',
      content: 'Pakistani cuisine is a beautiful blend of flavors, spices, and cooking techniques...',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'food',
      author: 'Chef Muhammad Ali',
      date: '2024-01-12',
      readTime: '6 min read',
      featured: true
    },
    {
      id: 3,
      title: 'The Majestic Beauty of Northern Pakistan',
      excerpt: 'Explore the stunning mountain ranges, pristine lakes, and breathtaking valleys of Pakistan\'s northern regions.',
      content: 'Northern Pakistan is a paradise for nature lovers and adventure seekers...',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'travel',
      author: 'Ahmad Hassan',
      date: '2024-01-10',
      readTime: '10 min read',
      featured: true
    },
    {
      id: 4,
      title: 'Traditional Pakistani Festivals and Celebrations',
      excerpt: 'Learn about the vibrant festivals and cultural celebrations that bring communities together across Pakistan.',
      content: 'Pakistan\'s cultural calendar is filled with colorful festivals and meaningful celebrations...',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'culture',
      author: 'Fatima Khan',
      date: '2024-01-08',
      readTime: '7 min read',
      featured: false
    },
    {
      id: 5,
      title: 'Adventure Sports in Pakistan: A Thrill Seeker\'s Paradise',
      excerpt: 'From trekking in the Himalayas to white-water rafting, discover the adventure opportunities Pakistan offers.',
      content: 'Pakistan offers some of the world\'s best adventure sports experiences...',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'adventure',
      author: 'Usman Malik',
      date: '2024-01-05',
      readTime: '9 min read',
      featured: false
    },
    {
      id: 6,
      title: 'The Art of Pakistani Hospitality',
      excerpt: 'Discover what makes Pakistani hospitality legendary and how it shapes the travel experience.',
      content: 'Pakistani hospitality is renowned worldwide for its warmth and generosity...',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'culture',
      author: 'Aisha Siddiqui',
      date: '2024-01-03',
      readTime: '5 min read',
      featured: false
    },
    {
      id: 7,
      title: 'Street Food Adventures in Karachi',
      excerpt: 'Explore the vibrant street food scene of Karachi and discover the flavors that define the city.',
      content: 'Karachi\'s street food scene is a culinary adventure waiting to be explored...',
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'food',
      author: 'Zain Abbas',
      date: '2024-01-01',
      readTime: '6 min read',
      featured: false
    },
    {
      id: 8,
      title: 'Exploring the Ancient City of Lahore',
      excerpt: 'Walk through the historic streets of Lahore and discover its rich Mughal heritage and cultural significance.',
      content: 'Lahore, the cultural capital of Pakistan, is a city steeped in history...',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'travel',
      author: 'Bilal Ahmed',
      date: '2023-12-28',
      readTime: '8 min read',
      featured: false
    },
    {
      id: 9,
      title: 'The Spiritual Journey: Sufi Shrines of Pakistan',
      excerpt: 'Explore the mystical world of Sufi shrines and their significance in Pakistani spiritual culture.',
      content: 'Sufi shrines across Pakistan offer a glimpse into the country\'s spiritual heritage...',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'culture',
      author: 'Dr. Rashid Ali',
      date: '2023-12-25',
      readTime: '12 min read',
      featured: false
    },
    {
      id: 10,
      title: 'Trekking the K2 Base Camp: An Epic Adventure',
      excerpt: 'Join us on an incredible journey to the base camp of the world\'s second-highest mountain.',
      content: 'The trek to K2 Base Camp is one of the most challenging and rewarding adventures...',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'adventure',
      author: 'Mountaineer Ali',
      date: '2023-12-22',
      readTime: '15 min read',
      featured: false
    },
    {
      id: 11,
      title: 'Traditional Pakistani Handicrafts and Arts',
      excerpt: 'Discover the rich tradition of Pakistani handicrafts and the artisans who keep these skills alive.',
      content: 'Pakistani handicrafts represent centuries of artistic tradition and cultural heritage...',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'culture',
      author: 'Nadia Rehman',
      date: '2023-12-20',
      readTime: '7 min read',
      featured: false
    },
    {
      id: 12,
      title: 'The Flavors of Punjabi Cuisine',
      excerpt: 'Dive deep into the hearty and flavorful world of Punjabi cuisine and its signature dishes.',
      content: 'Punjabi cuisine is known for its rich flavors and hearty portions...',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'food',
      author: 'Chef Amna',
      date: '2023-12-18',
      readTime: '8 min read',
      featured: false
    },
    {
      id: 13,
      title: 'Wildlife Safari in Pakistan: A Hidden Gem',
      excerpt: 'Explore Pakistan\'s diverse wildlife and the national parks that protect these precious ecosystems.',
      content: 'Pakistan\'s wildlife reserves offer incredible opportunities for nature enthusiasts...',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'adventure',
      author: 'Wildlife Expert',
      date: '2023-12-15',
      readTime: '10 min read',
      featured: false
    },
    {
      id: 14,
      title: 'The Architectural Wonders of Islamabad',
      excerpt: 'Discover the modern architectural marvels and planned beauty of Pakistan\'s capital city.',
      content: 'Islamabad showcases some of the finest examples of modern Islamic architecture...',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'travel',
      author: 'Architect Saad',
      date: '2023-12-12',
      readTime: '6 min read',
      featured: false
    },
    {
      id: 15,
      title: 'Desserts of Pakistan: Sweet Traditions',
      excerpt: 'Indulge in the sweet world of Pakistani desserts and learn about their cultural significance.',
      content: 'Pakistani desserts are an integral part of celebrations and daily life...',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'food',
      author: 'Sweet Chef Hina',
      date: '2023-12-10',
      readTime: '5 min read',
      featured: false
    },
    {
      id: 16,
      title: 'The Coastal Beauty of Karachi and Gwadar',
      excerpt: 'Explore Pakistan\'s stunning coastline and the maritime culture of its coastal cities.',
      content: 'Pakistan\'s coastline offers beautiful beaches and rich maritime heritage...',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'travel',
      author: 'Coastal Explorer',
      date: '2023-12-08',
      readTime: '9 min read',
      featured: false
    },
    {
      id: 17,
      title: 'Traditional Music and Dance of Pakistan',
      excerpt: 'Immerse yourself in the rich musical traditions and folk dances that define Pakistani culture.',
      content: 'Pakistani music and dance traditions vary beautifully across different regions...',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'culture',
      author: 'Music Scholar',
      date: '2023-12-05',
      readTime: '8 min read',
      featured: false
    },
    {
      id: 18,
      title: 'Tea Culture in Pakistan: More Than Just a Drink',
      excerpt: 'Discover how tea became an integral part of Pakistani social life and hospitality.',
      content: 'Tea culture in Pakistan goes beyond just drinking tea - it\'s a social institution...',
      image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'food',
      author: 'Tea Enthusiast',
      date: '2023-12-03',
      readTime: '4 min read',
      featured: false
    },
    {
      id: 19,
      title: 'The Silk Road Legacy in Pakistan',
      excerpt: 'Trace the ancient Silk Road routes through Pakistan and their historical significance.',
      content: 'Pakistan played a crucial role in the ancient Silk Road trade routes...',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'travel',
      author: 'History Professor',
      date: '2023-12-01',
      readTime: '11 min read',
      featured: false
    },
    {
      id: 20,
      title: 'Seasonal Festivals and Their Culinary Delights',
      excerpt: 'Explore how different seasons bring unique festivals and special foods in Pakistani culture.',
      content: 'Each season in Pakistan brings its own festivals and traditional foods...',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'culture',
      author: 'Cultural Writer',
      date: '2023-11-28',
      readTime: '6 min read',
      featured: false
    },
    // Additional 25 blog posts to reach 45 total
    {
      id: 21,
      title: 'Hiking Trails in the Margalla Hills',
      excerpt: 'Discover the best hiking trails near Islamabad and enjoy nature at its finest.',
      content: 'The Margalla Hills offer some of the best hiking experiences near the capital...',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'adventure',
      author: 'Nature Guide',
      date: '2023-11-25',
      readTime: '7 min read',
      featured: false
    },
    {
      id: 22,
      title: 'Pakistani Wedding Traditions and Customs',
      excerpt: 'Learn about the rich traditions and colorful customs of Pakistani weddings.',
      content: 'Pakistani weddings are elaborate celebrations filled with traditions...',
      image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'culture',
      author: 'Wedding Planner',
      date: '2023-11-22',
      readTime: '9 min read',
      featured: false
    },
    {
      id: 23,
      title: 'The Flavors of Balochi Cuisine',
      excerpt: 'Explore the unique and hearty flavors of traditional Balochi dishes.',
      content: 'Balochi cuisine offers a unique blend of flavors and cooking techniques...',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'food',
      author: 'Chef Baloch',
      date: '2023-11-20',
      readTime: '6 min read',
      featured: false
    },
    {
      id: 24,
      title: 'Rock Climbing in Northern Pakistan',
      excerpt: 'Challenge yourself with world-class rock climbing opportunities in the northern regions.',
      content: 'Northern Pakistan offers some of the world\'s best rock climbing...',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'adventure',
      author: 'Climbing Expert',
      date: '2023-11-18',
      readTime: '8 min read',
      featured: false
    },
    {
      id: 25,
      title: 'The Poetry Culture of Pakistan',
      excerpt: 'Dive into the rich literary tradition and poetry culture that defines Pakistani arts.',
      content: 'Poetry holds a special place in Pakistani culture and literature...',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'culture',
      author: 'Literature Professor',
      date: '2023-11-15',
      readTime: '10 min read',
      featured: false
    },
    {
      id: 26,
      title: 'Sindhi Cuisine: A Culinary Journey',
      excerpt: 'Discover the rich flavors and unique dishes of traditional Sindhi cuisine.',
      content: 'Sindhi cuisine offers a delightful mix of vegetarian and non-vegetarian dishes...',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'food',
      author: 'Chef Sindhi',
      date: '2023-11-12',
      readTime: '7 min read',
      featured: false
    },
    {
      id: 27,
      title: 'Paragliding Adventures in Pakistan',
      excerpt: 'Soar through the skies and experience Pakistan\'s landscapes from above.',
      content: 'Paragliding in Pakistan offers breathtaking views and thrilling experiences...',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'adventure',
      author: 'Adventure Pilot',
      date: '2023-11-10',
      readTime: '6 min read',
      featured: false
    },
    {
      id: 28,
      title: 'The Architecture of Mughal Monuments',
      excerpt: 'Explore the magnificent Mughal architecture scattered across Pakistan.',
      content: 'Mughal monuments in Pakistan showcase incredible architectural mastery...',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'culture',
      author: 'Architecture Historian',
      date: '2023-11-08',
      readTime: '12 min read',
      featured: false
    },
    {
      id: 29,
      title: 'Pakistani Breakfast Traditions',
      excerpt: 'Start your day with traditional Pakistani breakfast dishes and their stories.',
      content: 'Pakistani breakfast culture varies across regions but shares common elements...',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'food',
      author: 'Morning Chef',
      date: '2023-11-05',
      readTime: '5 min read',
      featured: false
    },
    {
      id: 30,
      title: 'White Water Rafting in Pakistan',
      excerpt: 'Experience the thrill of white water rafting in Pakistan\'s rushing rivers.',
      content: 'Pakistan\'s rivers offer exciting white water rafting opportunities...',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'adventure',
      author: 'River Guide',
      date: '2023-11-03',
      readTime: '8 min read',
      featured: false
    },
    {
      id: 31,
      title: 'The Textile Heritage of Pakistan',
      excerpt: 'Discover Pakistan\'s rich textile traditions and modern innovations.',
      content: 'Pakistan has a long and rich history in textile production...',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'culture',
      author: 'Textile Expert',
      date: '2023-11-01',
      readTime: '9 min read',
      featured: false
    },
    {
      id: 32,
      title: 'Pakistani Snacks and Street Treats',
      excerpt: 'Explore the world of Pakistani snacks and street food treats.',
      content: 'Pakistani snacks offer a variety of flavors and textures...',
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'food',
      author: 'Snack Lover',
      date: '2023-10-30',
      readTime: '4 min read',
      featured: false
    },
    {
      id: 33,
      title: 'Mountain Biking in Pakistan',
      excerpt: 'Discover the best mountain biking trails and routes across Pakistan.',
      content: 'Mountain biking in Pakistan offers diverse terrains and challenges...',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'adventure',
      author: 'Bike Enthusiast',
      date: '2023-10-28',
      readTime: '7 min read',
      featured: false
    },
    {
      id: 34,
      title: 'The Craftsmanship of Pakistani Carpets',
      excerpt: 'Learn about the intricate art of Pakistani carpet weaving and design.',
      content: 'Pakistani carpets are renowned worldwide for their quality and beauty...',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'culture',
      author: 'Carpet Artisan',
      date: '2023-10-25',
      readTime: '8 min read',
      featured: false
    },
    {
      id: 35,
      title: 'Regional Breads of Pakistan',
      excerpt: 'Discover the variety of traditional breads from different regions of Pakistan.',
      content: 'Each region of Pakistan has its own unique bread traditions...',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'food',
      author: 'Bread Baker',
      date: '2023-10-22',
      readTime: '6 min read',
      featured: false
    },
    {
      id: 36,
      title: 'Cave Exploration in Pakistan',
      excerpt: 'Venture into Pakistan\'s mysterious caves and underground wonders.',
      content: 'Pakistan is home to numerous caves waiting to be explored...',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'adventure',
      author: 'Cave Explorer',
      date: '2023-10-20',
      readTime: '9 min read',
      featured: false
    },
    {
      id: 37,
      title: 'The Jewelry Traditions of Pakistan',
      excerpt: 'Explore the rich traditions of Pakistani jewelry making and design.',
      content: 'Pakistani jewelry combines traditional techniques with modern designs...',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'culture',
      author: 'Jewelry Designer',
      date: '2023-10-18',
      readTime: '7 min read',
      featured: false
    },
    {
      id: 38,
      title: 'Pakistani Rice Dishes Beyond Biryani',
      excerpt: 'Discover the variety of rice dishes in Pakistani cuisine beyond the famous biryani.',
      content: 'While biryani is famous, Pakistan has many other delicious rice dishes...',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'food',
      author: 'Rice Specialist',
      date: '2023-10-15',
      readTime: '8 min read',
      featured: false
    },
    {
      id: 39,
      title: 'Skiing in Pakistan: Hidden Slopes',
      excerpt: 'Discover Pakistan\'s emerging ski destinations and winter sports opportunities.',
      content: 'Pakistan is developing exciting ski destinations in its northern regions...',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'adventure',
      author: 'Ski Instructor',
      date: '2023-10-12',
      readTime: '6 min read',
      featured: false
    },
    {
      id: 40,
      title: 'The Calligraphy Art of Pakistan',
      excerpt: 'Appreciate the beautiful art of Islamic calligraphy in Pakistani culture.',
      content: 'Islamic calligraphy holds a special place in Pakistani artistic traditions...',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'culture',
      author: 'Calligraphy Master',
      date: '2023-10-10',
      readTime: '10 min read',
      featured: false
    },
    {
      id: 41,
      title: 'Pakistani Pickles and Preserves',
      excerpt: 'Learn about the traditional art of making pickles and preserves in Pakistan.',
      content: 'Pakistani households have perfected the art of making pickles and preserves...',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'food',
      author: 'Pickle Expert',
      date: '2023-10-08',
      readTime: '5 min read',
      featured: false
    },
    {
      id: 42,
      title: 'Fishing Adventures in Pakistani Waters',
      excerpt: 'Explore the best fishing spots and techniques in Pakistan\'s waters.',
      content: 'Pakistan offers excellent fishing opportunities in both fresh and salt water...',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'adventure',
      author: 'Fishing Guide',
      date: '2023-10-05',
      readTime: '7 min read',
      featured: false
    },
    {
      id: 43,
      title: 'The Miniature Painting Tradition',
      excerpt: 'Discover the intricate art of miniature painting in Pakistani culture.',
      content: 'Miniature painting is a cherished art form in Pakistani culture...',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'culture',
      author: 'Art Historian',
      date: '2023-10-03',
      readTime: '9 min read',
      featured: false
    },
    {
      id: 44,
      title: 'Pakistani Dairy Products and Traditions',
      excerpt: 'Learn about traditional Pakistani dairy products and their preparation.',
      content: 'Pakistani cuisine features many traditional dairy products...',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'food',
      author: 'Dairy Farmer',
      date: '2023-10-01',
      readTime: '6 min read',
      featured: false
    },
    {
      id: 45,
      title: 'Desert Safari in Thar and Cholistan',
      excerpt: 'Experience the magic of Pakistan\'s deserts through exciting safari adventures.',
      content: 'Pakistan\'s deserts offer unique safari experiences and cultural encounters...',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'adventure',
      author: 'Desert Guide',
      date: '2023-09-28',
      readTime: '8 min read',
      featured: false
    }
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  // Pagination logic
  const totalPages = Math.ceil(regularPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = regularPosts.slice(startIndex, endIndex);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page when category changes
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h1"
              sx={{
                fontFamily: 'Playfair Display',
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '4rem' },
                mb: 3,
                background: 'linear-gradient(45deg, #ffffff 30%, #fbbf24 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Travel Blog
            </Typography>
            <Typography
              variant="h5"
              sx={{
                opacity: 0.9,
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.6,
                mb: 4,
              }}
            >
              Discover Pakistan's hidden gems, cultural treasures, and culinary delights 
              through our curated collection of travel stories and guides.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 8 }}>
        {/* Category Filter */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight="700" sx={{ mb: 4, textAlign: 'center', color: '#111827' }}>
            Explore Our Stories
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={`${category.name} (${category.count})`}
                onClick={() => handleCategoryChange(category.id)}
                variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                sx={{
                  px: 3,
                  py: 1.5,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderRadius: 3,
                  height: 'auto',
                  backgroundColor: selectedCategory === category.id ? '#2563eb' : 'transparent',
                  color: selectedCategory === category.id ? 'white' : '#374151',
                  borderColor: selectedCategory === category.id ? '#2563eb' : '#d1d5db',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: selectedCategory === category.id ? '#1d4ed8' : '#f3f4f6',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Featured Posts */}
        {selectedCategory === 'all' && featuredPosts.length > 0 && (
          <Box sx={{ mb: 8 }}>
            <Typography variant="h4" fontWeight="700" sx={{ mb: 4, color: '#111827' }}>
              Featured Stories
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(3, 1fr)' 
              },
              gap: 4
            }}>
              {featuredPosts.map((post) => (
                <Card
                  key={post.id}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 48px rgba(0, 0, 0, 0.18)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={post.image}
                      alt={post.title}
                    />
                    <Chip
                      label="Featured"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        backgroundColor: '#fbbf24',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                    <Chip
                      label={categories.find(cat => cat.id === post.category)?.name}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        backgroundColor: '#2563eb',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" fontWeight="700" sx={{ mb: 2, color: '#111827', lineHeight: 1.3 }}>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', mb: 3, lineHeight: 1.5, flexGrow: 1 }}>
                      {post.excerpt}
                    </Typography>
                    <Box sx={{ mt: 'auto' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Avatar sx={{ width: 24, height: 24, backgroundColor: '#2563eb', fontSize: '0.75rem' }}>
                          {post.author.charAt(0)}
                        </Avatar>
                        <Typography variant="caption" fontWeight="600" sx={{ color: '#374151' }}>
                          {post.author}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                          {new Date(post.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                          {post.readTime}
                        </Typography>
                      </Box>
                      <Button
                        component={Link}
                        to={`/blog/${post.id}`}
                        variant="contained"
                        endIcon={<ArrowIcon />}
                        size="small"
                        sx={{
                          backgroundColor: '#2563eb',
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          width: '100%',
                          '&:hover': {
                            backgroundColor: '#1d4ed8',
                          },
                        }}
                      >
                        Read More
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* All Posts Grid */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="700" sx={{ mb: 4, color: '#111827' }}>
            {selectedCategory === 'all' ? 'All Stories' : `${categories.find(cat => cat.id === selectedCategory)?.name} Stories`}
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            gap: { xs: 2, sm: 3, md: 4 }
          }}>
            {currentPosts.map((post) => (
              <Card
                key={post.id}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.image}
                    alt={post.title}
                  />
                  <Chip
                    label={categories.find(cat => cat.id === post.category)?.name}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: '#2563eb',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 2, color: '#111827', lineHeight: 1.3 }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280', mb: 3, lineHeight: 1.5, flexGrow: 1 }}>
                    {post.excerpt}
                  </Typography>
                  <Box sx={{ mt: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Avatar sx={{ width: 24, height: 24, backgroundColor: '#2563eb', fontSize: '0.75rem' }}>
                        {post.author.charAt(0)}
                      </Avatar>
                      <Typography variant="caption" fontWeight="600" sx={{ color: '#374151' }}>
                        {post.author}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        {new Date(post.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        {post.readTime}
                      </Typography>
                    </Box>
                    <Button
                      component={Link}
                      to={`/blog/${post.id}`}
                      variant="outlined"
                      size="small"
                      endIcon={<ArrowIcon />}
                      sx={{
                        borderColor: '#2563eb',
                        color: '#2563eb',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: '#2563eb',
                          color: 'white',
                        },
                      }}
                    >
                      Read More
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2,
                    fontWeight: 600,
                    '&.Mui-selected': {
                      backgroundColor: '#2563eb',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#1d4ed8',
                      },
                    },
                  },
                }}
              />
            </Box>
          )}
        </Box>

        {/* Newsletter Subscription */}
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: 'white',
            borderRadius: 4,
          }}
        >
          <Typography variant="h4" fontWeight="700" sx={{ mb: 2 }}>
            Stay Updated
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Subscribe to our newsletter for the latest travel stories and tips from Pakistan.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: 'white',
              color: '#2563eb',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#f8fafc',
              },
            }}
          >
            Subscribe Now
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Blogs;
