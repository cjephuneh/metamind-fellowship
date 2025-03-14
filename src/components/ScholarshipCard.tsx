
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Calendar, 
  DollarSign, 
  ArrowRight,
  Edit,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";

interface ScholarshipProps {
  scholarship: {
    id: string;
    title: string;
    sponsor: string;
    amount: number;
    deadline: string;
    status: string;
    description: string;
    requirements: string;
  };
  userType: "student" | "sponsor";
  onApply?: () => void;
}

const ScholarshipCard = ({ scholarship, userType, onApply }: ScholarshipProps) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card className={scholarship.status === "closed" ? "opacity-70" : ""}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{scholarship.title}</CardTitle>
            <CardDescription>{scholarship.sponsor}</CardDescription>
          </div>
          {scholarship.status === "closed" && (
            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
              Closed
            </span>
          )}
          {scholarship.status === "open" && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Open
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 line-clamp-2">
            {scholarship.description}
          </p>
          
          <div className="flex items-center text-sm text-gray-500">
            <DollarSign className="h-4 w-4 mr-1" />
            <span>${scholarship.amount.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Deadline: {formatDate(scholarship.deadline)}</span>
          </div>
          
          {userType === "sponsor" && (
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              <span>Applicants: 12</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {userType === "student" && (
          scholarship.status === "open" ? (
            <Button className="w-full bg-purple-500 hover:bg-purple-600" onClick={onApply}>
              Apply Now
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button className="w-full" variant="outline" disabled>
              Application Closed
            </Button>
          )
        )}
        
        {userType === "sponsor" && (
          <div className="w-full flex gap-3">
            <Button variant="outline" className="flex-1">
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Button>
            <Link to={`/scholarships/${scholarship.id}`} className="flex-1">
              <Button className="w-full bg-purple-500 hover:bg-purple-600">
                View Details
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ScholarshipCard;
