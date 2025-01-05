import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [salesByBranch, setSalesByBranch] = useState([]);
  const [salesByProduct, setSalesByProduct] = useState([]);
  const [salesOverTime, setSalesOverTime] = useState([]);
  const [customerDemographics, setCustomerDemographics] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedProductLine, setSelectedProductLine] = useState('all');
  const [selectedCustomerType, setSelectedCustomerType] = useState('all');
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Build query string from filters
  const getQueryString = () => {
    const params = new URLSearchParams();
    if (selectedBranch !== 'all') params.append('branch', selectedBranch);
    if (selectedProductLine !== 'all') params.append('product_line', selectedProductLine);
    if (selectedCustomerType !== 'all') params.append('customer_type', selectedCustomerType);
    if (dateRange.from) params.append('date_from', format(dateRange.from, 'yyyy-MM-dd'));
    if (dateRange.to) params.append('date_to', format(dateRange.to, 'yyyy-MM-dd'));
    return params.toString();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const queryString = getQueryString();
      const baseUrl = 'http://localhost:5000/api';

      try {
        const [
          summaryData,
          branchData,
          productData,
          timeData,
          demographicsData
        ] = await Promise.all([
          fetch(`${baseUrl}/summary?${queryString}`).then(res => res.json()),
          fetch(`${baseUrl}/sales-by-branch?${queryString}`).then(res => res.json()),
          fetch(`${baseUrl}/sales-by-product-line?${queryString}`).then(res => res.json()),
          fetch(`${baseUrl}/sales-over-time?${queryString}`).then(res => res.json()),
          fetch(`${baseUrl}/customer-demographics?${queryString}`).then(res => res.json())
        ]);

        setSummary(summaryData);
        setSalesByBranch(Object.entries(branchData).map(([name, value]) => ({ name, value })));
        setSalesByProduct(Object.entries(productData).map(([name, value]) => ({ name, value })));
        setSalesOverTime(timeData);
        setCustomerDemographics(demographicsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedBranch, selectedProductLine, selectedCustomerType, dateRange]);

  const FilterBar = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Select value={selectedBranch} onValueChange={setSelectedBranch}>
        <SelectTrigger>
          <SelectValue placeholder="Select Branch" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Branches</SelectItem>
          <SelectItem value="A">Branch A</SelectItem>
          <SelectItem value="B">Branch B</SelectItem>
          <SelectItem value="C">Branch C</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedProductLine} onValueChange={setSelectedProductLine}>
        <SelectTrigger>
          <SelectValue placeholder="Select Product Line" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Products</SelectItem>
          <SelectItem value="Electronic accessories">Electronic Accessories</SelectItem>
          <SelectItem value="Fashion accessories">Fashion Accessories</SelectItem>
          <SelectItem value="Food and beverages">Food and Beverages</SelectItem>
          <SelectItem value="Health and beauty">Health and Beauty</SelectItem>
          <SelectItem value="Home and lifestyle">Home and Lifestyle</SelectItem>
          <SelectItem value="Sports and travel">Sports and Travel</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedCustomerType} onValueChange={setSelectedCustomerType}>
        <SelectTrigger>
          <SelectValue placeholder="Select Customer Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Customers</SelectItem>
          <SelectItem value="Member">Members</SelectItem>
          <SelectItem value="Normal">Normal</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                `${format(dateRange.from, 'LLL dd, y')} - ${format(dateRange.to, 'LLL dd, y')}`
              ) : (
                format(dateRange.from, 'LLL dd, y')
              )
            ) : (
              'Select Date Range'
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="range"
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={setDateRange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-semibold">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Supermarket Sales Dashboard</h1>
        <p className="text-gray-600 mt-2">Comprehensive sales analysis and insights</p>
      </div>

      {/* Filters */}
      <FilterBar />

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <div className="text-lg">Updating data...</div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">${summary?.total_sales.toLocaleString()}</div>
            <p className="text-gray-600 mt-2">Total Sales</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{summary?.average_rating.toFixed(2)}</div>
            <p className="text-gray-600 mt-2">Average Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{summary?.total_customers.toLocaleString()}</div>
            <p className="text-gray-600 mt-2">Total Customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{summary?.product_lines}</div>
            <p className="text-gray-600 mt-2">Product Lines</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales by Branch */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Branch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesByBranch}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#0088FE" name="Sales ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sales by Product Line */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Product Line</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByProduct}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    label
                  >
                    {salesByProduct.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Over Time Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sales Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Total" stroke="#8884d8" name="Daily Sales ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Customer Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerDemographics?.gender ? 
                      Object.entries(customerDemographics.gender).map(([name, value]) => ({
                        name,
                        value
                      })) : []}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    label
                  >
                    {Object.keys(customerDemographics?.gender || {}).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerDemographics?.customer_type ? 
                      Object.entries(customerDemographics.customer_type).map(([name, value]) => ({
                        name,
                        value
                      })) : []}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    label
                  >
                    {Object.keys(customerDemographics?.customer_type || {}).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;