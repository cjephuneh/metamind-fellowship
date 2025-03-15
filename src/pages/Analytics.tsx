
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

const scholarshipData = [
  { month: "Jan", amount: 2500 },
  { month: "Feb", amount: 4200 },
  { month: "Mar", amount: 3800 },
  { month: "Apr", amount: 5100 },
  { month: "May", amount: 6200 },
  { month: "Jun", amount: 5800 },
  { month: "Jul", amount: 7500 },
  { month: "Aug", amount: 8100 },
  { month: "Sep", amount: 7200 },
  { month: "Oct", amount: 8700 },
  { month: "Nov", amount: 9400 },
  { month: "Dec", amount: 11000 },
];

const categoryData = [
  { name: "STEM", value: 45, color: "#8884d8" },
  { name: "Arts", value: 25, color: "#82ca9d" },
  { name: "Business", value: 15, color: "#ffc658" },
  { name: "Other", value: 15, color: "#ff8042" },
];

const applicationsData = [
  { name: "Week 1", pending: 10, approved: 5, rejected: 3 },
  { name: "Week 2", pending: 12, approved: 8, rejected: 4 },
  { name: "Week 3", pending: 15, approved: 10, rejected: 5 },
  { name: "Week 4", pending: 18, approved: 12, rejected: 7 },
];

const Analytics = () => {
  const [timeFrame, setTimeFrame] = useState("year");
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Explore insights and trends for scholarships and applications
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Scholarships</CardTitle>
            <CardDescription>Overall scholarship distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$89,500</div>
            <div className="text-xs text-muted-foreground mt-1">
              +12.5% from previous year
            </div>
            <div className="h-[150px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={scholarshipData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis hide />
                  <Tooltip
                    formatter={(value) => [`$${value}`, "Amount"]}
                    labelStyle={{ color: "#888" }}
                    contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#8884d8" 
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Categories</CardTitle>
            <CardDescription>Scholarship distribution by field</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-between h-[calc(100%-80px)]">
            <div className="h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, "Percentage"]}
                    contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Applications</CardTitle>
            <CardDescription>Monthly application status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">125</div>
            <div className="text-xs text-muted-foreground mt-1">
              Total applications this month
            </div>
            <div className="h-[150px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={applicationsData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                  />
                  <Bar dataKey="pending" stackId="a" fill="#ffc658" />
                  <Bar dataKey="approved" stackId="a" fill="#82ca9d" />
                  <Bar dataKey="rejected" stackId="a" fill="#ff8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Scholarship Trends</CardTitle>
              <CardDescription>Historical data analysis</CardDescription>
            </div>
            <Tabs defaultValue={timeFrame} onValueChange={setTimeFrame}>
              <TabsList>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="quarter">Quarter</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={scholarshipData}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorFunding" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  formatter={(value) => [`$${value}`, "Amount"]}
                  labelStyle={{ color: "#888" }}
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8884d8" 
                  fillOpacity={1} 
                  fill="url(#colorFunding)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
