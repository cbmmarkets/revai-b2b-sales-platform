import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/store';
import { fetchLeads } from '../store/slices/leadsSlice';
import { ChartBarIcon, LightningBoltIcon, UserGroupIcon } from '../icons';

// Import dashboard components
import LeadScoreChart from '../components/dashboard/LeadScoreChart';
import RecentLeads from '../components/dashboard/RecentLeads';
import OpportunityForecast from '../components/dashboard/OpportunityForecast';
import SalesPerformance from '../components/dashboard/SalesPerformance';
import ActivityFeed from '../components/dashboard/ActivityFeed';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { leads, isLoading } = useAppSelector((state) => state.leads);
  
  const [stats, setStats] = useState({
    totalLeads: 0,
    qualifiedLeads: 0,
    avgScore: 0,
    conversionRate: 0,
  });

  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  useEffect(() => {
    if (leads.length > 0) {
      const qualifiedLeads = leads.filter((lead) => lead.score >= 70).length;
      const totalScore = leads.reduce((acc, lead) => acc + lead.score, 0);
      const avgScore = Math.round(totalScore / leads.length);
      
      // For demo purposes - normally this would come from actual conversion data
      const conversionRate = Math.round((qualifiedLeads / leads.length) * 0.4 * 100);
      
      setStats({
        totalLeads: leads.length,
        qualifiedLeads,
        avgScore,
        conversionRate,
      });
    }
  }, [leads]);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            {getGreeting()}, {user?.firstName}. Here's what's happening with your sales today.
          </p>
        </div>
        <div>
          <button className="btn btn-primary">
            <span>Export Reports</span>
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <ChartBarIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Leads</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.totalLeads}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="/lead-scoring" className="font-medium text-primary-600 hover:text-primary-900">
                View all
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <LightningBoltIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Qualified Leads</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.qualifiedLeads}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="/lead-scoring" className="font-medium text-primary-600 hover:text-primary-900">
                View details
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <UserGroupIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg. Lead Score</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.avgScore}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="/predictive-analytics" className="font-medium text-primary-600 hover:text-primary-900">
                View analysis
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <ChartBarIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Conversion Rate</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.conversionRate}%</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="/predictive-analytics" className="font-medium text-primary-600 hover:text-primary-900">
                View all
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Lead Score Distribution</h3>
            <div className="mt-2 h-64">
              {/* This would be implemented in the LeadScoreChart component */}
              <div className="flex items-center justify-center h-full text-gray-500">
                Chart visualization would appear here
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Sales Performance</h3>
            <div className="mt-2 h-64">
              {/* This would be implemented in the SalesPerformance component */}
              <div className="flex items-center justify-center h-full text-gray-500">
                Chart visualization would appear here
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent leads and activity sections */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Leads</h3>
            <div className="mt-2">
              {isLoading ? (
                <p className="text-gray-500">Loading recent leads...</p>
              ) : leads.length > 0 ? (
                <div className="overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {leads.slice(0, 5).map((lead) => (
                      <li key={lead.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500">{lead.companyName.charAt(0)}</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {lead.companyName}
                            </p>
                            <p className="text-sm text-gray-500 truncate">{lead.contactName}</p>
                          </div>
                          <div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                lead.score >= 80
                                  ? 'bg-green-100 text-green-800'
                                  : lead.score >= 50
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {lead.score}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500">No leads available.</p>
              )}
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="/lead-scoring" className="font-medium text-primary-600 hover:text-primary-900">
                View all leads
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
            <div className="mt-2 flow-root">
              <ul className="-mb-8">
                {[1, 2, 3, 4].map((item) => (
                  <li key={item}>
                    <div className="relative pb-8">
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                            <UserGroupIcon className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Made contact with <span className="font-medium text-gray-900">Acme Inc</span>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time dateTime="2025-03-22">1h ago</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="/activities" className="font-medium text-primary-600 hover:text-primary-900">
                View all activity
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
