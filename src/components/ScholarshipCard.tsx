
import { useState } from "react";
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
  Users,
  Eye,
  Book,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import ApplyForGrantModal from "./ApplyForGrantModal";

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
  const [showApplyModal, setShowApplyModal] = useState(false);
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate days remaining until deadline
  const calculateDaysRemaining = (deadlineString: string) => {
    const today = new Date();
    const deadline = new Date(deadlineString);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const daysRemaining = calculateDaysRemaining(scholarship.deadline);
  const isUrgent = daysRemaining <= 7 && daysRemaining > 0;

  const handleApplyClick = () => {
    if (onApply) onApply();
    setShowApplyModal(true);
  };

  const handleCloseModal = () => {
    setShowApplyModal(false);
  };

  return (
    <>
      <Card className={`hover:shadow-md transition-all ${scholarship.status === "closed" ? "opacity-70" : "hover:border-purple-200"}`}>
        <div className={`h-2 w-full rounded-t-lg ${scholarship.status === "open" ? "bg-purple-500" : "bg-gray-300"}`} />
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{scholarship.title}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Book className="h-3 w-3" /> 
                {scholarship.sponsor}
              </CardDescription>
            </div>
            {scholarship.status === "closed" && (
              <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                <Clock className="mr-1 h-3 w-3" />
                Closed
              </Badge>
            )}
            {scholarship.status === "open" && (
              <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Open
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 line-clamp-2">
              {scholarship.description}
            </p>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center text-sm text-gray-500">
                <DollarSign className="h-4 w-4 mr-1 text-purple-500" />
                <span className="font-medium">${scholarship.amount.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1 text-purple-500" />
                <span>Deadline: {formatDate(scholarship.deadline)}</span>
                
                {scholarship.status === "open" && isUrgent && (
                  <Badge className="ml-2 bg-red-100 text-red-800 border-red-200 hover:bg-red-200">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    {daysRemaining} days left
                  </Badge>
                )}
              </div>
              
              {userType === "sponsor" && (
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1 text-purple-500" />
                  <span>Applicants: 12</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {userType === "student" && (
            scholarship.status === "open" ? (
              <div className="w-full flex gap-2">
                <Button variant="outline" className="flex-1">
                  <MessageCircle className="mr-1 h-4 w-4" />
                  Contact
                </Button>
                <Button className="flex-1 bg-purple-500 hover:bg-purple-600" onClick={handleApplyClick}>
                  Apply Now
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
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
                  <Eye className="mr-1 h-4 w-4" />
                  View Details
                </Button>
              </Link>
            </div>
          )}
        </CardFooter>
      </Card>
      
      {showApplyModal && (
        <ApplyForGrantModal
          isOpen={showApplyModal}
          onClose={handleCloseModal}
          scholarshipTitle={scholarship.title}
          scholarshipId={scholarship.id}
        />
      )}
    </>
  );
};

export default ScholarshipCard;
