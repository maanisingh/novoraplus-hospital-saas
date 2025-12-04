'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils, Users, Calendar, ClipboardList, TrendingUp, AlertCircle, CheckCircle, Apple } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface DietitianDashboardProps {
  user: any;
}

export default function DietitianDashboard({ user }: DietitianDashboardProps) {
  const stats = {
    activePlans: 156,
    todaysConsultations: 12,
    pendingAssessments: 8,
    specialDietPatients: 42,
    mealPreparedToday: 485,
    nutritionReviews: 15,
    diabeticPatients: 38,
    allergicPatients: 24,
  };

  const todaysSchedule = [
    { time: '09:00 AM', patient: 'Mrs. Sharma', type: 'Initial Assessment', ward: 'General Ward', room: 'G-302' },
    { time: '10:30 AM', patient: 'Mr. Kumar', type: 'Follow-up', ward: 'Cardiology', room: 'C-105' },
    { time: '02:00 PM', patient: 'Ms. Patel', type: 'Diet Planning', ward: 'Maternity', room: 'M-201' },
    { time: '03:30 PM', patient: 'Mr. Singh', type: 'Diabetes Counseling', ward: 'General Ward', room: 'G-405' },
  ];

  const specialDietRequests = [
    { patient: 'John Smith', condition: 'Type 2 Diabetes', diet: 'Low Carb', ward: 'General Ward', priority: 'high' },
    { patient: 'Sarah Johnson', condition: 'Food Allergies', diet: 'Gluten-Free', ward: 'Pediatrics', priority: 'high' },
    { patient: 'Mike Wilson', condition: 'Heart Disease', diet: 'Low Sodium', ward: 'Cardiology', priority: 'medium' },
    { patient: 'Emma Davis', condition: 'Kidney Disease', diet: 'Renal Diet', ward: 'Nephrology', priority: 'high' },
  ];

  const nutritionAssessments = [
    { patient: 'Robert Taylor', age: 58, bmi: 28.5, status: 'Overweight', lastAssessment: '2024-11-20' },
    { patient: 'Lisa Anderson', age: 42, bmi: 22.3, status: 'Normal', lastAssessment: '2024-11-25' },
    { patient: 'James White', age: 65, bmi: 32.1, status: 'Obese', lastAssessment: '2024-11-18' },
  ];

  const mealDistribution = [
    { mealType: 'Regular Diet', count: 285, percentage: 59 },
    { mealType: 'Diabetic Diet', count: 85, percentage: 18 },
    { mealType: 'Low Sodium', count: 55, percentage: 11 },
    { mealType: 'Renal Diet', count: 35, percentage: 7 },
    { mealType: 'Special (Allergies)', count: 25, percentage: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Dietitian Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user?.first_name} {user?.last_name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Diet Plans</CardTitle>
            <ClipboardList className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePlans}</div>
            <p className="text-xs text-muted-foreground">Currently monitored</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Consultations</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todaysConsultations}</div>
            <p className="text-xs text-muted-foreground">Scheduled appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Assessments</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingAssessments}</div>
            <p className="text-xs text-muted-foreground">Requires evaluation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Special Diet Patients</CardTitle>
            <Utensils className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.specialDietPatients}</div>
            <p className="text-xs text-muted-foreground">Custom meal plans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meals Prepared Today</CardTitle>
            <Apple className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mealPreparedToday}</div>
            <p className="text-xs text-muted-foreground">All diet types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nutrition Reviews</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.nutritionReviews}</div>
            <p className="text-xs text-muted-foreground">Due this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Diabetic Patients</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.diabeticPatients}</div>
            <p className="text-xs text-muted-foreground">Under monitoring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Allergy Cases</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.allergicPatients}</div>
            <p className="text-xs text-muted-foreground">Special attention needed</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Meal Distribution */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline">
              <ClipboardList className="mr-2 h-4 w-4" />
              Create Diet Plan
            </Button>
            <Button className="w-full" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              View Schedule
            </Button>
            <Button className="w-full" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Patient Assessments
            </Button>
            <Button className="w-full" variant="outline">
              <Utensils className="mr-2 h-4 w-4" />
              Meal Planning
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Meal Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mealDistribution.map((meal, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{meal.mealType}</span>
                    <span className="text-muted-foreground">{meal.count} meals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-600 rounded-full"
                        style={{ width: `${meal.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">{meal.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Consultation Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {todaysSchedule.map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{appointment.time}</p>
                  <p className="text-sm text-muted-foreground">{appointment.patient}</p>
                  <p className="text-xs text-muted-foreground">{appointment.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{appointment.ward}</p>
                  <p className="text-xs text-muted-foreground">{appointment.room}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Special Diet Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Special Diet Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {specialDietRequests.map((request, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{request.patient}</p>
                  <p className="text-sm text-muted-foreground">{request.condition}</p>
                  <p className="text-xs text-muted-foreground">{request.ward}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{request.diet}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    request.priority === 'high'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {request.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Assessments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Nutrition Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {nutritionAssessments.map((assessment, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{assessment.patient}</p>
                  <p className="text-sm text-muted-foreground">Age: {assessment.age} years</p>
                  <p className="text-xs text-muted-foreground">Last assessed: {assessment.lastAssessment}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">BMI: {assessment.bmi}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    assessment.status === 'Normal'
                      ? 'bg-green-100 text-green-700'
                      : assessment.status === 'Overweight'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {assessment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
