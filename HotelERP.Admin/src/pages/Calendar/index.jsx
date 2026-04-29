import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import {
  CalendarDaysIcon,
  ChartBarIcon,
  ClockIcon,
  HomeIcon
} from '@heroicons/react/24/outline'

// Import Calendar components
import BookingCalendar from './BookingCalendar'
import CalendarDashboard from './CalendarDashboard'
import RoomTimeline from './RoomTimeline'

const Calendar = () => {
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: ChartBarIcon,
      component: CalendarDashboard,
      description: 'Real-time booking analytics and insights'
    },
    {
      id: 'calendar',
      name: 'Booking Calendar',
      icon: CalendarDaysIcon,
      component: BookingCalendar,
      description: 'Monthly calendar view with booking management'
    },
    {
      id: 'timeline',
      name: 'Room Timeline',
      icon: ClockIcon,
      component: RoomTimeline,
      description: 'Advanced timeline view like Booking.com'
    }
  ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || CalendarDashboard

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg">
              <CalendarDaysIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Calendar Management</h1>
              <p className="text-gray-600">Advanced booking calendar system with timeline view</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </div>

          {/* Active Tab Description */}
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              {tabs.find(tab => tab.id === activeTab)?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-0">
        <ActiveComponent />
      </div>
    </div>
  )
}

export default Calendar;
