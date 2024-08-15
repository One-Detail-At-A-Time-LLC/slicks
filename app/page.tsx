// app/page.tsx
"use client";

import React from 'react';
import { useUser, useOrganization } from "@clerk/clerk-react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import AdminDashboard from './admin-dashboard';
import ManagerDashboard from './manager-dashboard';
import ClientPortal from './client-portal';
import { PermissionDenied } from '../components/PermissionDenied';

export default function Home() {
  const { isSignedIn, user } = useUser();
  const { organization } = useOrganization();

  if (!isSignedIn) {
    return (
      <div>
        <h1>Welcome to Auto Detailing SaaS</h1>
        <SignIn />
        <SignUp />
      </div>
    );
  }

  if (!organization) {
    return <div>Loading organization data...</div>;
  }

  const userRole = organization.membership?.role;

  switch (userRole) {
    case 'org:admin':
      return <AdminDashboard />;
    case 'org:manager_organization':
      return <ManagerDashboard />;
    case 'org:clients':
      return <ClientPortal />;
    case 'org:member':
      return <div>Welcome, {user.fullName}. You are a member of {organization.name}.</div>;
    case 'org:non_member':
      return <div>Welcome, {user.fullName}. You are not yet a member of an organization.</div>;
    default:
      return <PermissionDenied requiredRole="Any valid role" />;
  }
}